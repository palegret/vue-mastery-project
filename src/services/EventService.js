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
  },
  timeout: 5000
})

apiClient.interceptors.request.use(config => {
  NProgress.start()
  return config
})

// *** NOTE***
// THIS WAS WHY THE SECOND CALL WASN'T WORKING WHEN A NETWORK ERROR OCCURRED.
// For some reason, the second error doesn't get thrown, so none of the routing 
// to the networkerror view occurs. Adding an error handler to the response
// interceptor as shown below fixed this issue, allowing the progress bar to
// finish and the routing to conclude. Could be wrong on the particulars, so 
// for now we'll leave this as is, and maybe investgate later.

apiClient.interceptors.response.use(response => {
  NProgress.done()
  return response
}, error => { // <-- NEEDED THIS, SEE ABOVE
  NProgress.done()  
  throw error
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
