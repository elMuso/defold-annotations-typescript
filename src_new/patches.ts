// Patches are applied over the resulting index.d.ts file. They come in the following
// format "content to be matched to a line ||| string to be captured" : "replacement" If a
// replacement fails then it throws a warning when building. As it means defold changed
// some pareameter name


const patches_camera: Record<string, string> = {
    // Per example, in here we match the "function get_cameras" line in camera module,
    // then replace "table" with "table_array"
    "function get_cameras|||table": "table_array",

}

const patches_crash: Record<string, string> = {
    "function get_backtrace|||table": "table_map",
    "function get_modules|||table": "{name: string, address: string}[]"
}

const patches_factory: Record<string, string> = {
    "function get_status|||constant": "typeof factory.STATUS_LOADED | typeof factory.STATUS_LOADING | typeof factory.STATUS_UNLOADED",
    "function create|||properties?: table": "properties?: table_map",
    "function load|||function(self, url, result)": "(self: any, url: url, result: boolean) => void",
}

const patches_gui: Record<string, string> = {
    "function set(|||property: string | hash | constant": "property: string | hash",
    "function set(|||options?: table": "options?: table_map",
    "function get(|||property: string | hash | constant, options?: table": "property: string | hash, options?: table_map",
    "function play_particlefx|||function(self, node, emitter, state)": " (self: any, emitter: hash, state: constant, node?: hash) => void",
    "function cancel_animation|||property: string | constant":
        "property: 'color' | 'fill_angle' | 'inner_radius' | 'outline' | 'position' | 'rotation' | 'scale' | 'shadow' | 'size' | 'slice9'",
    "function set_clipping_mode|||clipping_mode: constant": "clipping_mode: typeof gui.CLIPPING_MODE_NONE | typeof gui.CLIPPING_MODE_STENCIL",
    "function get_clipping_mode|||: constant;": ": typeof gui.CLIPPING_MODE_NONE | typeof gui.CLIPPING_MODE_STENCIL;",
    "function set_texture_data|||type: string | constant": "type: 'l' | 'rgb' | 'rgba'",
    "function new_texture|||type: string | constant": "type: 'l' | 'rgb' | 'rgba'",
    "function stop_particlefx|||options?: table": "options?: { clear?: boolean }",
    "function play_flipbook|||complete_function?: function(self, node), play_properties?: table":
        "complete_function?: (self: any, node: node) => void, play_properties?: { offset?: number, playback_rate?: number }",
    "function set_blend_mode|||blend_mode: constant":
        "blend_mode: typeof gui.BLEND_ADD | typeof gui.BLEND_ADD_ALPHA | typeof gui.BLEND_ALPHA | typeof gui.BLEND_MULT | typeof gui.BLEND_SCREEN",
    "function get_blend_mode|||: constant;":
        ": typeof gui.BLEND_ADD | typeof gui.BLEND_ADD_ALPHA | typeof gui.BLEND_ALPHA | typeof gui.BLEND_MULT | typeof gui.BLEND_SCREEN;",
    "function get_tree|||: table;": ": LuaMap<string | hash, node>;",
    "function clone_tree|||: table;": ": LuaMap<string | hash, node>;",
    "function animate|||property: string | constant, to: number | vector3 | vector4 | quaternion, easing: constant | vector4 | vector3, duration: number, delay?: number, complete_function?: function(self, node), playback?: constant): void;":
        "property: string | typeof gui.PROP_COLOR | typeof gui.PROP_FILL_ANGLE | typeof gui.PROP_INNER_RADIUS | typeof gui.PROP_OUTLINE | typeof gui.PROP_POSITION | typeof gui.PROP_ROTATION | typeof gui.PROP_SCALE | typeof gui.PROP_SHADOW | typeof gui.PROP_SIZE | typeof gui.PROP_SLICE9, to: number | vector3 | vector4 | quaternion, easing: quaternion | vector3 | vector4 | number | typeof gui.EASING_INBACK | typeof gui.EASING_INBOUNCE | typeof gui.EASING_INCIRC | typeof gui.EASING_INCUBIC | typeof gui.EASING_INELASTIC | typeof gui.EASING_INEXPO | typeof gui.EASING_INOUTBACK | typeof gui.EASING_INOUTBOUNCE | typeof gui.EASING_INOUTCIRC | typeof gui.EASING_INOUTCUBIC | typeof gui.EASING_INOUTELASTIC | typeof gui.EASING_INOUTEXPO | typeof gui.EASING_INOUTQUAD | typeof gui.EASING_INOUTQUART | typeof gui.EASING_INOUTQUINT | typeof gui.EASING_INOUTSINE | typeof gui.EASING_INQUAD | typeof gui.EASING_INQUART | typeof gui.EASING_INQUINT | typeof gui.EASING_INSINE | typeof gui.EASING_LINEAR | typeof gui.EASING_OUTBACK | typeof gui.EASING_OUTBOUNCE | typeof gui.EASING_OUTCIRC | typeof gui.EASING_OUTCUBIC | typeof gui.EASING_OUTELASTIC | typeof gui.EASING_OUTEXPO | typeof gui.EASING_OUTINBACK | typeof gui.EASING_OUTINBOUNCE | typeof gui.EASING_OUTINCIRC | typeof gui.EASING_OUTINCUBIC | typeof gui.EASING_OUTINELASTIC | typeof gui.EASING_OUTINEXPO | typeof gui.EASING_OUTINQUAD | typeof gui.EASING_OUTINQUART | typeof gui.EASING_OUTINQUINT | typeof gui.EASING_OUTINSINE | typeof gui.EASING_OUTQUAD | typeof gui.EASING_OUTQUART | typeof gui.EASING_OUTQUINT | typeof gui.EASING_OUTSINE, duration: number, delay?: number, complete_function?: (self: any, node: node) => void, playback?: typeof gui.PLAYBACK_LOOP_BACKWARD | typeof gui.PLAYBACK_LOOP_FORWARD | typeof gui.PLAYBACK_LOOP_PINGPONG | typeof gui.PLAYBACK_ONCE_BACKWARD | typeof gui.PLAYBACK_ONCE_FORWARD | typeof gui.PLAYBACK_ONCE_PINGPONG): void;"
}

const patches_buffer: Record<string, string> = {
    "function set_metadata|||values: table, value_type: constant": "values: number[], value_type: typeof buffer.VALUE_TYPE_FLOAT32 | typeof buffer.VALUE_TYPE_INT8 | typeof buffer.VALUE_TYPE_INT16 | typeof buffer.VALUE_TYPE_INT32 | typeof buffer.VALUE_TYPE_INT64 | typeof buffer.VALUE_TYPE_UINT8 | typeof buffer.VALUE_TYPE_UINT16 | typeof buffer.VALUE_TYPE_UINT32 | typeof buffer.VALUE_TYPE_UINT64",
    "function get_metadata|||[table|nil, constant|nil]": "[number[] | nil, typeof buffer.VALUE_TYPE_FLOAT32 | typeof buffer.VALUE_TYPE_INT8 | typeof buffer.VALUE_TYPE_INT16 | typeof buffer.VALUE_TYPE_INT32 | typeof buffer.VALUE_TYPE_INT64 | typeof buffer.VALUE_TYPE_UINT8 | typeof buffer.VALUE_TYPE_UINT16 | typeof buffer.VALUE_TYPE_UINT32 | typeof buffer.VALUE_TYPE_UINT64 | nil]",
    "function create|||declaration: table": "declaration: { name: hash | string, type: typeof buffer.VALUE_TYPE_FLOAT32 | typeof buffer.VALUE_TYPE_INT8 | typeof buffer.VALUE_TYPE_INT16 | typeof buffer.VALUE_TYPE_INT32 | typeof buffer.VALUE_TYPE_INT64 | typeof buffer.VALUE_TYPE_UINT8 | typeof buffer.VALUE_TYPE_UINT16 | typeof buffer.VALUE_TYPE_UINT32 | typeof buffer.VALUE_TYPE_UINT64, count: number }[]"
}

const patches_collectionfactory: Record<string, string> = {
    "function get_status|||constant": "typeof collectionfactory.STATUS_LOADED | typeof collectionfactory.STATUS_LOADING | typeof collectionfactory.STATUS_UNLOADED",
    "function create|||properties?: table": "properties?: table_map",
    "function create|||: table;": ": LuaMap<hash, hash>;",
    "function load|||function(self, url, result)": "(self: any, url: url, result: boolean) => void"
}

const patches_msg: Record<string, string> = {
    "function post|||message?: table | nil": "message?: table_map | nil"
}

const patches_physics: Record<string, string> = {
    "function raycast_async|||groups: table": "groups: hash[]",
    "function create_joint|||properties?: table": "properties?: table_map",
    "function set_joint_properties|||properties: table": "properties: table_map",
    "function set_listener|||function(self, event, data) | nil": "(self: any, event: constant, data: any) => void",
    "function set_shape|||table: table": "table: { diameter?: number, dimensions?: vector3, height?: number }",
    "function get_shape|||: table;": ": { type?: number, diameter?: number, dimensions?: vector3, height?: number };",
    "function raycast(|||groups: table, options?: table): table|nil;":
        "groups: hash[], options?: { all?: boolean }): physics.raycast_response[] | physics.raycast_response | nil;",
    "function get_joint_properties|||: table;": ": { collide_connected?: boolean };"
}

const patches_profiler: Record<string, string> = {
    "function view_recorded_frame|||frame_index: table": "frame_index: table_map"
}

const patches_render: Record<string, string> = {
    "function dispatch_compute|||options?: table": "options?: table_map",
    "function set_render_target(|||options?: table": "options?: { transient?: number[] }",
    "function set_camera|||options?: table": "options?: { use_frustum?: boolean }",
    "function render_target|||parameters: table":
        "parameters: Record<number, { format: number, width: number, height: number, min_filter?: number, mag_filter?: number, u_wrap?: number, v_wrap?: number, flags?: number }>",
    "function predicate|||tags: table": "tags: (string | hash)[]",
    "function draw_debug3d|||options?: table": "options?: { frustum?: matrix4, frustum_planes?: number }",
    "function draw(|||options?: table": "options?: { frustum?: matrix4, frustum_planes?: number, constants?: constant_buffer }"


}

const patches_socket: Record<string, string> = {
    "function select|||(recvt: table, sendt: table, timeout?: number): LuaMultiReturn<[table, table, string|nil]>;":
        "(recvt: table_array, sendt: table_array, timeout?: number): LuaMultiReturn<[table_array, table_array, string | nil]>;",
    "function skip|||LuaMultiReturn<[any|nil, any|nil, any|nil]>": "LuaMultiReturn<[object | nil, object | nil, object | nil]>",
    "function protect|||(func: function): function(function());": "(func: () => void): (fun: () => void) => void;",
    "function newtry|||(finalizer: function()): function;": "(finalizer: () => void): () => void;",

}

const patches_vmath: Record<string, string> = {
    "function vector(|||t: table": "t: number[]",

}

const patches_tilemap: Record<string, string> = {
    "function get_tile_info|||: table;": ": table_map;"
}

const patches_sys: Record<string, string> = {
    "function serialize|||table: table": "table: table_map",
    "function deserialize|||: table;": ": table_map;",
    "function load(|||: table;": ": any;",
    "function open_url|||attributes?: table": "attributes?: { target?: string, name?: string }",
    "function set_error_handler|||function(source, message, traceback)": "(source: string, message: string, traceback: string) => void",
    "function load_buffer_async|||function(self, request_id, result)": "(self: any, request_id: hash, result: { status: constant, buffer: buffer | object }) => void",
    "function get_ifaddrs|||: table;": ": { name: string, address?: string, mac?: string, up: boolean, running: boolean };",
    "function get_engine_info|||: table;": ": { version: string, version_sha1: string, is_debug: boolean };",
    "function get_application_info|||: table;": ": { installed: boolean };",
    "function get_sys_info|||(options?: table): table;":
        "(options?: { ignore_secure?: boolean }): { device_model?: string, manufacturer: string | nil, system_name: string, system_version: string, api_version: string, language: string, device_language: string, territory: string, gmt_offset: number, device_ident?: string, user_agent?: string };"

}

const patches_collectionproxy: Record<string, string> = {
    "function get_resources|||: table;": ": string[];",
    "function missing_resources|||: table;": ": string[];"
}

const patches_go: Record<string, string> = {
    "function animate|||playback: constant":
        "playback: typeof go.PLAYBACK_LOOP_BACKWARD | typeof go.PLAYBACK_LOOP_FORWARD | typeof go.PLAYBACK_LOOP_PINGPONG | typeof go.PLAYBACK_ONCE_BACKWARD | typeof go.PLAYBACK_ONCE_FORWARD | typeof go.PLAYBACK_ONCE_PINGPONG",
    "function animate|||easing: constant":
        "easing: typeof go.EASING_INBACK | typeof go.EASING_INBOUNCE | typeof go.EASING_INCIRC | typeof go.EASING_INCUBIC | typeof go.EASING_INELASTIC | typeof go.EASING_INEXPO | typeof go.EASING_INOUTBACK | typeof go.EASING_INOUTBOUNCE | typeof go.EASING_INOUTCIRC | typeof go.EASING_INOUTCUBIC | typeof go.EASING_INOUTELASTIC | typeof go.EASING_INOUTEXPO | typeof go.EASING_INOUTQUAD | typeof go.EASING_INOUTQUART | typeof go.EASING_INOUTQUINT | typeof go.EASING_INOUTSINE | typeof go.EASING_INQUAD | typeof go.EASING_INQUART | typeof go.EASING_INQUINT | typeof go.EASING_INSINE | typeof go.EASING_LINEAR | typeof go.EASING_OUTBACK | typeof go.EASING_OUTBOUNCE | typeof go.EASING_OUTCIRC | typeof go.EASING_OUTCUBIC | typeof go.EASING_OUTELASTIC | typeof go.EASING_OUTEXPO | typeof go.EASING_OUTINBACK | typeof go.EASING_OUTINBOUNCE | typeof go.EASING_OUTINCIRC | typeof go.EASING_OUTINCUBIC | typeof go.EASING_OUTINELASTIC | typeof go.EASING_OUTINEXPO | typeof go.EASING_OUTINQUAD | typeof go.EASING_OUTINQUART | typeof go.EASING_OUTINQUINT | typeof go.EASING_OUTINSINE | typeof go.EASING_OUTQUAD | typeof go.EASING_OUTQUART | typeof go.EASING_OUTQUINT | typeof go.EASING_OUTSINE",
    "function animate|||function(self, url, property)": "(self: any, url: url, property: hash) => void",
    "function get(|||options?: table": "options?: { index: integer, key: hash }",
    "function set(|||options?: table": "options?: table_map",
    "function set(|||value: any | table": "value: any",
}

const patches_html5: Record<string, string> = {
    "function set_interaction_listener|||callback: function(self) | nil": "callback: (self: any) => void | nil"
}

const patches_window: Record<string, string> = {
    "function set_listener|||function(self, event, data) | nil": "(self: any, event: constant, data: { width: number, height: number }) => void"
}

const patches_timer: Record<string, string> = {
    "function delay|||function(self, handle, time_elapsed)": "(self: any, handle: number, time_elapsed: number) => void",
    "function get_info|||: table|nil;": ": { time_remaining: number, delay: number, repeating: boolean };",
}

const patches_sound: Record<string, string> = {
    "function get_groups|||: table;": ": hash[];",
    "function stop(|||stop_properties?: table": "stop_properties?: { play_id: number }",
    "function play(|||play_properties?: table, complete_function?: function(self, message_id, message, sender)":
        "play_properties?: { delay?: number, gain?: number, pan?: number, speed?: number }, complete_function?: (self: any, message_id: hash, message: { play_id: number }, sender: url) => void",
}

const patches_resource: Record<string, string> = {
    "function set_buffer|||table?: table": "table?: { transfer_ownership?: boolean }",
    "function create_buffer|||table?: table": "table?: { buffer: buffer_data, transfer_ownership?: boolean }",
    "function get_text_metrics|||options?: table): table;":
        "options?: { width?: number, leading?: number, tracking?: number, line_break?: boolean }): { width: number, height: number, max_ascent: number, max_descent: number };",
    "function get_texture_info|||: table;": ": { handle: resource_handle, width: number, height: number, depth: number, mipmaps: number, flags: number, type: number };",
    "function set_texture(|||table: table": "table: TextureHeader",
    "function create_texture_async|||table: table":
        "table: { type: number, width: number, height: number, format: number, flags?: number, max_mipmaps?: number, compression_type?: number }",
    "function create_texture(|||table: table":
        "table: { type: number, width: number, height: number, format: number, flags?: number, max_mipmaps?: number, compression_type?: number }",
    "function create_texture_async|||buffer: buffer_data": "buffer?: buffer_data",
    "function create_texture(|||buffer: buffer_data": "buffer?: buffer_data",
    "function get_render_target_info|||: table;":
        ": { handle: resource_handle, attachments: { handle: resource_handle, width: number, height: number, depth: number, mipmaps: number, type: number, buffer_type: number, texture: hash }[] };",
    "function set_atlas|||table: table": "table: resource.atlas",
    "function get_atlas|||: table;": ": resource.atlas;",
    "function create_atlas|||table: table": "table: resource.atlas"
}

const patches_image: Record<string, string> = {
    "function load_buffer|||: table|nil;": ": { width: number, height: number, type: constant, buffer: buffer_data };",
    "function load(|||options?: table": "options?: {premultiply_alpha:boolean,flip_vertically:boolean}",
    "function load(|||: table|nil;": ": { width: number, height: number, type: constant, buffer: string };",

}

const patches_model: Record<string, string> = {
    "function play_anim|||play_properties?: table, complete_function?: function(self, message_id, message, sender)":
        "play_properties?: { blend_duration?: number, offset?: number, playback_rate?: number }, complete_function?: (self: any, message_id: hash, message: { animation_id: hash, playback: constant }, sender: url) => void",
}

const patches_sprite: Record<string, string> = {
    "function play_flipbook|||complete_function?: function(self, message_id, message, sender), play_properties?: table":
        "complete_function?: (self: any, message_id: hash, message: { current_tile: number, id: hash }, sender: url) => void, play_properties?: { offset: number, playback_rate: number }",
}

const patches_particlefx: Record<string, string> = {
    "function play(|||function(self, id, emitter, state)": "(self: any, id: hash, emitter: hash, state: constant) => void",
    "function stop(|||options?: table": "options?: { clear?: boolean }",

}

const patches_liveupdate: Record<string, string> = {
    "function add_mount|||callback: function": "callback: () => void",
    //? Constant use???
    "function store_archive|||callback: function(self, status)": "callback: (self: any, status: constant) => void",
    "function store_manifest|||callback: function(self, status)": "callback: (self: any, status: constant) => void",
    "function store_resource|||callback: function(self, hexdigest, status)": "callback: (self: any, hexdigest: string, status: boolean) => void",

}

const patches_json: Record<string, string> = {
    "function decode|||options?: table": "options?: { decode_null_as_userdata?: boolean }",
    "function encode|||options?: table": "options?: { encode_empty_table_as_object: string }",

}

const patches_http: Record<string, string> = {
    "function request|||callback: function(self, id, response)": " callback: (self: any, id: hash, response: { status: number, response: string, headers: any, path: string, error: string }) => void"
}
const patches_dns: Record<string, string> = {
    "function getnameinfo|||LuaMultiReturn<[table|nil, string|nil]>": "LuaMultiReturn<[table_map | nil, string | nil]>",
    "function getaddrinfo|||LuaMultiReturn<[table|nil, string|nil]>": "LuaMultiReturn<[table_map | nil, string | nil]>",
    "function toip|||LuaMultiReturn<[string|nil, table|string]>": "LuaMultiReturn<[string | nil, table_map | string]>",
    "function tohostname|||LuaMultiReturn<[string|nil, table|string]>": "LuaMultiReturn<[string | nil, table_map | string]>",
}
// const patches_gui: Record<string, string> = {}

// Patchindex is applied if the namespace is the same name as the module. to ensure scoped
// matches
export const patch_index: Record<string, Record<string, string>> = {
    "camera": patches_camera,
    "crash": patches_crash,
    "factory": patches_factory,
    "gui": patches_gui,
    "buffer": patches_buffer,
    "collectionfactory": patches_collectionfactory,
    "msg": patches_msg,
    "physics": patches_physics,
    "profiler": patches_profiler,
    "render": patches_render,
    "socket": patches_socket,
    "vmath": patches_vmath,
    "tilemap": patches_tilemap,
    "sys": patches_sys,
    "collectionproxy": patches_collectionproxy,
    "go": patches_go,
    "html5": patches_html5,
    "http": patches_http,
    "timer": patches_timer,
    "window": patches_window,
    "sound": patches_sound,
    "resource": patches_resource,
    "image": patches_image,
    "model": patches_model,
    "sprite": patches_sprite,
    "particlefx": patches_particlefx,
    "json": patches_json,
    "liveupdate": patches_liveupdate,
    //Technically socket.dns but this works
    "dns": patches_dns,
}