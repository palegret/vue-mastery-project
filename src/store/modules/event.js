/* eslint no-console: 0 */
/* eslint no-unused-vars: 0 */

import EventService from '@/services/EventService.js'

/*
================================================================================
TWO EXPORT PATTERNS
--------------------------------------------------------------------------------

1.  THE ONE BELOW, IMPORTED VIA:
    import * as event from '@/store/modules/event.js'

2.  EXPORT AS ONE OBJECT, E.G.:
    export default {
      namespaced: true,
      modules: {},  
      state: {},
      mutations: {},
      actions: {},
      getters: {}
    }
    IMPORTED VIA:
    import event from '@/store/modules/event.js'

================================================================================
*/

export const namespaced = true

export const state = {
  events: [],
  eventsTotal: 0,
  event: null
}

// MUTATIONS ARE SYNCHRONOUS: THEY UPDATE STATE
export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event)
  },
  SET_EVENTS(state, events) {
    state.events = events
  },
  SET_EVENTS_TOTAL(state, eventsTotal) {
    state.eventsTotal = eventsTotal
  },
  SET_EVENT(state, event) {
    state.event = event
  },
}

const Notifier = dispatch => {
  const mutation = 'notification/add'
  return {
    error(message) {
      dispatch(mutation, { type: 'error', message }, { root: true })
    },
    success(message) {
      dispatch(mutation, { type: 'success', message }, { root: true })
    },
  }  
}

// ACTIONS ARE ASYNCHRONOUS: THEY COMMUNICATE WITH RESOURCES
export const actions = {
  createEvent({ commit, dispatch, rootState }, event) {

    // TO DISPATCH AN ACTION IN ANOTHER MODULE:
    // dispatch('moduleName/actionToCall', __payload__, { root: true })

    // IMPORTANT: MUTATIONS SHOULD *NEVER* BE CALLED FROM ANOTHER MODULE.

    return EventService.postEvent(event).then(response => {
      const newEvent = response && response.data
      commit('ADD_EVENT', newEvent)
      Notifier(dispatch).success(`New event with ID ${newEvent.id} successfully created!`)
      return newEvent
    }).catch(error => {
      Notifier(dispatch).error('Error creating event: ' + error.message)
      throw error
    })
  },
  fetchEvents({ commit, dispatch }, { page, itemsPerPage }) {
    return EventService.getEvents(page, itemsPerPage).then(response => {
      const headers = (response && response.headers) || {}
      const xTotalCount = headers['x-total-count'] || -1
      const eventTotal = parseInt(xTotalCount, 10)
      commit('SET_EVENTS_TOTAL', eventTotal)

      const events = (response && response.data) || []
      commit('SET_EVENTS', events)
    }).catch(error => {
      Notifier(dispatch).error('Error fetching events: ' + error.message)
      throw error
    })
  },
  fetchEvent({ commit, dispatch, getters }, id) {
    const event = getters.getEventById(id)

    if (event) {
      commit('SET_EVENT', event)
      return event
    } else {
      return EventService.getEvent(id).then(response => {
        commit('SET_EVENT', response.data)
        return response.data
      }).catch(error => {
        Notifier(dispatch).error(`Error fetching event ID ${id}: ${error.message}`)
        throw error
      })
    }
  }
}

export const getters = {
  catLength: state => state.categories.length,
  getEventById: state => id => state.events.find(event => event.id === id)
}

/*
// ES5 version of getters.getEventById:
export const getters = {
  ...
  getEventById: function (state) { 
    return function (id) {
      return state.events.find(function (event) { 
        return event.id === id; 
      });
    };
  }
}
*/
