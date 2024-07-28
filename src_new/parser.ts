/*[[
    parser.ts
    https://github.com/elMuso/defold-annotations-typescript
    with some code from on github.com/astrochili/defold-annotations
    Copyright (c) 2024 elMuso
    MIT license. See LICENSE for details.
    */

import config from "./config";
import Maker from "./maker";
import settings from "./settings";
import { Terminal } from "./terminal";
import { MModule, MSingleItem, MType } from "./types.d";
import Utils from "./utils";

//Parse documentation file and create module object
function parse_path(json_path: string): any {
	let filename = json_path;
	filename = filename.substring(config.doc_folder.length + 1);
	filename = filename.substring(
		0,
		filename.length - config.json_extension.length
	);
	if (Utils.is_blacklisted(config.ignored_docs, filename)) {
		Utils.log(
			'[-] The file "' +
				json_path +
				"\" is skipped because it's on the ignore list"
		);
		return {};
	} else {
		const body = Utils.read_file(json_path);
		return JSON.parse(body);
	}
}

//Parse documentation files and create module objects
function parse_json(json_paths: string[]): any[] {
	Utils.log("// Modules Parsing");
	let boxes: any[] = [];
	json_paths.map((json_path) => {
		let box = parse_path(json_path);
		if (box) {
			boxes.push(box);
		}
	});

	if (settings.clean_traces) {
		Terminal.delete_folder(config.doc_folder);
	}

	Utils.log("// Modules Parsed Successfully!\n");
	return boxes;
}

function createIfNotExisting(bufferIndex: any, name: string, value: any): any {
	if (bufferIndex[name] == undefined) {
		bufferIndex[name] = value;
	}
	return bufferIndex[name];
}

function create_empty_module(): MModule {
	return {
		documentation: "",
		items: [],
		modules: [],
		tag: MType.UNKNOWN,
		name: "",
	};
}

function get_sub_module(origin: MModule, names: string[]): MModule {
	let currentModule: MModule = origin;
	let oo = 0;
	let moduleIndex = createIfNotExisting(currentModule, "modules", []);
	for (const nestedNamespace of names) {
		//We check over existing modules to find a matching name and return
		for (const element of moduleIndex) {
			oo++;
			if (element.name == nestedNamespace) {
				return element;
			}
		}
		//If no module is matched we create a new one
		let nestedMod: MModule = create_empty_module();
		nestedMod.name = nestedNamespace;
		nestedMod.tag = MType.NESTED_MODULE;
		moduleIndex.push(nestedMod);
		return nestedMod;
	}

	return origin as MModule;
}
// We add objects to bufferIndex based on the elements that we have
function parse_module(
	bufferIndex: [string: MModule],
	elements: [string: MSingleItem],
	info: any
) {
	let namespaces = info.namespace.split("."); // Divide the module name into namespaces
	let modbrief = info.brief;
	let moddesc = info.description;
	// Store the current module name and delete it from namespaces
	let modname = namespaces[0];
	namespaces[0] = undefined;
	let root: MModule = createIfNotExisting(
		bufferIndex,
		modname,
		create_empty_module()
	) as MModule;

	root.tag = MType.MODULE;
	root.name = modname;
	if (modbrief && moddesc) {
		root.documentation = Maker.parse_documentation(modbrief, moddesc, "");
	}
	createIfNotExisting(root, "items", []);
	for (const _ in elements) {
		const single = elements[_] as MSingleItem;
		if (!single) continue;

		// We remove the root name from the item name (if present)
		let nm = single.name.replace(root.name + ".", "");

		let names: string[] = nm.split(".");

		let uniqueName = names[names.length - 1];
		// Delete the own item name to avoid havind a submodule of element

		names.pop();
		let newModule = get_sub_module(root, names);

		let itemIndex = newModule.items;
		let utype = single.type;
		// type can be VARIABLE, FUNCTION ,PROPERTY, MESSAGE
		if (utype == MType.VARIABLE) {
			Maker.variable(itemIndex, uniqueName, single);
		} else if (utype == MType.FUNCTION) {
			Maker.addfunction(itemIndex, uniqueName, single);
		} else if (utype == MType.PROPERTY) {
			//! Properties in defold use go_set, generate accordingly
			let msgModule = createIfNotExisting(bufferIndex, "dfld", {
				documentation: "",
				tag: MType.MODULE,
				name: "dfld",
				items: [],
				modules: [],
			}) as MModule;
			Maker.property(
				createIfNotExisting(msgModule, "items", []),
				uniqueName,
				single,
				info.namespace
			);
		} else if (utype == MType.MESSAGE) {
			//  * All messages are strings, so we make a single module with them
			//  ? Consider markin single functions for them?
			let msgModule = createIfNotExisting(bufferIndex, "dfld", {
				documentation: "",
				tag: MType.MODULE,
				name: "dfld",
				items: [],
				modules: [],
			}) as MModule;
			// Yeah it's not optimized but it works
			Maker.message(
				createIfNotExisting(msgModule, "items", []),
				uniqueName,
				single,
				info.namespace
			);
		}
	}
}

function filter_json(input: any[]): MModule[] {
	// Why a cache? So multiple modules with the same name like b2d and b2d.body can be merged
	let output_cache: [string: MModule] = {} as [string: MModule];
	let output: MModule[] = [];
	for (const md of input) {
		let mod = md as any;
		if (mod.elements && mod.info) {
			parse_module(output_cache, mod.elements, mod.info as any);
		}
	}

	//* Due to how the parser is reestructured, empty modules should not be a problem anymore.
	// But keep this code just in case because it's badass
	// remove_empty_modules(output_cache)
	for (const _ in output_cache) {
		if (Object.prototype.hasOwnProperty.call(output_cache, _)) {
			const value = output_cache[_];
			if (value) output.push(value);
		}
	}
	return output;
}

export const Parser = {
	parse_json,
	filter_json,
};
