import { render, h } from 'preact';
import { TestComponent } from './TestComponent';

import('./test-dynamic-import').then(({ hi }) => console.log(hi));

// must provided here, cause babel will normally check for `React.createElement`
/** @jsx h */
render(
  <div id="foo">
    <span>Hello, world! Yo!</span>
    <button onClick={e => alert("hi!")}>Click Me</button>
    <TestComponent />
  </div>,
  document.body
);
