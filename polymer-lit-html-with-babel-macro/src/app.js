import { LitElement, html } from "@polymer/lit-element";
import t from "../lit-element.macro";
import { TestEle } from "./TestEle.js";

class App extends LitElement {
  static get properties() {
    return {
      mood: { type: String }
    };
  }

  constructor() {
    super();
    this.mood = "happy";
  }

  render() {
    return html`
<div>
  ${t(
    TestEle,
    {
      bla: "asd",
      onClick: () => console.log("click")
    },
    `<div>
      TESTER
      <a>${t(TestEle)}</a>
    </div>`
  )}
</div>`;
  }
}

customElements.define("x-app", MyElement);
