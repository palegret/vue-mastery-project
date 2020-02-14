<template>
  <div>
    <h1>Create Event</h1>
    <small>{{event.user}}</small>
     <form @submit.prevent="createEvent">
      <h3>Tell us about your event</h3>

      <BaseSelect 
        v-model="event.category" 
        class="field" 
        label="Category" 
        :options="sortedCategories" 
        :class="cssClassesFor('category')"
        @blur="touch('category')"
      />
      <template v-if="$v.event.category.$error">  
        <p v-if="!$v.event.category.required" class="error-message">Category is required.</p>
      </template>

      <BaseInput 
        v-model="event.title" 
        type="text" 
        class="field" 
        label="Title" 
        placeholder="Add an event title" 
        :class="cssClassesFor('title')"
        @blur="touch('title')"
      />
      <template v-if="$v.event.title.$error">
        <p v-if="!$v.event.title.required" class="error-message">Title is required.</p>
      </template>

      <BaseInput 
        v-model="event.description" 
        type="text" 
        class="field" 
        label="Description" 
        placeholder="Add a description" 
        :class="cssClassesFor('description')"
        @blur="touch('description')"
      />
      <template v-if="$v.event.description.$error">
        <p v-if="!$v.event.description.required" class="error-message">Description is required.</p>
      </template>

      <h3>Where is your event?</h3>

      <BaseInput 
        v-model="event.location" 
        type="text" 
        class="field" 
        label="Location" 
        placeholder="Add a location" 
        :class="cssClassesFor('location')"
        @blur="touch('location')"
      />
      <template v-if="$v.event.location.$error">
        <p v-if="!$v.event.location.required" class="error-message">Location is required.</p>
      </template>

      <h3>When is your event?</h3>
      <div class="field">
        <label>Date</label>

        <!--
        NOTE: The `opened` event on vuejs-datepicker is broken (missing). The
        implementation is provided by two pull requests that have not yet been 
        merged as of 2/8/2020:

        https://github.com/charliekassel/vuejs-datepicker/pull/770 
        https://github.com/charliekassel/vuejs-datepicker/pull/795

        For now I'll just use the `closed` event instead.
        -->

        <datepicker 
          v-model="event.date" 
          placeholder="Select a date"
          :input-class="cssClassesFor('date')"
          @closed="touch('date', 'closed')"
        />
      </div>
      <template v-if="$v.event.date.$error">
        <p v-if="!$v.event.date.required" class="error-message">Date is required.</p>
      </template>

      <TimeSelect 
        v-model="event.time" 
        :startTime="8" 
        :endTime="17" 
        label="Time" 
        class="field" 
        :class="cssClassesFor('time')"
        @blur="touch('time')"
      /> 
      <template v-if="$v.event.time.$error">
        <p v-if="!$v.event.time.required" class="error-message">Time is required.</p>
      </template>

      <div class="buttons">
        <BaseButton 
          type="submit" 
          :disabled="$v.$invalid" 
          buttonClass="-fill-gradient"
        >Submit</BaseButton>
         <p v-if="$v.$anyError" class="error-message">Please fill out the required field(s) above.</p>
      </div>
    </form>    
  </div>
</template>

<script>
/* eslint no-console: 0 */
/* eslint no-unused-vars: 0 */

import { mapGetters, mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators'
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
  validations: {
    event: {
      category: { required },
      title: { required },
      description: { required },
      location: { required },
      date: { required },
      time: { required }
    }
  },  
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
      this.$v.$touch()

      if (this.$v.$invalid)
        return;

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
    touch(eventProperty) {
      this.$v.event[eventProperty].$touch()
    },
    cssClassesFor(eventProperty) {
      return { error: this.$v.event[eventProperty].$error }
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