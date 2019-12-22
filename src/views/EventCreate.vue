<template>
  <div>
    <h1>Create Event</h1>
    <small>{{event.user}}</small>
     <form @submit.prevent="createEvent">
      <label>Select a category</label>
      <select v-model="event.category">
        <option v-for="cat in sortedCategories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
      </select>
      <h3>Name & describe your event</h3>
      <div class="field">
        <label>Title</label>
        <input v-model="event.title" type="text" placeholder="Add an event title"/>
      </div>
      <div class="field">
        <label>Description</label>
        <input v-model="event.description" type="text" placeholder="Add a description"/>
      </div>
      <h3>Where is your event?</h3>
      <div class="field">
        <label>Location</label>
        <input v-model="event.location" type="text" placeholder="Add a location"/>
      </div>
      <h3>When is your event?</h3>
      <div class="field">
        <label>Date</label>
        <datepicker v-model="event.date" placeholder="Select a date"/>
      </div>
      <div class="field">
        <label>Select a time</label>
        <select v-model="event.time">
          <option value="">Select a time</option>
          <optgroup label="Morning Times">
            <option v-for="time in amTimes" :key="`am_${time.value}`" :value="time.value">{{ time.label }}</option>
          </optgroup>
          <optgroup label="Afternoon Times">
            <option v-for="time in pmTimes" :key="`pm_${time.value}`" :value="time.value">{{ time.label }}</option>
          </optgroup>
        </select>
      </div>
      <input type="submit" :disabled="!formValid" class="button -fill-gradient" value="Submit"/>
    </form>    
  </div>
</template>

<script>
/* eslint no-console: 0 */

import { mapGetters, mapState } from 'vuex'
import Datepicker from 'vuejs-datepicker'

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      event: this.createFreshEventObject()
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
    times() {
      const timesArray = [{value: '', label: 'Select a time'}]

      for (let hour = 0; hour <= 24; hour++) {
        let hourLabel;

        if (hour === 0) {
          hourLabel = '12:00 AM'
        } else if (hour < 13) {
          hourLabel = (hour < 10 ? `0${hour}:00` : `${hour}:00`) + ' AM'
        } else {
          hourLabel = (hour - 12 < 10 ? `0${hour - 12}:00` : `${hour - 12}:00`) + ' PM'
        }

        timesArray.push({value: hour, label: hourLabel})
      }

      return timesArray
    },
    amTimes() {
      return this.times.filter(time => time.value > 7 && time.value < 12)
    },
    pmTimes() {
      return this.times.filter(time => time.value > 12 && time.value < 18)
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
      this.$store.dispatch('event/createEvent', this.event).then(newEvent => {
        this.$router.push({ 
          name: 'event-show', 
          params: { id: newEvent.id } 
        })
        this.event = this.createFreshEventObject()
      }).catch(error => {
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
    }
  },
  beforeRouteLeave(routeTo, routeFrom, next) {
    if (this.formHasEdits) {
      const answer = window.confirm('You have unsaved changes. Leave this page?')

      if (answer) {
        next() // <-- Confirms the navigation
      } else {
        next(false) // <-- Cancels the navigation
      }
    } else {
      next()
    }
  }
}
</script>

<style>
input[type="submit"] {
  padding: 10px;
}
.field {
  margin-bottom: 24px;
}
.vdp-datepicker input {
  cursor: pointer;
}
</style>