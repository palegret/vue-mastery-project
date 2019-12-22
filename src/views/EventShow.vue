<template>
  <div>
    <div class="event-header">
      <span class="eyebrow">@{{ event.time }} on {{ event.date }}</span>
      <h1 class="title">{{ event.title }}</h1>
      <h5>Organized by {{ event.organizer}}</h5>
      <h5>Category: {{ event.category }}</h5>
    </div>

    <BaseIcon name="map"><h2>Location</h2></BaseIcon>

    <address>{{ event.location }}</address>

    <h2>Event details</h2>
    <p>{{ event.description }}</p>

    <h2>Attendees
      <span class="badge -fill-gradient">{{ attendeeCount }}</span>
    </h2>
    <ul class="list-group">
      <li v-for="(attendee, index) in event.attendees" :key="index" class="list-item">
        <b>{{ attendee.name }}</b>
      </li>
    </ul>
  </div>
</template>

<script>
import { /*mapActions,*/ mapState } from 'vuex'
import NProgress from 'nprogress'

import store from '@/store/store'

export default {
  props: ['id'],
  /*
  data() {
    return {
      event: null
    }
  },
  */
  computed: {
    attendeeCount() {
      const attendees = (this.event && this.event.attendees) || []
      return  attendees.length
    },
    ...mapState({
      event: state => state.event.event
    })
  },
  /*
  // No longer needed after implementing beforeRouteEnter
  methods: {
    ...mapActions('event', ['fetchEvent'])
    // ...mapActions(['event/fetchEvent'])
  },
  created() {
    this.fetchEvent(this.id)
  },
  */
  beforeRouteEnter(routeTo, routeFrom, next) {
    NProgress.start()
    // `this` is unavailable in beforeRouteEnter(), so using store directly
    store.dispatch('event/fetchEvent', routeTo.params.id).then(() => {
      NProgress.done()
      next()
    })
  }
}
</script>

<style scoped>
.location {
  margin-bottom: 0;
}
.location > .icon {
  margin-left: 10px;
}
.event-header > .title {
  margin: 0;
}
.list-group {
  margin: 0;
  padding: 0;
  list-style: none;
}
.list-group > .list-item {
  padding: 1em 0;
  border-bottom: solid 1px #e5e5e5;
}
</style>