export const FormFieldMixin = {
  
  // ===========================================================================
  // Use of inheritAttrs
  // ===========================================================================
  // 
  // Use inheritAttrs so that attributes that are passed in don't automatically 
  // go on the root element (<div>), but whichever element has the 
  // `v-bind="$attrs"` attribute on it.
  // 
  // However:
  // "...inheritAttrs: false...DOES NOT affect style and class bindings."
  // 
  // See: https://vuejs.org/v2/guide/components-props.html
  // 
  // ===========================================================================

  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    },
    value: [String, Number]
  },
  methods: {
    onChange(event) {
      this.$emit('input', event.target.value)
    }
  }
}