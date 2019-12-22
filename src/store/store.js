/* eslint no-console: 0 */

import Vue from 'vue'
import Vuex from 'vuex'

import * as event from '@/store/modules/event.js'
import * as notification from '@/store/modules/notification.js'
import * as user from '@/store/modules/user.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    event,
    notification,
    user
  },  
  state: {
    categories: [
      'sustainability', 
      'nature', 
      'animal welfare', 
      'housing', 
      'education', 
      'food', 
      'community'
    ]
  }
})


/*
--------------------------------------------------------------------------------
https://forum.vuejs.org/t/how-to-best-write-getter-and-setters-per-vuex-store-state-value/36485

The recommended Vuex setup
==========================

{
  state: {
    message: '',
  },
  getters: {
    message: state => state.message
  },
  mutations: {
    SET_MESSAGE: (state, newValue) => state.message = newValue
  },
  actions: {
    setMessage: ({commit, state}, newValue) => {
      commit('SET_MESSAGE', newValue)
      return state.message
    }
  }
}

Usages
======

import { mapActions, mapGetters, mapState } from 'vuex'

{
  // --- USING this.$store DIRECTLY ---

  computed: {
    message: {
      get() {
        return this.$store.state.message
      },
      set(newValue) {
        return this.$store.dispatch('setMessage', newValue)
      }
    }

    // --- USING VUEX HELPERS, DIRECTLY OR WITH GETTER ---

    ...mapState(['message']),
    ...mapGetters(['message']),
  },
  methods: {
    ...mapActions(['setMessage']),
  }
}
--------------------------------------------------------------------------------
*/
