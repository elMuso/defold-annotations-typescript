const info_filename = "info.json";
const config = {
	//File name of the documentation archive
	doc_zip: "ref-doc.zip",
	//Name of a temporary text file with paths to json files
	json_list_txt: "json_list.txt",
	//Folder separator
	folder_separator: "/",
	//File name of the info about the letest version
	info_json: info_filename,
	//Name of the unpacked doc folder
	doc_folder: "doc",
	//Json extension
	json_extension: ".json",
	//Name of the output folder
	api_folder: "api",
	//Ignored docs
	//Possible to use suffix `*`
	ignored_docs: [
		"dm*",
		"debug_doc",
		"coroutine_doc",
		"math_doc",
		"package_doc",
		"string_doc",
		"table_doc",
		"engine_doc",
		"base_doc",
		"os_doc",
		"io_doc",
		"client:*",
		"server:*",
		"master:*",
		"connected:*",
		"unconnected:*",
		"socket.dns",
	],
	info_url: "https://d.defold.com/stable/" + info_filename,
	doc_url: function (version: string): string {
		return (
			"https://github.com/defold/defold/releases/download/" +
			version +
			"/" +
			config.doc_zip
		);
	},
	// This is used to keep a track of used patch queries and to warn if a query was never matched
	used_querys: [] as string[],
	ignored_functions: [
		"init",
		"final",
		"update",
		"fixed_update",
		"on_message",
		"on_input",
		"on_reload",
		"final",
		"client:*",
		"server:*",
		"master:*",
		"connected:*",
		"unconnected:*",
		"pprint",
		"hash",
		"hash_to_hex",
	],
	//Some parameters types are badly named or should be modified to avoid Teal issues, write a match and a replacement
	// Must be an exact match
	//This is replaced second
	parameter_replacement: {
		"vmath.vector3": "vector3",
		"vmath.vector4": "vector4",
		quat: "quaternion",
		"vmath.matrix4": "matrix4",
		vector: "vector4|vector3",
		resource: "resource_data",
		bool: "boolean",
		buffer: "buffer_data",
		bufferstream: "buffer_stream",
		handle: "resource_handle",
		texture: "resource_handle",
		predicate: "render_predicate",
		client: "socket_client",
		master: "socket_master",
		unconnected: "socket_unconnected",
	},
};

export default config;
