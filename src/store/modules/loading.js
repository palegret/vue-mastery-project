// =============================================================================
// Medium.com
// Create a global loading progress indicator using Vuex, Axios, and NProgress 
// https://medium.com/@LoCascioNick/create-a-global-loading-progress-indicator-using-vuex-axios-and-nprogress-20451b33145a
// =============================================================================


// ------------------
// @/store/loading.js
// ------------------

const namespaced = true

const state = {
  loading: 0,
}

const mutations = {
  START_LOADING: state => state.loading++,
  FINISH_LOADING: state => state.loading--,
}

const getters = {
  loading: state => state.loading,
}

const loader = {
  namespaced,
  state,
  mutations,
  getters
}

export default loader


// ------------------
// @/services/http.js
// ------------------

import axios from 'axios'
import store from '@/store'

const http = axios.create()

http.interceptors.request.use(config => {
  store.commit('loader/START_LOADING')
  return config
}, error => {
  store.commit('loader/FINISH_LOADING')
  return Promise.reject(error)
})

http.interceptors.response.use(response => {
  store.commit('loader/FINISH_LOADING')
  return response
}, error => {
  store.commit('loader/FINISH_LOADING')
  return Promise.reject(error)
})

export default http


// -----------
// @/loader.js
// -----------

// Vuex exposes a watch method for binding logic to changes in the store. 
// Here we will:
//   a. register a watcher on state.loader.loading, and 
//   b. react to any changes using NProgress.

import NProgress from 'nprogress'
import store from '@/store'

NProgress.configure({ 
  easing: 'ease', 
  speed: 500, 
  showSpinner: false 
})


// Vuex watch
// https://vuex.vuejs.org/api/#watch
// watch(fn: Function, callback: Function, options?: Object): Function
// Reactively watch fn's return value and call callback when that value changes. 
// fn receives the store's state as the first argument, and getters as the second. 
// Accepts an options object having the same options as Vue's vm.$watch().
// To stop watching, call the returned unwatch function.

const watchValue = (state, getters) => state.loader.loading

const callback = (newVal, oldVal) => {
  // Checks if state.loader.loading is (newVal) or was (oldVal) 0; in these 
  // cases, the NProgress is .done(), or NProgress is .start()ing.

  if (newVal === 0) 
    return NProgress.done()

  if (oldVal === 0) 
    return NProgress.start()

  // Otherwise, NProgress is .set() to a value between 0 and 1 based on the 
  // changed value. A multiplier of 1.8 is used to “weight” the result.

  const weight = 1.8
  NProgress.set(weight / Math.max(oldVal, newVal))
}

const unWatch = store.watch(watchValue, callback)

// Example usage of unWatch(), cancelling the watch.
if (Math.random() === 0)
  unWatch()
