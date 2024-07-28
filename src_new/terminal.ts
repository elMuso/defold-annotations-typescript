/*[[
    terminal.ts
    https://github.com/elMuso/defold-annotations-typescript
    with some code from on github.com/astrochili/defold-annotations
    Copyright (c) 2024 elMuso
    MIT license. See LICENSE for details.
    --*/
import { Utils } from "./utils";
import fs from "node:fs";
import decompress from "decompress";
import path from "path";

async function download(url: string, output_path: string): Promise<void> {
	Utils.log(`Downloading file from ${url} in ${output_path}`);
	const response = await fetch(url, {
		method: "GET",
	});
	const buffer = await response.arrayBuffer();
	fs.writeFileSync(output_path, Buffer.from(buffer));
}

function delete_file(path: string): void {
	try {
		Utils.log(`Deleting file at ${path}`);
		fs.unlinkSync(path);
	} catch (err) {
		Utils.log(`Couldn't delete file at ${path}`);
	}
}

function delete_folder(path: string): void {
	Utils.log(`Deleting folder ${path}`);
	try {
		fs.rmSync(path, { recursive: true });
	} catch (err) {
		Utils.log(`Couldn't delete ${path}`);
	}
}

function create_folder(path: string): void {
	try {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}
	} catch (err) {
		console.error(err);
	}
}

async function unzip(path: string, destination: string): Promise<void> {
	Utils.log(`Unzipping ${path} in ${destination}`);
	create_folder(destination);
	await decompress(path, destination);
}

function list_all_files(
	folder_path: string,
	extension: string,
	output_path: string
): void {
	Utils.log("Listing files");
	let names: string[] = fs.readdirSync(folder_path);

	const jsonFiles = names.filter(
		(file) => path.extname(file).toLowerCase() === extension
	);
	Utils.save_file(jsonFiles.join("\n"), output_path);
}

export const Terminal = {
	download,
	delete_file,
	delete_folder,
	create_folder,
	unzip,
	list_all_files,
};
