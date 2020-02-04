<template>
  <button v-bind="$attrs" v-on="$listeners" class="button" :class="buttonClass">
    <slot/> 
  </button>
</template>

<script>
export default { //
  inheritAttrs: false, 
  props: {
    buttonClass: String
  },
  data: () => ({
  })
}
</script>

<style lang="stylus" scoped>
.button
  display inline-flex
  align-items center
  justify-content space-between
  height 52px
  padding 0 40px
  background transparent
  border none
  border-radius 6px
  text-align center
  font-weight 600
  white-space nowrap
  transition all 0.2s linear
  &:hover
    -webkit-transform scale(1.02)
    transform scale(1.02)
    box-shadow 0 7px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
  &:active
    -webkit-transform scale(1)
    transform scale(1)
    box-shadow none
  &:focus
    outline 0
  &.-fill-gradient
    background linear-gradient(to right, #16c0b0, #84cf6a)
    color #ffffff
  &:disabled
    -webkit-transform scale(1)
    transform scale(1)
    box-shadow none
    background #eeeeee
  & + .button
    margin-left 1em
  &.-fill-gray
    background rgba(0, 0, 0, 0.5)
    color #ffffff
  &.-size-small
    height 32px
  &.-icon-right
    text-align left
    padding 0 20px
    & > .icon
      margin-left 10px
  &.-icon-left
    text-align right
    padding 0 20px
    & > .icon
      margin-right 10px
  &.-icon-center
    padding 0 20px
</style>