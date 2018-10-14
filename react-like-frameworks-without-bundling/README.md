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
