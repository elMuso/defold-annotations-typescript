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
		//Replace table with specific types
		"camera.get_cameras": {
			return_table_cameras: "table_array",
		},
		"crash.get_backtrace": {
			return_table_backtrace: "table_map",
		},
		"factory.create": {
			param_table_properties: "table_map",
		},
		"gui.set": {
			param_table_options: "table_map",
		},
		"gui.get": {
			param_table_options: "table_map",
		},
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
		"msg.post": {
			param_table_message: "table_map|nil",
		},
		"physics.raycast_async": {
			param_table_groups: "hash[]",
		},
		"physics.create_joint": {
			param_table_properties: "table_map",
		},
		"physics.set_joint_properties": {
			param_table_properties: "table_map",
		},
		"profiler.view_recorded_frame": {
			param_table_frame_index: "table_map",
		},
		"render.dispatch_compute": {
			param_table_options: "table_map",
		},
		"socket.select": {
			param_table_recvt: "table_array",
			param_table_sendt: "table_array",
			return_table_sockets_r: "table_array",
			return_table_sockets_w: "table_array",
		},
		"collectionfactory.create": {
			param_table_properties: "table_map",
			return_table_ids: "Record<hash, hash>",
		},
		"vmath.vector": {
			param_table_t: "number[]",
		},
		"tilemap.get_tile_info": {
			return_table_tile_info: "table_map",
		},
		"sys.serialize": {
			param_table_table: "table_map",
		},
		"sys.deserialize": {
			return_table_table: "table_map",
		},
		"sys.save": {
			return_table_table: "any", //! This could be better but leave it like this
		},
		"sys.load": {
			return_table_loaded: "any", //! This could be better but leave it like this
		},
		"render.clear": {
			return_table_buffers: "any", //! This could be better but leave it like this
		},
		"collectionfactory.load": {
			param_table_complete_function:
				"(self: any, url: url, result: boolean) => void",
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
		"factory.load": {
			param_table_complete_function:
				"(self: any, url: url, result: boolean) => void",
		},
		"go.animate": {
			param_table_complete_function:
				"(self: any, url: url, property: hash) => void",
		},
		"go.set": {
			param_table_value: "any",
			param_table_options: "table_map",
		},
		"go.get": {
			param_table_options: "{index:integer, key:hash}",
		},
		"gui.animate": {
			param_table_complete_function: "(self: any, node: node) => void",
		},
		"gui.play_particlefx": {
			param_table_emitter_state_function:
				"(self: any, emitter: hash, state: constant, node?: hash) => void",
		},
		"html5.set_interaction_listener": {
			param_table_callback: "(self: any) => void | nil",
		},
		"http.request": {
			param_table_callback:
				"(self: any, id: hash, response: {status: number, response:string, headers:any, path:string, error:string}) => void",
		},
		"gui.clone_tree": {
			return_table_clones: "Record<string|hash, node>",
		},
		"gui.get_tree": {
			return_table_clones: "Record<string|hash, node>",
		},
		"gui.play_flipbook": {
			param_table_play_properties:
				"{ offset?:number, playback_rate?:number }",
			param_table_complete_function: "(self: any, node: node) => void",
		},
		"gui.stop_particlefx": {
			param_table_options: "{ clear?:boolean }",
		},
		"json.decode": {
			param_table_options: "{ decode_null_as_userdata?:boolean }",
		},
		"json.encode": {
			param_table_options: "{ encode_empty_table_as_object:string }",
		},
		"liveupdate.store_resource": {
			param_table_callback:
				"(self: any, hexdigest: string, status: boolean) => void",
		},
		"liveupdate.store_manifest": {
			param_table_callback: "(self:any, status:constant) => void",
		},
		"liveupdate.store_archive": {
			param_table_callback: "(self:any, status:constant) => void",
		},
		"liveupdate.add_mount": {
			param_table_callback: "() => void",
		},
		"particlefx.play": {
			param_table_emitter_state_function:
				"(self:any, id:hash, emitter:hash, state:constant) => void",
		},
		"particlefx.stop": {
			param_table_options: "{ clear?:boolean }",
		},
		"sprite.play_flipbook": {
			param_table_play_properties: "{offset:number,playback_rate:number}",
			param_table_complete_function:
				"(self:any, message_id:hash, message:{current_tile:number,id:hash}, sender:url)=>void",
			param_table_options: "{ offset?:number, playback_rate?:number }",
		},
		"sound.play": {
			param_table_play_properties:
				"{ delay?:number, gain?:number, pan?:number, speed?:number }",
			param_table_complete_function:
				"(self:any, message_id:hash, message:{play_id:number}, sender:url)=>void",
		},
		"sound.stop": {
			param_table_stop_properties: "{ play_id:number }",
		},
		"socket.dns.tohostname": {
			return_table_resolved: "table_map|string",
		},
		"socket.dns.toip": {
			return_table_resolved: "table_map|string",
		},
		"socket.dns.getaddrinfo": {
			return_table_resolved: "table_map|nil",
		},
		"socket.dns.getnameinfo": {
			return_table_resolved: "table_map|nil",
		},
		"model.play_anim": {
			param_table_play_properties:
				"{ blend_duration?:number, offset?:number, playback_rate?:number}",
			param_table_complete_function:
				"(self:any, message_id:hash, message:{animation_id:hash, playback:constant}, sender:url) => void",
		},
		"image.load": {
			param_options:
				"{premultiply_alpha:boolean,flip_vertically:boolean}",
			return_table_image:
				"{ width:number, height:number, type:constant, buffer:string }",
		},
		"image.load_buffer": {
			return_table_image:
				"{ width:number, height:number, type:constant, buffer:buffer_data }",
		},
		"physics.get_joint_properties": {
			return_table_properties: "{ collide_connected?:boolean }",
		},
		"physics.raycast": {
			param_table_groups: "hash[]",
			param_table_options: "{ all?:boolean }",
			return_table_result:
				"physics.raycast_response[]|physics.raycast_response|nil", //? The documentation says it returns a array but the examples show it can return nil or single
		},
		"physics.get_shape": {
			return_table_table:
				"{ type?:number, diameter?:number, dimensions?:vector3, height?:number }",
		},
		"physics.set_shape": {
			param_table_table:
				"{ diameter?:number, dimensions?:vector3, height?:number }",
		},
		"physics.set_listener": {
			param_table_callback:
				"(self:any, event:constant, data:any) => void",
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
				"{ type:number, width:number, height:number, format:number, flags?:number, max_mipmaps?:number, compression_type?:number}",
		},
		"resource.create_texture_async": {
			param_table_table:
				"{ type:number, width:number, height:number, format:number, flags?:number, max_mipmaps?:number, compression_type?:number}",
		},
		"resource.set_texture": {
			param_table_table: "TextureHeader",
		},
		"resource.get_texture_info": {
			return_table_table:
				"{ handle:resource_handle, width:number, height:number, depth:number, mipmaps:number, flags:number, type:number }",
		},
		"resource.get_text_metrics": {
			param_table_options:
				"{ width?:number, leading?:number, tracking?:number, line_break?:boolean}",
			return_table_metrics:
				"{ width:number, height:number, max_ascent:number, max_descent:number }",
		},
		"resource.create_buffer": {
			param_table_table:
				"{ buffer:buffer_data, transfer_ownership?:boolean }",
		},
		"resource.set_buffer": {
			param_table_table: "{ transfer_ownership?: boolean }",
		},
		"render.draw": {
			param_table_options:
				"{ frustum?:matrix4, frustum_planes?:number, constants?:constant_buffer }",
		},
		"render.draw_debug3d": {
			param_table_options: "{ frustum?:matrix4, frustum_planes?:number }",
		},
		"render.predicate": {
			param_table_tags: "(string|hash)[]",
		},
		"render.render_target": {
			param_table_parameters:
				"Record<number, { format:number, width:number, height:number, min_filter?:number, mag_filter?:number, u_wrap?:number, v_wrap?:number, flags?:number}>",
		},
		"render.set_camera": {
			param_table_options: "{ use_frustum?:boolean }",
		},
		"render.set_render_target": {
			param_table_options: "{ transient?:number[] }",
		},
		"sound.get_groups": {
			return_table_groups: "hash[]",
		},
		"socket.newtry": {
			param_table_finalizer: "()=>void",
			return_table_try: "()=>void",
		},
		"socket.protect": {
			param_table_func: "()=>void",
			//! Warning this safe func return type might be really wrong. But i don't know what it should be
			return_table_safe_func: "(fun:()=>void)=>void",
		},
		"socket.skip": {
			"return_table_retD+1": "object|nil",
			"return_table_retD+2": "object|nil",
			return_table_retN: "object|nil",
		},
		"sys.get_sys_info": {
			param_table_options: "{ ignore_secure?:boolean }",
			return_table_sys_info:
				"{ device_model?:string, manufacturer:string|nil, system_name:string, system_version:string, api_version:string, language:string, device_language:string, territory:string, gmt_offset:number, device_ident?:string, user_agent?:string }",
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
				"{ name:string, address?:string, mac?:string, up:boolean, running:boolean }",
		},
		"sys.load_buffer_async": {
			param_table_status_callback:
				"(self:any, request_id:hash, result:{status:constant, buffer:buffer|object})=>void",
		},
		"sys.set_error_handler": {
			param_table_error_handler:
				"(source:string, message:string, traceback:string)=>void",
		},
		"sys.open_url": {
			param_table_attributes: "{ target?:string, name?:string }",
		},
		"timer.get_info": {
			return_table_data:
				"{ time_remaining:number, delay:number, repeating:boolean }",
		},
		"timer.delay": {
			param_table_callback:
				"(self:any, handle:number, time_elapsed:number)=>void",
		},
		"window.set_listener": {
			param_table_callback:
				"(self:any, event:constant, data:{width:number,height:number})=>void|nil",
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
