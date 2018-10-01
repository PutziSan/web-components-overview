# web-components (overwiev frameworks + native)

ToDos:

- polymer-lit-element-demo ([gitlab-wiki-eintrag](https://gitlab.com/apoly/apoly-42/wikis/frontend-development-without-build-script) dazu nochmal nutzen)
- allgemeine [polymer 3.0-Seite](https://www.polymer-project.org/) checken, vorallem PWA starter-Kit + Material Web Components (material-web-components sieht aber echt schlecht aus muss man sagen ^^)
- [polymer-testing](https://www.polymer-project.org/3.0/docs/tools/tests) anschauen (github-readme ist noch ncht auf 3.0 angepasst denke ich, sieht verwirrend aus)
- polymer-TypeScript-integration checken
- [polymer-components/guides](https://www.polymer-project.org/3.0/toolbox/app-layout) anschauen (**gut auch für allgemeine web-app-entwicklung!**)
  - [app-layout](https://github.com/PolymerElements/app-layout) => hier kann man auch gut sehen wie die polymer-crowd sich vorstellt dass es genutzt werden sollte

## Problem der Element-Definition

Was mich sehr stört ist, dass nicht ersichtlich ist wo die Elemente definiert werden. durch [`customElements.define("[ELE_NAME]", [ELE_IMPLEMENATION])`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) werden sie global bereitgestellt und verstanden. Möglichkeiten um es einfachedr zu machen:

### Möglichkeit: alle Element-Definitionen in einer Datei:

```javascript
import { CustomEle } from "./CustomEle.js";

const definitions = {
  "custom-ele": CustomEle
  // ...
};

for (var key in definitions) {
  customElements.define(key, definitions[key]);
}
```

Hat aber den Nachteil dass alles mit einem mal importiert werden muss

## Idee babel-plugin - JSX-to-web

Was mich sehr stört ist, dass nicht ersichtlich ist wo die Elemente definiert werden. Eine JSX-ähnliche Nutzung wäre idealer:

```javascript
// CustomElement.js
import { LitElement, html } from "@polymer/lit-element";

export class CustomElement{
  render() {
    return html`<div>My Custom Element!</div>`;
  }
}

customElements.define("custom-element", MyElement);

// app.js
import { LitElement, html } from "@polymer/lit-element";
import { CustomElement } from "./CustomElement.js";

class MyElement extends LitElement {
  render() {
    return html`
        <style> 
          .mood { color: green; } 
        </style>
        <div>
          Web Components are <span class="mood">cool</span>!
          <CustomElement />
        </div>`;
  }
}

customElements.define("my-element", MyElement);
```

which compiles to sth like:

```javascript
// app.js
import { LitElement, html } from "@polymer/lit-element";
import "./CustomElement.js";

class MyElement extends LitElement {
  render() {
    return html`
        <style> 
          .mood { color: green; } 
        </style>
        <div>
          Web Components are <span class="mood">cool</span>!
          <custom-element></custom-element>
        </div>`;
  }
}

customElements.define("my-element", MyElement);
```

if it detects double-declarations it will throw an error.

## old/advanced stuff

nur um es zu nennen, ich glaube nicht dass ich das brauche:

- [alte webcomponents-seite](http://webcomponents.github.io/) mit guten verweisen zu anderen frameworks
- [skatejs](https://github.com/skatejs/skatejs) als anderes größeres web-components-framework => sieht aber nicht so gut aus
