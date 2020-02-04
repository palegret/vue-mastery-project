<template>
  <div>
    <h1>Create Event</h1>
    <small>{{event.user}}</small>
     <form @submit.prevent="createEvent">
      <h3>What type of event is this?</h3>
      <BaseSelect v-model="event.category" :options="sortedCategories" label="Category" />

      <h3>Name & describe your event</h3>
      <BaseInput v-model="event.title" type="text" class="field" label="Title" placeholder="Add an event title" />
      <BaseInput v-model="event.description" type="text" class="field" label="Description" placeholder="Add a description" />

      <h3>Where is your event?</h3>
      <BaseInput v-model="event.location" type="text" class="field" label="Location" placeholder="Add a location" />

      <h3>When is your event?</h3>
      <div class="field">
        <label>Date</label>
        <datepicker v-model="event.date" placeholder="Select a date"/>
      </div>

      <TimeSelect v-model="event.time" :startTime="8" :endTime="17" label="Time" class="field" /> 

      <div class="buttons">
        <BaseButton type="submit" :disabled="!formValid" buttonClass="-fill-gradient">Submit</BaseButton>        
        <input type="submit" :disabled="!formValid" class="button -fill-gradient" value="Submit"/>
      </div>
    </form>    
  </div>
</template>

<script>
/* eslint no-console: 0 */
/* eslint no-unused-vars: 0 */

import { mapGetters, mapState } from 'vuex'
import NProgress from 'nprogress'

import Datepicker from 'vuejs-datepicker'

import TimeSelect from '@/components/TimeSelect'

export default {
  components: {
    Datepicker,
    TimeSelect
  },
  data() {
    return {
      event: this.createFreshEventObject(),
      formWasSubmitted: false
    }
  },
  // 
  // Different ways of using mapState:
  // 
  // >> Most verbose:
  // computed: mapState({
  //   userName: state => state.user.name,
  //   userId: state => state.user.id,
  //   categories: state => state.categories
  // })
  // >> Less verbose:
  // computed: mapState({
  //   user: 'user',
  //   categories: 'categories'
  // })
  // >> Least verbose (object spread optional):
  // computed: {
  //   ...mapState(['user', 'categories'])
  // }
  // 
  computed: {
    catLength() {
      return this.$store.getters.catLength;
    },
    sortedCategories() {
      const sorted = [].concat(this.categories).sort().map(c => ({value: c, label: c}))
      return [{value: '', label: 'Select a category'}].concat(sorted)
    },
    formValid() {
      return this.event.category
        && this.event.title
        && this.event.description
        && this.event.location
        && this.event.date
        && this.event.time
    },
    user() {
      return this.$store.state.user.user;
    },
    formHasEdits() {
      return this.event.category !== ''
        || this.event.title !== ''
        || this.event.description !== ''
        || this.event.location !== ''
        || this.event.date !== ''
        || this.event.time !== ''
    },
    ...mapGetters('event', ['getEventById']),
    ...mapState(['categories'])
  },
  methods: {
    createEvent() {
      this.formWasSubmitted = true
      NProgress.start()
      this.$store.dispatch('event/createEvent', this.event).then(newEvent => {
        const params = { id: newEvent.id }
        this.$router.push({ name: 'event-show', params })
        this.event = this.createFreshEventObject()
      }).catch(error => {
        NProgress.done()
        console.error(error)
      })
    },
    createFreshEventObject() {
      return {
        id: null,
        category: '',
        organizer: this.user,
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        attendees: []
      }
    },
    onBeforeUnload(event, next = null) {
      // See https://stegosource.com/prevent-browser-refresh-url-changes-route-navigation-vue/

      console.log('onBeforeUnload event:', event)
      
      if (!this.formHasEdits || this.formWasSubmitted) {
        next && next() // <-- Confirms the navigation
        return
      }
    
      // Note: setting the value of returnValue is required by Chrome, but that
      // value is no longer used in BeforeUnload event's alert message.
      // See https://dev.to/chromiumdev/sure-you-want-to-leavebrowser-beforeunload-event-4eg5

      (event || window.event).returnValue = ''

      const answer = window.confirm('You have unsaved changes. Still want to leave?')

      if (answer) {
        this.$store.dispatch('notification/add', { type: 'error', message: 'Damn son, you left.' }, { root: true })
        next && next() // <-- Confirms the navigation
      } else {
        this.$store.dispatch('notification/add', { type: 'error', message: 'Yeah I thought so.' }, { root: true })
        next && next(false) // <-- Cancels the navigation
      }
    }
  },  
  beforeRouteLeave(routeTo, routeFrom, next) {
    console.log(`Component-based beforeRouteLeave route guard called for route 'event-create'.`)
    // No longer needed, but useful to show where such catching would occur.
    // this.onBeforeUnload(null, next)
    next()
  },
  beforeMount() {
    // No longer needed, but useful to show where such catching would occur.
    // window.addEventListener("beforeunload", this.onBeforeUnload)
  },
  beforeDestroy() {
    // No longer needed, but useful to show where such catching would occur.
    // window.removeEventListener("beforeunload", this.onBeforeUnload);
  }
}
</script>

<style>
input[type="submit"] {
  padding: 10px;
}
.buttons {
  margin-top: 24px;
  text-align: center;
}
.field {
  margin-bottom: 24px;
}
.vdp-datepicker input {
  cursor: pointer;
}
</style>