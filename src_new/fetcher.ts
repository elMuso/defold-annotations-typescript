/*[[
    fetcher.ts
    https://github.com/elMuso/defold-annotations-typescript
    with some code from on github.com/astrochili/defold-annotations
    Copyright (c) 2024 elMuso
    MIT license. See LICENSE for details.
    --*/
import config from "./config";
import { Utils } from "./utils";
import { Terminal } from "./terminal";
import settings from "./settings";

export default async function fetch_docs(version: string): Promise<string[]> {
	if (Utils.unlock() != version || settings.clean_traces) {
		Utils.lock(version);
		Utils.log("Documentation Fetching");

		const url = config.doc_url(version);

		Terminal.delete_folder(config.doc_folder);
		await Terminal.download(url, config.doc_zip);
		await Terminal.unzip(config.doc_zip, ".");

		if (settings.clean_traces) {
			Terminal.delete_file(config.doc_zip);
			Terminal.delete_file("lock");
		}
	} else {
		Utils.log(
			"Lock detected. Download skipped because files were previously downloaded"
		);
	}
	Terminal.list_all_files(
		config.doc_folder,
		config.json_extension,
		config.json_list_txt
	);
	const json_list_content = Utils.read_file(config.json_list_txt);
	const json_paths = Utils.get_lines(json_list_content);
	Utils.log(
		"Detected " +
			json_paths.length +
			' *.json files at "' +
			config.doc_folder +
			'"'
	);
	for (let index = 0; index < json_paths.length; index++) {
		const json_path = json_paths[index];
		json_paths[index] =
			config.doc_folder + config.folder_separator + json_path;
	}

	if (settings.clean_traces) {
		Terminal.delete_file(config.json_list_txt);
	}
	Utils.log("-- Documentation Fetched Successfully!\n");
	return json_paths;
}
