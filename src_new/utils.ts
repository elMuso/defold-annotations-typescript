/*[[
	config.ts
	https://github.com/elMuso/defold-annotations-typescript
	with some code from on github.com/astrochili/defold-annotations
	Copyright (c) 2024 elMuso
	MIT license. See LICENSE for details.
	--*/
import { decode } from "html-entities";
import settings from "./settings";
import fs from "node:fs";
function log(content: string): void {
	if (!settings.silent_mode) {
		console.log(content);
	}
}

//Save the content to the file
function save_file(content: string, path: string): boolean {
	try {
		fs.writeFileSync(path, content);
		return true;
	} catch (err) {
		return false;
	}
}

function lock(version: string): void {
	save_file(version, "lock");
}

function unlock(): string {
	return read_file("lock");
}

//Read the content from the file
function read_file(path: string): string {
	try {
		let content = fs.readFileSync(path);
		Utils.log('The file "' + path + '" has been successfully read');
		return content.toString();
	} catch (err) {
		return "";
	}
}

//Get array of lines from the string
function get_lines(content: string): string[] {
	return content.split("\n");
}

//Check if an item is present in the black list, including by the `*` suffix rule.
function is_blacklisted(list: string[], item: string): boolean {
	for (const list_element of list) {
		if (list_element.slice(-1) == "*") {
			const list_prefix = list_element.substring(
				0,
				list_element.length - 1
			);

			if (item.substring(0, list_prefix.length) == list_prefix) {
				return true;
			}
		} else if (item == list_element) {
			return true;
		}
	}
	return false;
}

function sanitize(input: string): string {
	let res = input;
	res = input.replace(/\<div/g, "```lua\n<div");
	res = res.replace(/\<\/div\>/g, "</div>\n```");
	res = res.replace(/\<li\>\n\<dl\>\n\<dt\>\<code\>/g, "- ");
	res = res.replace(/\<li\>/g, "<li>- ");
	res = res.replace(/\n\<tr\>\n/g, "<tr>");
	res = res.replace(/\n\<\/tr\>\n/g, "</tr>");
	res = res.replace(/\<br\/\>/g, "<br/>;");
	res = res.replace(/<\/?[^>]+>/g, "");
	return decode(res);
}

function get_default_types(): string {
	return "";
	// return utils.read_file("required_types.d.tl")
}

export const Utils = {
	sanitize,
	get_default_types,
	is_blacklisted,
	get_lines,
	read_file,
	lock,
	unlock,
	save_file,
	log,
};

export default Utils;
