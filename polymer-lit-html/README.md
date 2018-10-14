# polymer with lit-html

[Polymers lit-element](https://github.com/Polymer/lit-element) is "An ultra-light custom element base class with a simple but expressive API".

## Fazit aktuell

Aktuell gefällt es mir nicht so gut, da zu viel Magie passiert (wenn eine beobachtete variabel per `... = [NEW_VALUE]`) geändert wird, kriegt es das mit und rendert neu, verwirrend und das muss man wissen, mag ich nicht.

> Eine andere Idee ist nur [lit-html](https://github.com/Polymer/lit-html) zu nutzen, aber wenn man es react-mäßig nutzen würde wird es zu performance-problemen führen da ständig alles neu gerendert wird.

### abzuwarten

Man bräuchte ein framework was lit-html vernünftig wrapped und zb über keys oder babel-macro vernünftige checks zur render-performance hinzufügen kann um ein check zu machen welche nested components neu gerendert werden müssen (quasi wier reacts [reconsilation-alg](https://reactjs.org/docs/reconciliation.html)).

> [stencil](https://stenciljs.com/) scheint da gute Schritte in der richtung zu machen, sollte ich beobachten



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