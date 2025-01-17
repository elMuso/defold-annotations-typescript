/** @noSelfInFile */
/// <reference types="lua-types/5.1" />
/// <reference types="@typescript-to-lua/language-extensions" />
/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*[[
	requiredTypes.d.ts
	https://github.com/elMuso/defold-annotations-typescript
	with some code from on github.com/astrochili/defold-annotations
	Copyright (c) 2024 elMuso
	MIT license. See LICENSE for details.

	This is to make typescript aware of some defold base types. While
	in the original library this was done via config. Here it is injected into the final index.d.ts
	--*/
/** Objects that are treated as primitives while i figure out how they work */
type resource_data = object; //? Is this right?
type float = number;
type render_predicate = any; //? Is this right?
type socket_master = object; //? Is this right?
type socket_unconnected = object; //? Is this right?
type socket_client = object; //? Is this right?
type resource_handle = string; //? Is this right?
type constant_buffer = object; //? Is this right? It seems to be a partial table
type render_target = any; //? Is this right?
type integer = number;
type buffer_stream = any; //? Is this right?
type buffer_data = object; //? Is this right?
type constant = number;
type b2Body = any; //? Is this right?
type b2World = any; //? Is this right?
type b2BodyType = any; //? Is this right?
type nil = undefined;
type array = any[];
type table = any;
//! WARNING: This two types are made to ditinguish parameters and return types.
//! they might break functionality but allow for cleaner code.
//! For types that merge this two or are unknown (like json) the type table is used
type table_array = any[]; //? Is this right?
type table_map = Record<any, any>; //? Is this right?
///

///Keep this for retrocompatibility with other libraries
declare namespace vmath {
	type vector3 = globalThis.vector3;
	type vector4 = globalThis.vector4;
	type matrix4 = globalThis.matrix4;
	type quaternion = globalThis.quaternion;
}

declare namespace resource {
	type animation = {
		/** Optional flip the animation horizontally, the default value is false*/
		flip_horizontal?: boolean;
		/** Optional flip the animation vertically, the default value is false*/
		flip_vertical?: boolean;
		/** Optional fps of the animation, the default value is 30*/
		fps?: integer;
		/** Index to the last geometry of the animation (non-inclusive). Indices are lua based and must be in the range of 1 .. in atlas.*/
		frame_end: integer;
		/** Index to the first geometry of the animation. Indices are lua based and must be in the range of 1 .. in atlas.*/
		frame_start: integer;
		/** The height of the animation*/
		height: integer;
		/** The id of the animation, used in e.g sprite.play_animation*/
		id: string;
		/** Optional playback mode of the animation, the default value is go.PLAYBACK_ONCE_FORWARD*/
		playback?: constant;
		/** The width of the animation*/
		width: integer;
	};
	type atlas = {
		/**  A list of the animations in the atlas*/
		animations: animation[];
		/**  A list of the geometries that should map to the texture data*/
		geometries: geometry[];
		/**  The path to the texture resource, e.g "/main/my_texture.texturec"*/
		texture: string | hash;
	};
	type geometry = {
		/** The name of the geometry. Used when matching animations between multiple atlases*/
		id?: string;
		/** A list of the indices of the geometry in the form { i0, i1, i2, ..., in }. Each tripe in the list represents a triangle.*/
		indices: number[];
		/** A list of the uv coordinates in texture space of the geometry in the form of { u0, v0, u1, v1, ..., un, vn }*/
		uvs: number[];
		/** A list of the vertices in texture space of the geometry in the form { px0, py0, px1, py1, ..., pxn, pyn }*/
		vertices: number[];
	};
}

type TextureHeader = {
	type: number;
	width: number;
	height: number;
	format: number;
	x?: number;
	y?: number;
	num_mip_maps?: number;
	compression_type?: number;
};

declare namespace on_input {
	type touch = {
		/** Accelerometer x value (if present).*/
		acc_x: number | undefined;
		/** Accelerometer y value (if present).*/
		acc_y: number | undefined;
		/** Accelerometer z value (if present).*/
		acc_z: number | undefined;
		/** The change in x value.*/
		dx: number;
		/** The change in y value.*/
		dy: number;
		/** A number identifying the touch input during its duration.*/
		id: number;
		/** True if the finger was pressed this frame.*/
		pressed: boolean;
		/** True if the finger was released this frame.*/
		released: boolean;
		/** Number of taps, one for single, two for double-tap, etc*/
		tap_count: integer;
		/** The x touch location.*/
		x: number;
		/** The y touch location.*/
		y: number;
	};
	type action = {
		/** The change in x value of a pointer device, if present.*/
		dx: number | undefined;
		/** The change in y value of a pointer device, if present.*/
		dy: number | undefined;
		/** The change in screen space y value of a pointer device, if present.*/
		gamepad: integer | undefined;
		/** If the input was pressed this frame. This is not present for mouse movement.*/
		pressed: boolean | undefined;
		/** If the input was released this frame. This is not present for mouse movement.*/
		released: boolean | undefined;
		/** If the input was repeated this frame. This is similar to how a key on a keyboard is repeated when you hold it down. This is not present for mouse movement.*/
		repeated: boolean | undefined;
		/** The change in screen space x value of a pointer device, if present.*/
		screen_dx: number | undefined;
		/** The index of the gamepad device that provided the input.*/
		screen_dy: number | undefined;
		/** The screen space x value of a pointer device, if present.*/
		screen_x: number | undefined;
		/** The screen space y value of a pointer device, if present.*/
		screen_y: number | undefined;
		/**  List of touch input, one element per finger, if present.*/
		touch: on_input.touch[];
		/** The amount of input given by the user. This is usually 1 for buttons and 0-1 for analogue inputs. This is not present for mouse movement.*/
		value: number | undefined;
		/** The x value of a pointer device, if present.*/
		x: number | undefined;
		/** The y value of a pointer device, if present.*/
		y: number | undefined;
	};
}
declare namespace physics {
	type raycast_response = {
		/** The fraction of the hit measured along the ray, where 0 is the start of the ray and 1 is the end*/
		fraction: number;
		/** The collision group of the hit collision object as a hashed name*/
		group: hash;
		/** The instance id of the hit collision object*/
		id: hash;
		/** The normal of the surface of the collision object where it was hit*/
		normal: vector3;
		/** The world position of the hit*/
		position: vector3;
		/** The id supplied when the ray cast was requested*/
		request_id: number;
	};
}
/*[[
The following code is from https://github.com/thinknathan/ts-defold-types
It has some little modifications because vscode hates exported types
MIT license
]] */

/**
 * A unique identifier used to reference resources, messages, properties, and other entities within the game.
 * @see {@link https://defold.com/manuals/addressing/#hashed-identifiers|Addressing Manual}
 */
type hash = Readonly<
	LuaUserdata & {
		readonly __hash__: unique symbol;
	}
>;

/**
 * A reference to game resources, such as game objects, components, and assets.
 * @see {@link https://defold.com/manuals/addressing/|Addressing Manual}
 */
type url = {
	socket: hash;
	path: hash;
	fragment: hash | undefined;
};

/**
 * A representation of a GUI object.
 * @see {@link https://defold.com/manuals/gui/|GUI Manual}
 */
type node = Readonly<
	LuaUserdata & {
		readonly __node__: unique symbol;
	}
>;

/**
 * A block of memory that can store binary data.
 * @see {@link https://defold.com/manuals/buffer/|Buffer Manual}
 */
type buffer = object;

/**
 * Render pipeline predicate.
 * @see {@link https://defold.com/manuals/render/|Render Manual}
 */
type predicate = Readonly<
	LuaUserdata & {
		readonly __predicate__: unique symbol;
	}
>;

/**
 * Render pipeline target.
 * @see {@link https://defold.com/manuals/render/|Render Manual}
 */
type rendertarget = Readonly<
	LuaUserdata & {
		readonly __rendertarget__: unique symbol;
	}
>;

/**
 * Socket objects.
 */
type socketclient = object;
type socketmaster = object;
type socketunconnected = object;

/**
 * Not available in HTML5, iOS, Switch builds
 * @see {@link https://luajit.org/ext_jit.html|Documentation}
 */
declare namespace jit {
	/** Turns the JIT engine on.  */
	export function on(): void;
	/** Turns the JIT engine off. */
	export function off(): void;
	/** Enable JIT compilation for a Lua function. */
	export function on(
		fn: (...args: any[]) => unknown,
		recursive?: boolean
	): void;
	/** Disable JIT compilation for a Lua function. */
	export function off(
		fn: (...args: any[]) => unknown,
		recursive?: boolean
	): void;
	/** Enable JIT compilation for a module. */
	export function on(arg1: true, recursive?: boolean): void;
	/** Disable JIT compilation for a module. */
	export function off(arg1: true, recursive?: boolean): void;
	/**
	 * Attach a handler to the compiler pipeline with the given priority.
	 * The handler is detached if no priority is given.
	 */
	export function attach(
		handler: (...args: any[]) => unknown,
		priority?: number
	): void;
	export function security(): void;
	export function flush(): void;
	export const arch: string;
	/** Contains the version number of the LuaJIT core.  */
	export const version_num: number;
	/** Contains the LuaJIT version string. */
	export const version: string;
	export const os: string;
}

/**
 * A data stream derived from a buffer.
 * @see {@link https://defold.com/ref/stable/buffer/#buffer.get_stream:buffer-stream_name|API Documentation}
 */
type bufferstream = LuaUserdata & number[] & object;

/** @see {@link https://defold.com/ref/stable/vmath/|API Documentation} */

type vector3 = number & {
	/**
	 * Addition Operator for Vector3
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	add: LuaAdditionMethod<vector3, vector3>;
	/**
	 * Subtraction Operator for Vector3
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	sub: LuaSubtractionMethod<vector3, vector3>;
	/**
	 * Multiplication Operator for Vector3
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	mul: LuaMultiplicationMethod<number, vector3>;
	/**
	 * Division Operator for Vector3
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	div: LuaDivisionMethod<number, vector3>;
	/**
	 * Negation Operator for Vector3
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	unm: LuaNegationMethod<vector3>;

	x: number;
	y: number;
	z: number;
};

type vector4 = number & {
	/**
	 * Addition Operator for Vector4
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	add: LuaAdditionMethod<vector4, vector4>;
	/**
	 * Subtraction Operator for Vector4
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	sub: LuaSubtractionMethod<vector4, vector4>;
	/**
	 * Multiplication Operator for Vector4
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	mul: LuaMultiplicationMethod<number, vector4>;
	/**
	 * Division Operator for Vector4
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	div: LuaDivisionMethod<number, vector4>;
	/**
	 * Negation Operator for Vector4
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	unm: LuaNegationMethod<vector4>;

	x: number;
	y: number;
	z: number;
	w: number;
};

type matrix4 = number & {
	/**
	 * Multiplication Operator for Matrix4
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	mul: LuaMultiplicationMethod<number, matrix4> &
	LuaMultiplicationMethod<vector4, vector4>;

	c0: vector4;
	c1: vector4;
	c2: vector4;
	c3: vector4;
	m01: number;
	m02: number;
	m03: number;
	m04: number;
	m11: number;
	m12: number;
	m13: number;
	m14: number;
	m21: number;
	m22: number;
	m23: number;
	m24: number;
	m31: number;
	m32: number;
	m33: number;
	m34: number;
};

type quaternion = number & {
	/**
	 * Multiplication Operator for Matrix4
	 * @see {@link https://typescripttolua.github.io/docs/advanced/language-extensions#operator-map-types|TSTL Docs}
	 */
	mul: LuaMultiplicationMethod<quaternion, quaternion>;

	x: number;
	y: number;
	z: number;
	w: number;
};

// =^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^= //

/**
 * All ids in the engine are represented as hashes, so a string needs to be hashed
 * before it can be compared with an id.
 * @param s  string to hash
 * @returns hash  a hashed string
 * @see {@link https://defold.com/ref/stable/builtins/#hash:s|API Documentation}
 */
declare function hash(s: string): hash;

/**
 * Returns a hexadecimal representation of a hash value.
 * The returned string is always padded with leading zeros.
 * @param h  hash value to get hex string for
 * @returns hex  hex representation of the hash
 * @see {@link https://defold.com/ref/stable/builtins/#hash_to_hex:h|API Documentation}
 */
declare function hash_to_hex(h: hash): string;

/**
 * Pretty printing of Lua values. This function prints Lua values
 * in a manner similar to +print()+, but will also recurse into tables
 * and pretty print them. There is a limit to how deep the function
 * will recurse.
 * @param v  value to print
 * @see {@link https://defold.com/ref/stable/builtins/#pprint:v|API Documentation}
 */
declare function pprint(...v: any[]): void;
