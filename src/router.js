/* eslint no-console: 0 */

import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'

import store from '@/store/store'

import EventCreate from './views/EventCreate.vue'
import EventList from './views/EventList.vue'
import EventShow from './views/EventShow.vue'
import Example from './views/Example.vue'
import NetworkIssue from './views/NetworkIssue.vue'
import NotFound from './views/NotFound.vue'
import User from './views/User.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'event-list',
      component: EventList,
      props: true
    },
    // The 'event-create' route has to be defined before the '/event/:id' route.
    // Otherwise, the router thinks 'create' is a value for `:id`. 
    {
      path: '/event/create',
      name: 'event-create',
      component: EventCreate
    },
    {
      path: '/example',
      name: 'example',
      component: Example
    },
    {
      path: '/event/:id',
      name: 'event-show',
      component: EventShow,
      props: true,
      beforeEnter(routeTo, routeFrom, next) {
        const { id } = routeTo.params
        console.log(`Route-based beforeEnter route guard called for route 'event-show' (:id = ${id}).`)
        store.dispatch('event/fetchEvent', id).then(event => {
          routeTo.params.event = event
          NProgress.done()
          next()
        }).catch(error => {
          const status = parseInt((error && error.response && error.response.status) || -1, 10)
          const route = status === 404
            ? { name: '404', params: { resource: 'event' } }
            : { name: 'network-issue' }
          next(route)
        })
      }
    },
    {
      path: '/user/:username',
      name: 'user',
      component: User,
      props: true
    },
    {
      path: '/404',
      name: '404',
      component: NotFound,
    },
    {
      path: '/network-issue',
      name: 'network-issue',
      component: NetworkIssue
    },
    { 
      path: '*',
      redirect: { name: '404' }
    }    
  ]
})

// Note on router.onError handler: this handler isn't being hit, but the 
// underlying issue that this was intended to address was resolved by other 
// means. Leaving this handler here for later investigation.
// See: https://router.vuejs.org/api/#router-onerror

router.onError((err) => { /* Per vue-router/types/router.d.ts: ErrorHandler */
  console.log('router.onError entered, err:', err)
})

// Just doing this to play with keeping NProgress active in the global 
// beforeEach route guard, would be an unnecessary pain otherwise.

const staticRoutes = ['event-create', 'example', '404', 'network-issue']
const isStaticRoute = route => staticRoutes.some(routeName => routeName === route.name)

router.beforeEach((routeTo, routeFrom, next) => {
  console.log('Global beforeEach route guard has been called.')

  // Start the route progress bar if applicable.
  if (!isStaticRoute(routeTo))
    NProgress.start()

  next()
})

router.afterEach(() => {
  console.log('Global afterEach route guard has been called.')
  // Complete the animation of any active route progress bars.
  NProgress.done()
})

export default router
