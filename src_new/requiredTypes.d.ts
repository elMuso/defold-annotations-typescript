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

type matrix4 = {
	c0: vector4;
	c1: vector4;
	c2: vector4;
	c3: vector4;
	m00: number;
	m01: number;
	m02: number;
	m03: number;
	m10: number;
	m11: number;
	m12: number;
	m13: number;
	m20: number;
	m21: number;
	m22: number;
	m23: number;
	m30: number;
	m31: number;
	m32: number;
	m33: number;
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

declare namespace resource {
	type animation = {
		/** Optional flip the animation horizontally, the default value is false*/
		flip_horizontal: boolean | nil;
		/** Optional flip the animation vertically, the default value is false*/
		flip_vertical: boolean | nil;
		/** Optional fps of the animation, the default value is 30*/
		fps: integer | nil;
		/** Index to the last geometry of the animation (non-inclusive). Indices are lua based and must be in the range of 1 .. in atlas.*/
		frame_end: integer;
		/** Index to the first geometry of the animation. Indices are lua based and must be in the range of 1 .. in atlas.*/
		frame_start: integer;
		/** The height of the animation*/
		height: integer;
		/** The id of the animation, used in e.g sprite.play_animation*/
		id: string;
		/** Optional playback mode of the animation, the default value is go.PLAYBACK_ONCE_FORWARD*/
		playback: constant | nil;
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
		id: string;
		/** A list of the indices of the geometry in the form { i0, i1, i2, ..., in }. Each tripe in the list represents a triangle.*/
		indices: number[];
		/** A list of the uv coordinates in texture space of the geometry in the form of { u0, v0, u1, v1, ..., un, vn }*/
		uvs: number[];
		/** A list of the vertices in texture space of the geometry in the form { px0, py0, px1, py1, ..., pxn, pyn }*/
		vertices: number[];
	};
}

type url = {
	fragment: hash;
	path: hash;
	socket: hash;
};

type vector3 = {
	x: number;
	y: number;
	z: number;
	//  add: function (vector3): vector3;
	//  mul: function (number): vector3;
	//  sub: function (vector3): vector3;
	//  unm: function (): vector3;
};

type vector4 = {
	w: number;
	x: number;
	y: number;
	z: number;
	// add: function (vector4): vector4
	// mul: function (number): vector4
	// sub: function (vector4): vector4
	// unm: function (): vector4
};
/**Hashes a string.
 * All ids in the engine are represented as hashes,
 * so a string needs to be hashed before it can be compared with an id. */
declare function hash(string: string): hash;
/**Get hex representation of a hash value as a string.
 * The returned string is always padded with leading zeros. */
declare function hash_to_hex(hash: hash): string;
/**Pretty printing of Lua values.
 * This function prints Lua values in a manner similar to lua.Lua.print,
 * but will also recurse into tables and pretty print them. There is a
 * limit to how deep the function will recurse. */
declare function pprint(value: any): void;

type array = any[];
type table = any;

//! WARNING: This two types are made to ditinguish parameters and return types.
//! they might break functionality but allow for cleaner code.
//! For types that merge this two or are unknown (like json) the type table is used
type table_array = any[]; //? Is this right?
type table_map = Record<any, any>; //? Is this right?
///
type resource_handle = string; //? Is this right?
type integer = number;
type constant_buffer = object; //? Is this right? It seems to be a partial table
type render_predicate = any; //? Is this right?
type render_target = any; //? Is this right?
type resource_data = object; //? Is this right?
type socket_client = object; //? Is this right?
type socket_master = object; //? Is this right?
type socket_unconnected = object; //? Is this right?
type buffer_stream = any; //? Is this right?
type buffer_data = any; //? Is this right?
type buffer = object; //? Is this right?
type b2BodyType = any; //? Is this right?
type b2Body = any; //? Is this right?
type b2World = any; //? Is this right?
type nil = undefined;
type node = object;
type float = number;
type hash = string;
type constant = number;
type quaternion = {
	x: number;
	y: number;
	z: number;
	w: number;
};
