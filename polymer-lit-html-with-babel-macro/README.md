
Aktuell ist dies ein POC wie mittels einem [babel-macro](https://github.com/kentcdodds/babel-plugin-macros) die developper-experience verbessert werden kann wenn man antive WebComponents nutzen möchte.

ToDos beim Macro:
* allgemeine tests + checken ob babel-macros bzw babel-plugins eine typisierung (flow/typescript) anbietet, typisierung hier mega wichtig da mit verwirrendem AST gearbeotet wird


## weiterhin todo beim project

* polymer in dev/build-script via babel mit einbauen (polymer wird nur genutzt um absolute esm-imports von node_modules auf relative umzuschreiben) => check [polymer-build](https://github.com/Polymer/tools/tree/master/packages/build) dazu
* babel/TS allgemein aufsetzen => wie kann es am optimalsten genutzt werden mit einem watch-script 