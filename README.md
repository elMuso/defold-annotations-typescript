# Defold Annotations for Typescript

Hugely based around the idea of [Defold annotations](https://github.com/astrochili/defold-annotations/), this repository aims to be the same, for typescript, but better.

It parses the official documentation from [Defold](https://defold.com) and translates it to 2 typescript definition files.

Node 20.15.1 was used for this. Might not run with other versions

<!-- Generated annotations are available on the [Releases](https://github.com/astrochili/defold-annotations/releases) page. -->

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
