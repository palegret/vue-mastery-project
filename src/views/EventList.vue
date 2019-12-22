<template>
  <div>
    <h1>Events Listing for {{ user.user.name }}</h1>
    <EventCard v-for="event in event.events" :key="event.id" :event="event"/>
    <div v-if="!loading" style="text-align:center">
      <template v-if="hasPrevPage">
        <router-link :to="prevPageRoute" rel="prev">
          Prev Page
        </router-link>
      </template>
      <template v-if="hasPrevPage && hasNextPage">
        <strong class="divider">|</strong>
      </template>
      <template v-if="hasNextPage">
        <router-link :to="nextPageRoute" rel="next">
          Next Page
        </router-link>    
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import EventCard from '@/components/EventCard.vue'

export default {
  components: {
    EventCard
  },
  /*
  // THIS IS REPLACED BY mapState(['events'] BELOW
  data() {
    return {
      events: []
    }
  }
  */
  computed: {
    page() {
      return parseInt(this.$route.query.page, 10) || 1
    },
    pageOptions() {
      return { 
        page: this.page, 
        itemsPerPage: this.itemsPerPage 
      }
    },
    hasPrevPage() {
      return this.page !== 1
    },
    hasNextPage() {
      return this.event.eventsTotal > this.page * this.itemsPerPage
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
    ...mapState(['event', 'user'])
  },
  created() {
    this.itemsPerPage = 3
    this.$store.dispatch('event/fetchEvents', this.pageOptions)
  }
}
</script>

<style scoped>
.divider {
  padding-left: 4px;
  padding-right: 4px;
}
</style>>
