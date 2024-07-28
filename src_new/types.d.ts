export type MFunc = {
	documentation: string;
	name: string;
	params: MParameter[]; //-can be nil
	return_value: MParameter[]; //can be nil
	tag: string; // FUNCTION
};
export type MVar = {
	documentation: string;
	name: string;
	type: string;
	tag: MType; // VARIABLE
};

export type MProperty = {
	documentation: string;
	name: string;
	type: string;
	tag: string; // PROPERTY
	owner: string;
};

export type MMessage = {
	documentation: string;
	name: string;
	params: MParameter[]; //unused...?
	tag: string; // MESSAGE
	owner: string;
};
//-These go inside messages or functions
export type MParameter = {
	documentation: string;
	name: string;
	types: string[];
	isOptional: boolean;
	tag: string; // PARAMETER
};

export type MModule = {
	documentation: string; // can be nil
	items: any[]; // can be nil
	modules: MModule[]; // can be nil
	tag: MType; //can be nil
	name: string;
};

export type MSingleItem = {
	type: MType;
	brief: string;
	description: string;
	examples: string;
	name: string; //- Variable name, important
	parameters: any[];
	returnvalues: any[];
};
export enum MType {
	VARIABLE = "VARIABLE",
	FUNCTION = "FUNCTION",
	PROPERTY = "PROPERTY",
	MESSAGE = "MESSAGE",
	PARAMETER = "PARAMETER",
	MODULE = "MODULE",
	NESTED_MODULE = "NESTED_MODULE",
	UNKNOWN = "UNKNOWN",
}
