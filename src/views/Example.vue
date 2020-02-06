<template>
  <form @submit.prevent="submit">
    <h2>Example Form</h2>
    <div class="field">
      <input 
        type="text" 
        placeholder="What's your username?" 
        v-model="username" 
        :class="{ error: $v.username.$error }"
        @blur="$v.username.$touch()" 
      />
      <div class="error-message" v-if="$v.username.$error">
        <p v-if="!$v.username.required">Username is required.</p>
      </div>
    </div>
    <div class="field">
      <input 
        type="email" 
        placeholder="What's your email?" 
        v-model="email" 
        :class="{ error: $v.email.$error }"
        @blur="$v.email.$touch()" 
      />
      <div class="error-message" v-if="$v.email.$error">
        <p v-if="!$v.email.required">Email is required.</p>
        <p v-if="!$v.email.email">Please enter a valid email.</p>
      </div>
    </div>
    <BaseButton type="submit" buttonClass="-fill-gradient" :disabled="$v.$invalid">Submit</BaseButton>
    <p v-if="$v.$anyError" class="error-message">
      Please fill out all required fields using the correct format.
    </p>
  </form>
</template>
    
<script>
/* eslint no-console: 0 */

import { required, email } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      username: null,
      email: null
    };
  },
  validations: {
    username: {
      required
    },
    email: {
      required,
      email
    }
  },
  methods: {
    submit() {
      this.$v.$touch()

      // Calling $touch() again changes the $dirty status on all form 
      // validations, causing $error to be true for all $invalid fields.

      if (!this.$v.$invalid)
        console.log('Form Submission:', { username: this.username, email: this.email })
    }
  }
};
</script>