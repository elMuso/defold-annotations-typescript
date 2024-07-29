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
	output =
		output +
		"\nexport function " +
		input.name +
		"(" +
		gen_params(input.params) +
		")" +
		gen_return(input.return_value) +
		";\n";
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
	let output = make_documentation(input.documentation);
	output = output + "\nexport let " + input.name + ": " + typerep;
	return output + ";";
}

function make_documentation(docs: string): string {
	if (!docs) return "";
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

//! WARNING, this code has grown out quite a bit and it's fragile.
//! Be careful while editing
function create_optional_output(input: MModule): string {
	let cache: Record<string, any> = {};
	let output = "export const dfld = {";
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
		if (!Object.prototype.hasOwnProperty.call(cache, name)) return "";
		const items = cache[name];
		let localoutput = "";

		for (const item of items) {
			if (item.tag == MType.PROPERTY) {
				let itm = item as MProperty;
				localoutput =
					localoutput + make_documentation(itm.documentation);
				localoutput =
					localoutput + "\np_" + itm.name + ': "' + itm.name + '",';
			} else if (item.tag == MType.MESSAGE) {
				// Some messages are passed back. If the name has a * the parser decided is a return
				let isReport = item.name.includes("*");
				let itm = item as MMessage;
				localoutput =
					localoutput + make_documentation(itm.documentation);
				let itemName = itm.name.substring(
					isReport == true ? 1 : 0,
					itm.name.length
				);
				//The message input received
				let tps = gen_types(itm.params);
				let hasData = tps.length != 0;
				if (isReport) {
					localoutput =
						localoutput +
						`\nmsg_id_${itemName}: hash("${itemName}"),`;
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
							? `\nmsg_${itemName}: (data:${tps}) => msg.post("${fixed_id}", "${itemName}", data),`
							: `\nmsg_${itemName}: () => msg.post("${fixed_id}", "${itemName}"),`);
				} else {
					//Normal message, id is required
					localoutput =
						localoutput +
						(hasData
							? `\nmsg_${itemName}: (id: string, data:${tps}) => msg.post(id, "${itemName}", data),`
							: `\nmsg_${itemName}: (id: string) => msg.post(id, "${itemName}"),`);
				}
			}
		}

		let indn = 0;
		let namespaces = name.split(".");
		for (const namespc of namespaces) {
			indn = indn + 1;
			localoutput = wrapper(namespc, localoutput, indn);
		}
		output = output + localoutput;
	}
	output = output + "\n}";
	return output;
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
	optionaldata: string;
} {
	let output = "";
	let optional_output = "";
	for (const mod of input) {
		if (mod.name == "dfld") {
			optional_output = create_optional_output(mod);
		} else {
			output = output + add_data(mod, 0);
		}
	}
	const requiredTypes = Utils.read_file("./src_new/requiredTypes.d.ts");
	return {
		typedata: requiredTypes + output,
		optionaldata: optional_output,
	};
}

export const Generator = {
	generate,
};
