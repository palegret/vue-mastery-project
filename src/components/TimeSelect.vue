<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <select :value="value" v-bind="$attrs" @change="onChange">
      <option value="">Select a time</option>
      <optgroup label="Morning Times">
        <option v-for="time in amTimes" :key="`am_${time.value}`" :value="time.value">{{ time.label }}</option>
      </optgroup>
      <optgroup label="Afternoon Times">
        <option v-for="time in pmTimes" :key="`pm_${time.value}`" :value="time.value">{{ time.label }}</option>
      </optgroup>
    </select>
  </div>  
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    label: String,
    value: [String, Number],
    startTime: {
      type: Number,
      required: true
    },
    endTime: {
      type: Number,
      required: true
    },
  },
  computed: {
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
      return this.times.filter(time => time.value >= this.startTime && time.value < 12)
    },
    pmTimes() {
      return this.times.filter(time => time.value > 12 && time.value <= this.endTime)
    }
  },
  methods: {
    onChange(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
