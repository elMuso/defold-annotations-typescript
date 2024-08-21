import config from "./config";
import { patch_index } from "./patches";
import settings from "./settings";
import {
	MModule,
	MType,
	MVar,
	MFunc,
	MParameter,
	MProperty,
	MMessage,
} from "./types.d";
import { Utils } from "./utils";
function indent_text(docs: string, indent: number): string {
	let lines = docs.split("\n");
	let output = [];
	let pretext = "\t".repeat(indent);
	for (const line of lines) {
		output.push(pretext + line);
	}
	return output.join("\n");
}

function gen_params(input: MParameter[]): string {
	let output = [];
	for (const param of input) {
		let types = param.types.join(" | ");
		output.push(param.name + (param.isOptional ? "?" : "") + ": " + types);
	}

	return output.join(", ");
}

function gen_return(input: MParameter[]): string {
	let output = [];
	for (const param of input) {
		let types = param.types.join("|");
		output.push(types);
	}
	if (output.length == 0) {
		return ": void";
	} else if (output.length > 1) {
		return ": LuaMultiReturn<[" + output.join(", ") + "]>";
	}
	return ": " + output[0];
}

function patch(line: string, namespace: string): string {
	let replacedToken = ""; //In an ideal world this is called with the same string
	for (const key in patch_index) {
		if (namespace == key) {
			let patches = patch_index[key];
			for (const query in patches) {
				let vals = query.split("|||");
				if (vals.length != 2) {
					Utils.log("Error, invalid query for " + namespace + " - " + query)

					return line;
				}
				if (line.includes(vals[0])) {
					//Check if it's the same query, otherwise throw a warning 
					if (vals[0] != replacedToken && replacedToken != "") {
						Utils.log("Warning, multiple query for " + namespace + " - " + query + "   ... To broad!!")
					}
					//We have a match. now replace
					if (!line.includes(vals[1])) {
						Utils.log(line)
						Utils.log("Error, invalid query value for " + namespace + " - " + query)
						return line
					}
					const cacheName = namespace + "|||" + query;
					if (!config.used_querys.includes(cacheName)) {
						config.used_querys.push(cacheName)
					}
					line = line.replace(vals[1], patches[query])
					replacedToken = vals[0];
				}
			}
		}
	}
	return line;
}

function generate_function(input: MFunc): string {
	let lout = "";
	if (settings.generate_documentation_parameter_info) {
		for (const param of input.params) {
			lout = lout + "\n@param " + param.name + " " + param.documentation;
		}
		for (const param of input.return_value) {
			lout = lout + "\n@returns " + param.documentation;
		}
	}
	let output = make_documentation(lout + "\n" + input.documentation);

	//! Edgecase. go.delete error
	if (input.name == "delete") {
		return (
			output +
			"\nfunction delete$(id: string | hash | url | hash[]| Record<any,any>, recursive?: boolean):void;\nexport { delete$ as delete }"
		);
	}
	let funcline =

		"\nexport function " +
		input.name +
		"(" +
		gen_params(input.params) +
		")" +
		gen_return(input.return_value) +
		";\n";

	output = output + patch(funcline, input.owner);
	return output;
}

function generate_variable(input: MVar): string {
	//! Edgecase. Json.null error
	if (input.name == "null") {
		return "let null$: any\nexport { null$ as null }";
	}
	let typerep = input.type;
	if (typerep == "nil") {
		typerep = "constant";
	}
	let category = input.name.substring(0, input.name.lastIndexOf("_"));
	let output = make_documentation(input.documentation);
	output += `\nexport const ${input.name}:number & { readonly __brand: "${input.owner}.${category}" };`;
	return output;
}

function make_documentation(docs: string): string {
	if (!docs || !settings.generate_documentation) return "";
	let lines = docs.split("\n");
	let mlines = [];
	let output = "";
	for (const line of lines) {
		mlines.push("* " + line);
	}
	output = mlines.join("\n");
	return "\n/**\n" + output + "\n" + "*/";
}

function gen_types(params: MParameter[]): string {
	if (params.length == 0) return "";
	let output = "{";
	let tps = [];
	for (const param of params) {
		tps.push(param.name + "?: " + param.types.join("|"));
	}
	output = output + tps.join(",") + "}";
	return output;
}

function create_nested_tree(
	rootName: string,
	input: MModule,
	generator: (item: any) => string
): string {
	let cache: Record<string, any> = {};
	let output = `export const ${rootName} = {`;
	//Use this fucntion to wrap text. For now the order of wrapping is reversed but if defold
	//Decides to add 3 nested namespaces it will break.
	const wrapper = function (name: string, input: string, indent: number) {
		return indent_text(
			`\n${name}: {` + indent_text(input, 1) + "\n},",
			indent
		);
	};
	//We organize every item in their respective category and namespace
	for (const item of input.items) {
		if (item.tag == MType.PROPERTY || item.tag == MType.MESSAGE) {
			let itm = item as MProperty;
			if (!cache[itm.owner]) {
				cache[itm.owner] = [];
			}
			cache[itm.owner].push(item);
		}
	}

	for (const name in cache) {
		let localOutput = "";
		if (!Object.prototype.hasOwnProperty.call(cache, name)) return "";
		const items = cache[name];
		for (const item of items) {
			localOutput = localOutput + generator(item);
		}
		let indn = 0;
		let namespaces = name.split(".");
		for (const namespc of namespaces) {
			indn = indn + 1;
			localOutput = wrapper(namespc, localOutput, indn);
		}
		output = output + localOutput;
	}
	output = output + "\n}";
	return output;
}

//! WARNING, this code has grown out quite a bit and it's fragile.
//! Be careful while editing
function create_optional_output(input: MModule): string {
	return create_nested_tree("dmsg", input, (item) => {
		let localoutput = "";
		let itm = item as MMessage;
		let isReport = item.name.includes("*");
		localoutput = localoutput + make_documentation(itm.documentation);
		let itemName = itm.name.substring(
			isReport == true ? 1 : 0,
			itm.name.length
		);
		//The message input received
		let tps = gen_types(itm.params);
		let hasData = tps.length != 0;
		if (isReport) {
			localoutput = localoutput + `\n${itemName}: hash("${itemName}"),`;
		} else if (itm.owner == "sys" || itm.owner == "render") {
			//Spetial handle because id is the same for this modules
			const fixed_id =
				itm.owner == "sys"
					? "@system:"
					: itm.owner == "render"
						? "@render:"
						: "";
			localoutput =
				localoutput +
				(hasData
					? `\n${itemName}: (data:${tps}) => msg.post("${fixed_id}", "${itemName}", data),`
					: `\n${itemName}: () => msg.post("${fixed_id}", "${itemName}"),`);
		} else {
			//Normal message, id is required
			localoutput =
				localoutput +
				(hasData
					? `\n${itemName}: (id: string, data:${tps}) => msg.post(id, "${itemName}", data),`
					: `\n${itemName}: (id: string) => msg.post(id, "${itemName}"),`);
		}
		return localoutput;
	});
}

function create_property_output(input: MModule): string {
	return create_nested_tree("dprop", input, (item) => {
		let localOutput = "";
		let itm = item as MProperty;
		let read_only = itm.documentation.includes("READ ONLY");
		let tps = itm.type;
		tps = tps.replace("bool", "boolean");
		if (read_only && !settings.generate_documentation) {
			localOutput += "\n/** READ ONLY*/";
		}
		localOutput = localOutput + make_documentation(itm.documentation);
		localOutput += `\n${itm.name}:"${itm.name}",`;
		return localOutput;
	});
}

function add_data(input: any, indent: number): string {
	if (!input.tag) return ""; //! PANIC
	let output = "";

	const parse_module = function (
		mod: MModule,
		lindent: number,
		pretext: string
	) {
		let starts = indent_text(
			"\n" + pretext + "namespace " + mod.name + "{",
			lindent
		);
		let ends = indent_text("\n}\n", lindent);
		let lout = "";
		for (const dat of mod.modules) {
			lout = lout + add_data(dat, lindent);
		}
		for (const dat of mod.items) {
			lout = lout + add_data(dat, lindent);
		}
		output = output + starts + indent_text(lout, lindent + 1) + ends;
	};

	if (input.tag == MType.MODULE || input.tag == MType.NESTED_MODULE) {
		let ptxt = "declare ";
		if (input.tag == MType.NESTED_MODULE) {
			ptxt = "";
		}
		let obj = input as MModule;
		output = output + make_documentation(obj.documentation);
		parse_module(obj, indent, ptxt);
	} else if (input.tag == MType.VARIABLE) {
		output = output + generate_variable(input as MVar);
	} else if (input.tag == MType.FUNCTION) {
		output = output + generate_function(input as MFunc);
	}

	return output;
}

function generate(input: MModule[]): {
	typedata: string;
	messagedata: string;
	propertydata: string;
} {
	let output = "";
	let msg_output = "";
	let prop_output = "";
	for (const mod of input) {
		if (mod.name == "dmsg") {
			msg_output = create_optional_output(mod);
		} else if (mod.name == "dprop") {
			prop_output = create_property_output(mod);
		}
		{
			output = output + add_data(mod, 0);
		}
	}
	const requiredTypes = Utils.read_file("./src_new/requiredTypes.d.ts");
	// Check for unused or unmatched patches
	let appliedpatches = true;
	for (const namespace in patch_index) {
		for (const pattern in patch_index[namespace]) {
			const fullname = namespace + "|||" + pattern;
			if (!config.used_querys.includes(fullname)) {
				appliedpatches = false;
				Utils.log(`WARNING: Unused patch at Namespace: ${namespace} ,with pattern: ${pattern}`)
			}
		}
	}
	if (appliedpatches) {
		Utils.log("Succesfully applied patches from patches.ts!")
	}
	return {
		typedata: requiredTypes + output,
		messagedata: msg_output,
		propertydata: prop_output,
	};
}

export const Generator = {
	generate,
};
