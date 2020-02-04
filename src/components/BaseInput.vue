<template>
    <div>
      <label v-if="label">{{ label }}</label>
      <input :value="value" v-bind="$attrs" @input="onInput" />
    </div>
</template>

<script>
export default {
  // So attributes that are passed in don't automatically go on the root element 
  // (<div>), but whichever element has the `v-bind="$attrs"` attribute on it.
  // However:
  // "...inheritAttrs: false...DOES NOT affect style and class bindings."
  // See: https://vuejs.org/v2/guide/components-props.html
  inheritAttrs: false, 
  props: {
    label: {
      type: String,
      default: ''
    },
    value: [String, Number]
  },
  data: () => ({
  }),
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
