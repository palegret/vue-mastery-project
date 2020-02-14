<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <select :value="value" v-bind="$attrs" @change="onChange" v-on="$listeners">
      <option v-for="o in options" :value="getValue(o)" :selected="isSelected(o)" :key="getLabel(o)">
        {{ getLabel(o) }}
      </option>
    </select>
  </div>
</template>
<script>
import { FormFieldMixin } from '@/mixins/FormFieldMixin'

export default {
  mixins: [
    FormFieldMixin
  ],
  props: {
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
    }
  }
}
</script>