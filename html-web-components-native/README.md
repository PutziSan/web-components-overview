# Web Components

Web-Components sind [selbst erstellte HTML-Tags (custom elements)](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements), die durch Nutzung des [shadow-DOMS](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) unabhängig vom Dokument gerendert und upgedatet werden. Durch [`<template>`- und `<slot>`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots) können dynamische Inhalte und Kinder eingefügt werden.

> chrome unterstützt Web-Components als einziges ohne polyfill: [webcomponents-polyfill](https://github.com/webcomponents/webcomponentsjs)

## MDN-def

Auszug aus [Web Components zu verschiedenen Technologien (Intro by MDN)](https://developer.mozilla.org/en-US/docs/Web/Web_Components):

- [Custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements): A set of JavaScript APIs that allow you to define custom elements and their behaviour, which can then be used as desired in your user interface.
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM): A set of JavaScript APIs for attaching an encapsulated "shadow" DOM tree to an element — which is rendered separately from the main document DOM — and controlling associated functionality. In this way you can keep an element's features private, so they can be scripted and styled without the fear of collision with other parts of the document.
- [HTML templates](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots): The <template> and <slot> elements enable you to write markup templates that are not displayed in the rendered page. These can then be reused multiple times as the basis of a custom element's structure.

The basic approach for implementing a web component generally looks something like this:

1. Create a class or a function in which you specify your web component functionality. If using a class, use the ECMAScript 2015 class syntax (see Classes for more information).
1. Register your new custom element using the CustomElementRegistry.define() method, passing it the element name to be defined, the class or function in which its functionality is specified, and optionally, what element it inherits from.
1. If required, attach a shadow DOM to the custom element using Element.attachShadow() method. Add child elements, event listeners, etc., to the shadow DOM using regular DOM methods.
1. If required, define an HTML template using <template> and <slot>. Again use regular DOM methods to clone the template and attach it to your shadow DOM.
1. Use your custom element wherever you like on your page, just like you would any regular HTML element.

## example-packages

* [mdn/web-components-examples](https://github.com/mdn/web-components-examples)
* [google-components-examples](https://developers.google.com/web/fundamentals/web-components/examples/)

## weitere gute Links

- [Google-overview for building components](https://developers.google.com/web/fundamentals/web-components/)
- [Custom Elements v1: Reusable Web Components - Intro by Google-dev](https://developers.google.com/web/fundamentals/web-components/customelements#fromtemplate)
- [google-example for building a PWA via web.components (polymer v2)](https://developers.google.com/web/showcase/2016/iowa2016) (old but gold)
- allgemein zu app-dev: [The App Shell Model](https://developers.google.com/web/fundamentals/architecture/app-shell)


## live-reloading (dev)

HMR wird über eine Verbindung zu Websocket realisiert, am besten und saubersten kann man es aktuell bei parcel sehen, aber einfach zu komplex.

> TLDR => aktuell ist HMR extrems start gekoppelt an webpack, die besten Möglichkeiten sind webstorms live-reloading und live-server

Favorit: **[live-server](https://github.com/tapio/live-server)**

### jetbrains live-reload feature

[live-reload](https://www.jetbrains.com/help/webstorm/live-editing.html)

Mit der neuen Websotrm-Version scheint das auch ohne das Plugin zu gehen. Ansonsten ist es ziemlich geil.

> JS-module werden zwar ausgetauscht aber nicht neu geladen! Nutze strg-f5 for reload the whole page (idee: setInterval)

> Andere Idee dazu wäre auch eine eigene Komponente zu importieren die mit setIntervall und lifecycle-callbacks immer wieder render aufruft

### live-server

[live-server](https://github.com/tapio/live-server) watches the files and reloads on change (no hot module replacement!), but very fast!

### parcel
klappt nicht

### webpack-dev-server

einrichtung mega umständlich und klappt am ende auch nicht weil doof (konnte ich nicht rausfinden). (es lädt zwar neu aber letztendlich ist es kein neuer content




