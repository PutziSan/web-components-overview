# react-like frameworks without bundling

getestet aktuell:

* [inferno](https://github.com/infernojs/inferno) angeblich schnellste implementierung
* [preact](https://preactjs.com/) mit nur 3kb größe sehr gute alternative da es sonst gleiche API wie react hat

react selbst ist aktuell so nicht möglich da sie noch kein ESM-build anbieten: [Formalize top-level ES exports #11503](https://github.com/facebook/react/issues/11503)

## Idee

1. Nutze react-like frameworks with JSX
1. via Babel nur das JSX-to-JS kompilieren, imports sollen nicht zu require umgeschrieben werden, kein preset-env

> die aktuelle `index.html` implementiert eigentlich die kompilierte Version => babel-config für oberes proposal müsste man implementieren, sollte aber nicht schwer sein

## babel

### dev-server

Möglichkeit:

- One possibility would be to use [browser sync](https://browsersync.io/) as a static server on e.g. dist and run something like  `babel src --out-dir dist --watch` in parallel. But this excludes hot-reloading und hat Probleme beim cachen (man müsste immer cache disablen damit alles neu lädt)

Selbst bauen mit node.js-server (zb express):

- watch mit [chokidar](https://github.com/paulmillr/chokidar) for file-changes inside `src/**`
     - file-path relativ zu `src/` normalisieren (tocheck wie das am sinnvollsten geht) und code in js-objekt schreiben wobei key der normaliserte file-path ist und value der kompilierte code
     - browser-sync oder live-reload muss dann darüber informiert werden dass neu geladen werden muss 
- GET auf js-Dateien abfangen und entsprechende response senden mit code aus js-objekt

### production-build

überlegen wie caching mit hashes in filenamem (filename austauschen und imports austauschen) [hashing-algorithmus-bsp](https://medium.com/@chris_72272/what-is-the-fastest-node-js-hashing-algorithm-c15c1a0e164e)

* problem ist definitiv mit polymer, serve funktioniert eigtl ganz gut, build fehlen aber ncoh einige features!
* es würde wirklich sinn machen ein eigenes kleines größeres tool zu schreiben dafür (build- + dev-tool)
* idee wäre zb mittels polymer dependencies (node_modules) umzuschreiben sodass sie sich alle gegenseitig + relativ auflösen und die dependencies dann in src/node_module einzusetzen
    * auch TS mit rein?
    
    
## weitere idee:

- [dynamic import polyfill nutzen](https://github.com/uupaa/dynamic-import-polyfill) als globale funktion
    - implementiert dynamisch ein `<script type="module" src="..."></script>`
- babel-plugin nutzen, um für production calls von `import(...)` zu `importModule([ABSOLUTE_PATH])` umzuschreiben
    - ABSOLUTE_PATH muss immer berechnet werden, sodass alle relativen pfade absolut auf das script zeigen
- generiere für den dependency-tree `<script type="module" src="PATH"></script>`, von unterster ebene im baum zu opberster, damit alles zentral vorgeladen wird und kein waterfall entsteht
- alle routen werden zentral definiert mit `const route = { path: string, module: () => import(PATH), next?: nextRoute }`
    - `next` ist optional, wenn definiert, wird wenn diese route geladen ist das nächste module im trichter vorgeladen (trichter meint den weg den ein Kunde im allgemeinem gehen soll auf der seite)
- generiere für alle routen die oben zentral definiert wurden eine statische html-index-seite um bestmöglich vorzuladen
    - generierung einmal über ein `PREFETCHED`-objekt was in der html-seite steht und außerdem eine generierte JS-Datei `prefetched.js` (für allgemein vorgeladene inhalte (zb menupunkte) und optional vorgeladene inhalte (zb blogbeiträge))

polymer-cli auf shadow-src: `polymer-cli --sources .dev-src/**/* --entrypoint .dev-src/index.html`

start-script, welches mit chokidar und babel

- polymer ist grundsätzlich ein tool aus der hölle
- damit mjs-unterstüzung für build funktionierit muss es getweaked werden in node_modules, bis der fix draußen ist https://github.com/Polymer/tools/issues/736
    - `node_modules/polymer-analyzer/lib/core/analysis-context.js` `['mjs', new javascript_parser_1.JavaScriptParser()],` ... hinzzfügen wo aktuel nuur `"js", ` ist
    
    
    
idee zur weiteren optimierung bzgl dependency-tree:
- mach den langen dependency-tree flat mit dynamisch vergebenen namen mit bables moduleResolver, der nochmal eine babel-schleife zum schluss macht und die aliase anpasst und node läuft entsprechend drüber und verschiebt die dateien neu


reihenfolge für production build:

1. `node build` => normal babel to parse everysthing to valid es6-files
1. `yarn build:polymer` => copy npm_modules into own path
1. `node minify` => minifiziere js-code
1. `node dependency-tree` => check alle dependencies und flatte den graph dass alle zufällige (kurze) namen bekommen und in `__a` liegen
    - nutze md5-hash (die ersten 8 chars) als contenthash (wenn der bereits existiert, nutze die nächsten 8 chars)
    
    
## Fazit next todos
    
ToDo:
- polymer durch eigenes babel-plugin austauschen: mit dependency-tree überprüfen welche beziehungen es gibt und die imports dann umschreiben und entsprechend kopieren
    - tree-shaking wäre hier noch ein todo
    - außerdem muss source-map-building überprüft werden
    
für Sourcemaps: check https://github.com/mozilla/source-map (aber für den anfang ist es wohl sinnvoller alles mit babel-plugins in einem rutsch durchzuziehen)