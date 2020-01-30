/* eslint no-console: 0 */

import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'

import store from '@/store/store'

import EventCreate from './views/EventCreate.vue'
import EventList from './views/EventList.vue'
import EventShow from './views/EventShow.vue'
import User from './views/User.vue'
import NotFound from './views/NotFound.vue'

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
        })    
      }
    },
    {
      path: "/user/:username",
      name: "user",
      component: User,
      props: true
    },
    {
      path: "*",
      component: NotFound
    }
  ]
})

router.beforeEach((routeTo, routeFrom, next) => {
  console.log('Global beforeEach route guard has been called.')
  // Start the route progress bar.
  NProgress.start()
  next()
})

router.afterEach(() => {
  console.log('Global afterEach route guard has been called.')
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
