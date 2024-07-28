# Defold Annotations for Typescript

Hugely based around the idea of [Defold annotations](https://github.com/astrochili/defold-annotations/), this repository aims to be the same, for typescript, but better.

It parses the official documentation from [Defold](https://defold.com) and translates it to 2 typescript definition files.

Node 20.15.1 was used for this. Might not run with other versions

# Integrate with ts-defold

By default ts-defold provides their own types already on tsconfig.json. If you want to replace(or test) this repository i suggest you make a defold-ts project as normal, then after it's done, download the latest .zip [Release](https://github.com/elMuso/defold-annotations-typescript/releases) and extract anywhere on yout project folder.

You will need to modify this line from `tsconfig.json`

`"types": ["@typescript-to-lua/language-extensions", "@ts-defold/types"],`

to

`"types": ["@typescript-to-lua/language-extensions", "lua-types/5.1"],`

and you should be good to go.

## Use case

These annotations can be used by anyone just by dragging the file to your project

-   index.d.ts contains the Defold API, constants and functions
-   messages.d.ts contains a useful `dfld` object that can serve as a helper to avoid sending messages (prefix msg*) or to look up the documentation of something. It also contains the propertyes of each module (prefix p*) and the return messages to use on on*message (prefix msg_id*)

## Manual Generation

Install Node, run `npm install` and then `npm run start`. **_The output will be on the api folder_**

### Issues

If you find a typo in the annotations or outdated meta information, create an issue.

### Settings

By default it uses Defold version 1.9.1 , you can change this by editing the src_new/settings.ts file. There are other useful conditionals there to remove information from the final build

### Todo

-   [ ] Use namespace specific constants to have specific parameter return values. Maybe enums?
-   [ ] Test the code and table, table_array, table_map
-   [ ] Expand table declarations from the official documentation
-   [ ] Implement on a project
