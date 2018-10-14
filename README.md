# web-components (overwiev frameworks + native)

ToDos:

- polymer-lit-element-demo ([gitlab-wiki-eintrag](https://gitlab.com/apoly/apoly-42/wikis/frontend-development-without-build-script) dazu nochmal nutzen)
- allgemeine [polymer 3.0-Seite](https://www.polymer-project.org/) checken, vorallem PWA starter-Kit + Material Web Components (material-web-components sieht aber echt schlecht aus muss man sagen ^^)
- [polymer-testing](https://www.polymer-project.org/3.0/docs/tools/tests) anschauen (github-readme ist noch ncht auf 3.0 angepasst denke ich, sieht verwirrend aus)
- polymer-TypeScript-integration checken
- [polymer-components/guides](https://www.polymer-project.org/3.0/toolbox/app-layout) anschauen (**gut auch für allgemeine web-app-entwicklung!**)
  - [app-layout](https://github.com/PolymerElements/app-layout) => hier kann man auch gut sehen wie die polymer-crowd sich vorstellt dass es genutzt werden sollte

## vergleich verschiedener technologien

- web-components / polymer-lit-element : gute Idee da Code kaum transformiert werden muss zur Nutzung
- react : bietet leider keine ESM-Dateien aktuell an
- preact => bietet direkt schon ESM an, ist bedeutend kleiner aber beim rendern langsamer
- meteor => ebenfalls ESM included, benötigt aber in jedem Fall babel-parser

## Problem der Element-Definition

Was mich sehr stört ist, dass nicht ersichtlich ist wo die Elemente definiert werden. durch [`customElements.define("[ELE_NAME]", [ELE_IMPLEMENATION])`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) werden sie global bereitgestellt und verstanden. Möglichkeiten um es einfachedr zu machen:

> siehe `polymer-lit-html-with-babel-macro` wie man es machen könnte
