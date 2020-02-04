<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <select :value="value" v-bind="$attrs" @change="onChange">
      <option v-for="o in options" :value="getValue(o)" :selected="isSelected(o)" :key="getLabel(o)">
        {{ getLabel(o) }}
      </option>
    </select>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    label: String,
    value: [String, Number],
    options: {
      type: Array,
      required: true
    }
  },
  methods: {
    isObject(o) {
      return o ? (typeof o === 'object') : false
    },
    getLabel(o) {
      return (this.isObject(o) ? o.label : o) || '' 
    },
    getValue(o) {
      return (this.isObject(o) ? o.value : o) || '' 
    },
    isSelected(o) {
      return this.getValue(o) === this.value
    },
    onChange(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>