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

	//We replace the callback names with it's respective type since teal doesn't support named calllback parameters
	function_replacement: [
		"self",
		"url",
		"result",
		"property",
		"node",
		"emitter",
		"state",
		"status",
		"hexdigest",
		"message",
		"data",
		"request_id",
		"handle",
		"any_id",
		"id",
		"time_elapsed",
		"traceback",
		"event",
		"sender",
		"source",
		"response",
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
	// We replace the type of a specific function. It can be either a param or return value
	// This is replaced first
	specific_replace: {
		"buffer.create": {
			param_table_declaration:
				"{ name:hash|string, type:constant, count:number }[]",
		},
		"buffer.set_metadata": {
			param_table_values: "number[]",
		},
		"buffer.get_metadata": {
			return_table_values: "number[]|nil",
		},
		"collectionfactory.create": {
			return_table_ids: "table<string|hash, string|hash>",
		},
		"collectionproxy.get_resources": {
			return_table_resources: "string[]",
		},
		"collectionproxy.missing_resources": {
			return_table_resources: "string[]",
		},
		"crash.get_modules": {
			return_table_modules: "{ name:string, address:string }[]",
		},
		"gui.clone_tree": {
			return_table_clones: "table<string|hash, node>",
		},
		"gui.get_tree": {
			return_table_clones: "table<string|hash, node>",
		},
		"gui.play_flipbook": {
			param_table_play_properties:
				"{ offset:number|nil, playback_rate:number|nil }",
		},
		"gui.stop_particlefx": {
			param_table_options: "{ clear:boolean|nil }",
		},
		"json.decode": {
			param_table_options: "{ decode_null_as_userdata:boolean|nil }",
		},
		"json.encode": {
			param_table_options: "{ encode_empty_table_as_object:string }",
		},
		"particlefx.stop": {
			param_table_options: "{ clear:boolean|nil }",
		},
		"sprite.play_flipbook": {
			param_table_options:
				"{ offset:number|nil, playback_rate:number|nil }",
		},
		"sound.play": {
			param_table_play_properties:
				"{ delay:number|nil, gain:number|nil, pan:number|nil, speed:number|nil }",
		},
		"sound.stop": {
			param_table_stop_properties: "{ play_id:number }",
		},
		"model.play_anim": {
			param_table_play_properties:
				"{ blend_duration:number|nil, offset:number|nil, playback_rate:number|nil}",
		},
		"image.load": {
			return_table_image:
				"{ width:number, height:number, type:constant, buffer:string }",
		},
		"image.load_buffer": {
			return_table_image:
				"{ width:number, height:number, type:constant, buffer:buffer_data }",
		},
		"physics.get_joint_properties": {
			return_table_properties: "{ collide_connected:boolean|nil }",
		},
		"physics.raycast": {
			param_table_options: "{ all:boolean|nil }",
			return_table_result:
				"physics.raycast_response[]|physics.raycast_response",
		},
		"physics.get_shape": {
			return_table_table:
				"{ type:number|nil, diameter:number|nil, dimensions:vector3|nil, height:number|nil }",
		},
		"physics.set_shape": {
			param_table_table:
				"{ diameter:number|nil, dimensions:vector3|nil, height:number|nil }",
		},
		"resource.create_atlas": {
			param_table_table: "resource.atlas",
		},
		"resource.get_atlas": {
			return_table_data: "resource.atlas",
		},
		"resource.set_atlas": {
			param_table_table: "resource.atlas",
		},
		"resource.get_render_target_info": {
			return_table_table:
				"{ handle:resource_handle, attachments:{ handle:resource_handle, width:number, height:number, depth:number, mipmaps:number, type:number, buffer_type:number, texture:hash }[] }",
		},
		"resource.create_texture": {
			param_table_table:
				"{ type:number, width:number, height:number, format:number, flags:number|nil, max_mipmaps:number|nil, compression_type:number|nil}",
		},
		"resource.create_texture_async": {
			param_table_table:
				"{ type:number, width:number, height:number, format:number, flags:number|nil, max_mipmaps:number|nil, compression_type:number|nil}",
		},
		"resource.set_texture": {
			param_table_table:
				"{ type:number, width:number, height:number, format:number, x:number|nil, y:number|nil, mipmap:number|nil, compression_type:number|nil}",
		},
		"resource.get_texture_info": {
			return_table_table:
				"{ handle:resource_handle, width:number, height:number, depth:number, mipmaps:number, flags:number, type:number }",
		},
		"resource.get_text_metrics": {
			param_table_options:
				"{ width:number|nil, leading:number|nil, tracking:number|nil, line_break:boolean|nil}",
			return_table_metrics:
				"{ width:number, height:number, max_ascent:number, max_descent:number }",
		},
		"resource.create_buffer": {
			param_table_table:
				"{ buffer:buffer_data, transfer_ownership:boolean|nil }",
		},
		"resource.set_buffer": {
			param_table_table: "{ transfer_ownership: boolean|nil }",
		},
		"render.draw": {
			param_table_options:
				"{ frustum:matrix4|nil, frustum_planes:number|nil, constants:constant_buffer|nil }",
		},
		"render.draw_debug3d": {
			param_table_options:
				"{ frustum:matrix4|nil, frustum_planes:number|nil }",
		},
		"render.predicate": {
			param_table_tags: "(string|hash)[]",
		},
		"render.render_target": {
			param_table_parameters:
				"table<number, { format:number, width:number, height:number, min_filter:number|nil, mag_filter:number|nil, u_wrap:number|nil, v_wrap:number|nil, flags:number|nil}>",
		},
		"render.set_camera": {
			param_table_options: "{ use_frustum:boolean|nil }",
		},
		"render.set_render_target": {
			param_table_options: "{ transient:number[]|nil }",
		},
		"sound.get_groups": {
			return_table_groups: "hash[]",
		},
		"sys.get_sys_info": {
			param_table_options: "{ ignore_secure:boolean|nil }",
			return_table_sys_info:
				"{ device_model:string|nil, manufacturer:string|nil, system_name:string, system_version:string, api_version:string, language:string, device_language:string, territory:string, gmt_offset:number, device_ident:string|nil, user_agent:string|nil }",
		},
		"sys.get_application_info": {
			return_table_app_info: "{ installed:boolean }",
		},
		"sys.get_engine_info": {
			return_table_engine_info:
				"{ version:string, version_sha1:string, is_debug:boolean }",
		},
		"sys.get_ifaddrs": {
			return_table_ifaddrs:
				"{ name:string, address:string|nil, mac:string|nil, up:boolean, running:boolean }",
		},
		"sys.open_url": {
			param_table_attributes: "{ target:string|nil, name:string|nil }",
		},
		"timer.get_info": {
			return_table_data:
				"{ time_remaining:number, delay:number, repeating:boolean }",
		},
	},

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
