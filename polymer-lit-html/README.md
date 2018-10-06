# polymer with lit-html

[Polymers lit-element](https://github.com/Polymer/lit-element) is "An ultra-light custom element base class with a simple but expressive API".

## devlopping with polymer

Da wir Dateien von node_modulen importieren, aber keine relativen Pfade nutzen, muss [polymer-cli](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) mit genutzt werden.

### npm start-script

#### polymer-cli

`"start:polymer": "polymer serve --compile never (...)"`

- schreibt absolute importe (`import { LitElement } from '@polymer/lit-element';`) von node_modules zu relativen importen um und stellt die Dateien entsprechend bereit
- greift per default `index.html` zu, welches in der root liegen bleibeb sollte, da es sonst nicht mehr korrekt auf node_mdoules zugreifen kann
- `--compile never` (do not compile js to ES5)
  - `Compiler options. Valid values are "auto", "always" and "never". "auto". compiles JavaScript to ES5 for browsers that don't fully support ES6.`

#### browser-sync

`browser-sync start --proxy localhost:8042 --files 'src/*.html, src/*.js'`:

* [browser-sync](https://browsersync.io) watches your files and reload on changes:
* `--proxy  localhost:8042` => (check url from `polymer`-cli-output) 
    * (from browser-sync-doku): `If you’re already running a local server with PHP or similar, you’ll need to use the proxy mode. Browsersync will wrap your vhost with a proxy URL to view your site.`
* you should use the two commands in 2 different scripts, the combination will not work very good