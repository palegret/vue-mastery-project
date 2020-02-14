// =============================================================================
// Codebase for the following Vue Mastery courses:
//
// 💥 Real World Vue.js
// 💥 Mastering Vuex
// 💥 Next-Level Vue
// 
// GitHub: https://github.com/Code-Pop/real-world-vue
// =============================================================================

import "./styles/nprogress-overrides.css"; // Default: nprogress/nprogress.css

import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

import "./plugins/vuelidate";
import "./filters";

import router from "./router";
import store from "./store/store";

import App from "./App.vue";

import Vue from "vue";

Vue.config.productionTip = false;

// The following component registration code is in lieu of having to manually 
// import and call Vue.component() on each import. 
// See: https://vuejs.org/v2/guide/components-registration.html#Automatic-Global-Registration-of-Base-Components

const baseComponentContext = require.context("./components", false, /Base[A-Z]\w+\.(vue|js)$/);

baseComponentContext.keys().forEach(filePath => {
  const fileName = filePath.split("/").pop().replace(/\.\w+$/, "");
  const pascalCasedComponentName = upperFirst(camelCase(fileName))
  const componentConfig = baseComponentContext(filePath)
  const componentDefinition = componentConfig.default || componentConfig
  Vue.component(pascalCasedComponentName, componentDefinition)
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
