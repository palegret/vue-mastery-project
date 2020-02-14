<template>
    <div>
      <label v-if="label">{{ label }}</label>
      <input :value="value" v-bind="$attrs" @input="onInput" v-on="listeners" />
    </div>
</template>

<script>
import { FormFieldMixin } from '@/mixins/FormFieldMixin'

export default {
  mixins: [
    FormFieldMixin
  ],
  computed: {

    // =========================================================================
    // Why a `listeners` computed property is needed:
    // =========================================================================
    // 
    // - v-model, used for passing values to this component, is sugar for: 
    //     ...v-bind:value="__property__"
    //     ...v-on:input="(value) => { __property__ = value }"
    // 
    // - This means we ALREADY have an input event listener, since we added 
    //   v-on="$listeners" and thus inherit v-model's input event listener onto 
    //   BaseInput’s <input/> element.
    // 
    // - Since we also define `@input="onInput"`, we now have TWO input event 
    //   listeners, one that triggers the onInput method, and one we inherit 
    //   from the parent scope, hidden under v-model's sugar-coating.
    //  
    // - This presents a conflict, and the SECOND input event listener (from 
    //   v-model) is the one that takes precedence.
    // 
    // - The fix is to encapsulate the listeners in a computed `listeners` 
    //   property. We use the object spread operator to merge the inherited 
    //   $listeners (which INCLUDES the input event listener from v-model) and 
    //   below that a property for OUR input event that triggers onInput.
    // 
    // - There are now two input definitions on this object, but following 
    //   JavaScript object rules, the one that is defined last takes precedence, 
    //   in this case the input event that triggers onInput takes precedence.
    // 
    // =========================================================================

    listeners() {
      return {
        ...this.$listeners,
        input: this.onInput
      }
    }
  },  
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
