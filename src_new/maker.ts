import { buffer } from "stream/consumers";
import config from "./config";
import {
	MSingleItem,
	MFunc,
	MType,
	MVar,
	MMessage,
	MProperty,
	MParameter,
} from "./types.d";
import Utils from "./utils";
import settings from "./settings";

// Only used by this class
function removeEmptyLines(str: string): string {
	return str.replace(/^\s*[\r\n]/gm, "");
}
// Only used by this class
function has(obj: any, val: any): boolean {
	return Object.prototype.hasOwnProperty.call(obj, val);
}
function parse_documentation(
	brief: string | undefined,
	description: string | undefined,
	examples: string | undefined
): string {
	let documentation = "";
	if (brief && description && brief != description) {
		documentation =
			Utils.sanitize(brief) + "\n" + Utils.sanitize(description);
	} else if (brief) {
		documentation = Utils.sanitize(brief);
	}

	if (
		examples &&
		examples != "" &&
		settings.generate_documentation_examples
	) {
		documentation =
			documentation + "\n@example\n" + Utils.sanitize(examples);
	}

	return documentation;
}

function variable(
	buffer: any[],
	name: string,
	element: MSingleItem,
	rName: string
) {
	let data: MVar = {
		name: name,
		type: "nil",
		tag: MType.VARIABLE,
		documentation: parse_documentation(
			element.brief,
			element.description,
			element.examples
		),
		owner: rName,
	};
	buffer.push(data);
}
0;

//Retutrns an array.. ALWAYS
function extract_parameters(input: any): MParameter[] {
	let param_list: MParameter[] = [];
	let replace_param_list = config.parameter_replacement as unknown as [
		string: [string: string]
	];
	for (const val of input) {
		let nm = val.name as string;
		let isOptional = nm.includes("[");
		nm = nm.replace("[", "");
		nm = nm.replace("]", "");
		nm = nm.replace("-", "_");
		nm = nm.replace("repeat", "should_repeat"); //! HOTFIX: This is needed, don't delete
		// We are inverting the spread order...

		let types = [];
		if (!val.types) continue;
		if (nm.includes("...")) {
			nm = "..." + nm.replace("...", "");
			isOptional = false;
		}
		for (const rawtype of val.types) {
			let rtype = rawtype;
			if (nm.includes("...")) {
				rtype = rtype + "[]";
			}
			for (const name in replace_param_list) {
				if (!has(replace_param_list, name)) continue;

				const replace = replace_param_list[name];
				if (rtype == name) {
					rtype = replace;
				}
			}
			let tps = rtype.split("|");
			for (const v of tps) {
				types.push(v);
			}
		}
		//! Edgecase: The documentation is incomplete for this 2 variables.
		if (nm == "frequency" || nm == "swap_interval") {
			types = ["number"];
		}

		param_list.push({
			documentation: parse_documentation(val.doc, "", ""),
			name: nm,
			isOptional: isOptional,
			types: types,
			tag: MType.PARAMETER,
		});
	}
	return param_list;
}

function message(
	buffer: any[],
	name: string,
	element: MSingleItem,
	rName: string
) {
	let reports = element.brief.includes("reports"); //? We check if this is a return message
	let data: MMessage = {
		params: extract_parameters(element.parameters),
		name: (reports ? "*" : "") + name,
		documentation: parse_documentation(
			element.brief,
			element.description,
			element.examples
		),
		tag: MType.MESSAGE,
		owner: rName,
	};
	buffer.push(data);
}
function extract_property_type(str: string): string {
	const pattern = /<span class="type">([^<]+)<\/span>/;
	const match = str.match(pattern);

	return match?.[1] || "";
}

function property(
	buffer: any[],
	name: string,
	element: MSingleItem,
	rName: string
) {
	let readonly = element.description.includes("READ ONLY");
	let data: MProperty = {
		type: extract_property_type(element.brief),
		name: name,
		documentation:
			(readonly ? "READ ONLY: " : "") +
			parse_documentation(
				element.brief,
				element.description,
				element.examples
			),
		tag: MType.PROPERTY,
		owner: rName,
	};
	buffer.push(data);
}

function replace_params(
	element: MSingleItem,
	isParameter: boolean
): string[] | undefined {
	let root = isParameter ? element.parameters : element.returnvalues;
	// let rval = config.specific_replace as unknown as [string: [string: string]];
	// let sub = isParameter ? "param_table_" : "return_table_";

	// if (!root) {
	// 	return [];
	// }
	// for (const name in rval) {
	// 	if (!has(rval, name)) continue;
	// 	const replacebundle = rval[name];
	// 	if (name != element.name) continue;

	// 	for (const bundlename in replacebundle) {
	// 		if (!has(replacebundle, bundlename)) continue;

	// 		const bundlevalue = replacebundle[bundlename];
	// 		let rname = bundlename.replace(sub, "");
	// 		for (const val of root) {
	// 			// console.log(`REPLACING: ${val.type} with ${bundlevalue}`);
	// 			// FIXME this is not working. Don't have more energy to continue...
	// 			let nm = val.name.replace("[", "");
	// 			nm = nm.replace("]", "");
	// 			nm = nm.replace("-", "_");
	// 			if (nm == rname) {
	// 				val.types = [bundlevalue];
	// 			}
	// 		}
	// 	}
	// }

	return root;
}

function addfunction(buffer: any[], name: string, element: MSingleItem, owner: string): void {
	//! Check if the function is blacklisted
	for (const val of config.ignored_functions) {
		if (name == val) {
			return;
		}
		if (val.includes("*")) {
			let nval = val.replace("*", "");
			let oval = name.substring(0, nval.length);
			if (oval == nval) {
				return;
			}
		}
	}

	let data: MFunc = {
		name: name,
		params: extract_parameters(replace_params(element, true)),
		documentation: parse_documentation(
			element.brief,
			element.description,
			element.examples
		),
		return_value: extract_parameters(replace_params(element, false)),
		tag: MType.FUNCTION,
		owner: owner
	};
	// local rvalues = replace_params(element,false)

	data.tag = MType.FUNCTION;
	buffer.push(data);
}

const Maker = {
	parse_documentation,
	variable,
	message,
	property,
	addfunction,
};
export default Maker;
