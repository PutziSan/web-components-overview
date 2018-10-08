import Vue from "https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.esm.browser.js";

const App = {
  name: "App",
  template: `
    <div>
      <h1>Hello World</h1>
    </div>
  `
};

new Vue({
  render: h => h(App)
}).$mount(`#app`);
