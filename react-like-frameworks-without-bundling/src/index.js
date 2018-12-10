import Preact from 'preact';
import { h as createElement, render } from 'preact';
import { TestComponent } from './TestComponent';

import(`./test-dynamic-import`).then(({ hi }) => console.log(hi));

// must provided here, cause babel will normally check for `React.createElement`
/** @jsx createElement */
render(
  <div id="foo">
    <span>Hello, world! Yo!</span>
    <button onClick={e => alert("hi!")}>Click Me</button>
    <TestComponent />
  </div>,
  document.body
);
