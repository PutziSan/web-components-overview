import { LitElement, html } from '@polymer/lit-element';

export class TestEle extends LitElement {
  static get properties() {
    return {
      mood: { type: String }
    };
  }

  constructor() {
    super();
    this.mood = 'happy';
  }

  render() {
    return html`show me da moooood: ${this.mood}`;
  }
}

customElements.define("x-test-ele", MyElement);
