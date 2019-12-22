/* eslint no-console: 0 */

// Couldn't run json-server in CodeSandBox, so mocked it here
// import MockApi from './MockApi'

import axios from 'axios'
import NProgress from 'nprogress'

const apiClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false, // This is the default
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(config => {
  NProgress.start()
  return config
})

apiClient.interceptors.response.use(response => {
  NProgress.done()
  return response
})

export default {
  /*
  getEventsTotal() {
    return MockApi.getEventsTotal()
  },
  */
  getEvents(page, itemsPerPage) {
    return apiClient.get(`/events?_limit=${itemsPerPage}&_page=${page}`)
    // return MockApi.getEvents(itemsPerPage, page)
  },
  getEvent(id) {
    return apiClient.get('/events/' + id)
    // return MockApi.getEvent(id)
  },
  postEvent(event) {
    return apiClient.post('/events', event)
    // return MockApi.postEvent(event)
  },  
}
