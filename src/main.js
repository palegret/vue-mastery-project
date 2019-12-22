// import "nprogress/nprogress.css";
import "./styles/nprogress-overrides.css";

import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

// Codebase for the following Vue Mastery courses:
// 💥 Real World Vue.js
// 💥 Mastering Vuex
// 💥 Next-Level Vue

// GitHub: https://github.com/Code-Pop/real-world-vue

import Vue from "vue";

import router from "./router";
import store from "./store/store";

import App from "./App.vue";

Vue.config.productionTip = false;

// From: https://vuejs.org/v2/guide/components-registration.html#Automatic-Global-Registration-of-Base-Components

const baseComponentContext = require.context("./components", false, /Base[A-Z]\w+\.(vue|js)$/);

baseComponentContext.keys().forEach(filePath => {
  const componentConfig = baseComponentContext(filePath)
  const fileName = filePath.split("/").pop().replace(/\.\w+$/, "");
  const pascalCasedComponentName = upperFirst(camelCase(fileName))

  // Uses default if exported with `export default`
  const componentDefinition = componentConfig.default || componentConfig

  Vue.component(pascalCasedComponentName, componentDefinition)
});

/*
// The above is in lieu of:
import BaseButton from "./components/BaseButton";
import BaseIcon from "./components/BaseIcon";
import BaseInput from "./components/BaseInput";
// ...
Vue.component("BaseIcon", BaseIcon)
Vue.component("BaseButton", BaseButton)
Vue.component("BaseInput", BaseInput)
// ...
// Vue.component("Base...
// ...
*/

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
