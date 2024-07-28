import config from "./src_new/config";
import fetch_docs from "./src_new/fetcher";
import { Generator } from "./src_new/generator";
import { Parser } from "./src_new/parser";
import settings from "./src_new/settings";
import { Terminal } from "./src_new/terminal";
import Utils from "./src_new/utils";

// Parse .json files to namespace modules
// const modules = parser.parse_json(json_paths)

async function generate_documentation() {
	const json_paths = await fetch_docs(settings.defold_version);
	const api_path = config.api_folder + settings.folder_separator;
	const modules = Parser.parse_json(json_paths);
	const filtered = Parser.filter_json(modules);
	Terminal.create_folder(api_path);
	Utils.save_file(JSON.stringify(filtered), api_path + "raw_data.json");
	const output = Generator.generate(filtered);
	Utils.save_file(output.typedata, api_path + "index.d.ts");
	Utils.save_file(output.optionaldata, api_path + "messages.d.ts");
	console.log("Parsing done. Check the api folder");
}

generate_documentation();
