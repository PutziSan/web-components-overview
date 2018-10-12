um nicht ein komplettes babel-plugin zu schreiben ist das möglich:

* [babel-plugin-preval](https://github.com/kentcdodds/babel-plugin-preval):  Pre-evaluate code to a static variable at build-time
* [babel-plugin-codegen](https://github.com/kentcdodds/babel-plugin-codegen): Generate code at build-time
* [babel-macros](https://github.com/kentcdodds/babel-plugin-macros): import a macro in your code which will disappear and change at build-time

## babel-macros

1. import das macro, zb : `import myMacro, { otherMacro } from './my.macro.js';`
1. überall wo das macro genutzt wird, kriegen wir in der macro-funkton ein array-item im `references.[...]`-array
    * wenn default import genutzt wird (im obigem Beispiel `myMacro`) wird ein Eintrag zu `references.default` hinzugefügt)
    * wenn named export (im obigem Beispiel `otherMacro`) wird ein Eintrag zu `references.otherMacro` hinzugefügt 


AST kennlernen und dynamisch analysiseren: [astexplorer](https://astexplorer.net/)

