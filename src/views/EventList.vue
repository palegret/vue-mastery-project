<template>
  <div>
    <h1>Events Listing for {{ user.user.name }}</h1>
    <EventCard v-for="event in event.events" :key="event.id" :event="event"/>
    <div style="text-align:center">
      <template v-if="hasPrevPage">
        <router-link :to="firstPageRoute" rel="first">
          First
        </router-link>
        <strong class="divider">|</strong>
        <router-link :to="prevPageRoute" rel="prev">
          Previous
        </router-link>
      </template>
      <template v-if="hasPrevPage && hasNextPage">
        <strong class="divider">|</strong>
      </template>
      <template v-if="hasNextPage">
        <router-link :to="nextPageRoute" rel="next">
          Next
        </router-link>    
        <strong class="divider">|</strong>
        <router-link :to="lastPageRoute" rel="last">
          Last
        </router-link>    
      </template>
    </div>
  </div>
</template>

<script>
/* eslint no-console: 0 */

import { mapState } from 'vuex'

import store from '@/store/store'
import EventCard from '@/components/EventCard.vue'

// Has to be defined out here, no `this` when the route guards call it, so it 
// can't be added as a method on the component.

const getPageEvents = (routeTo, next) => {
  const page = parseInt(routeTo.query.page) || 1
  store.dispatch('event/fetchEvents', { page }).then(() => {
    routeTo.params.page = page
    next()
  })
}

export default {
  components: {
    EventCard
  },
  props: {
    page: {
      type: Number,
      required: true
    }
  },

  // THIS IS REPLACED BY mapState(['events'] BELOW
  /*
  data() {
    return {
      events: []
    }
  }
  */

  computed: {

    // Replaced by route-injected prop in lesson 5
    /*
    page() {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pageOptions() {
      return { 
        page: this.page, 
        itemsPerPage: this.itemsPerPage 
      }
    },
    */
    lastPage() {
      const totalFullPages = Math.floor(this.event.eventsTotal / this.event.itemsPerPage)
      const hasRemainder = (this.event.eventsTotal % this.event.itemsPerPage) > 0
      const lastPage = hasRemainder ? totalFullPages + 1 : totalFullPages
      return lastPage
    },
    hasPrevPage() {
      return this.page > 1
    },
    hasNextPage() {
      return this.page < this.lastPage
    },
    firstPageRoute() {
      return { 
        name: 'event-list', 
        query: { 
          page: 1 
        } 
      }
    },
    prevPageRoute() {
      return { 
        name: 'event-list', 
        query: { 
          page: this.page - 1 
        } 
      }
    },
    nextPageRoute() {
      return { 
        name: 'event-list', 
        query: { 
          page: this.page + 1 
        } 
      }
    },
    lastPageRoute() {
      return { 
        name: 'event-list', 
        query: { 
          page: this.lastPage 
        } 
      }
    },
    ...mapState(['event', 'user'])
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    getPageEvents(routeTo, next)
  },
  beforeRouteUpdate(routeTo, routeFrom, next) {
    getPageEvents(routeTo, next)
  }

  // Replaced by in-component route guards in lesson 5
  /*
  created() {
    this.itemsPerPage = 3
    this.$store.dispatch('event/fetchEvents', this.pageOptions)
  }  
  */
}
</script>

<style scoped>
.divider {
  padding-left: 4px;
  padding-right: 4px;
}
</style>>
