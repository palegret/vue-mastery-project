import Vue from 'vue'
import Router from 'vue-router'

import EventCreate from './views/EventCreate.vue'
import EventList from './views/EventList.vue'
import EventShow from './views/EventShow.vue'
import User from './views/User.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'event-list',
      component: EventList
    },
    // The 'event-create' route has to be defined before the '/event/:id' route
    {
      path: '/event/create',
      name: 'event-create',
      component: EventCreate
    },
    {
      path: '/event/:id',
      name: 'event-show',
      component: EventShow,
      props: true
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

