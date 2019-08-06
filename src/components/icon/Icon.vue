<template>
  <span class="icon" :class="classN"></span>
</template>

<script>
// 图片由四种类型,后端用 type 字段表示, 0 1 2 3 4 分别对应不同图片
const CLASS_MAP = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

export default {
  name: 'Icon',
  props: {
    // 将图片类型和图片尺寸传进来
    type: Number,
    size: String
  },
  computed: {
    classN () {
      return CLASS_MAP[this.type] + '_' + this.size
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/common/styles/mixin.styl'
  // 宽高外边距等由父组件设置

  .icon
    display inline-block
    vertical-align top
    width 12px
    height 12px
    // 背景图片根据后端返回的数据决定
    background-size 12px 12px
    background-repeat no-repeat
    &.decrease_1
      bg-image('decrease_1')
    &.discount_1
      bg-image('discount_1')
    &.guarantee_1
      bg-image('guarantee_1')
    &.invoice_1
      bg-image('invoice_1')
    &.special_1
      bg-image('special_1')

    &.decrease_2
      bg-image('decrease_2')
    &.discount_2
      bg-image('discount_2')
    &.guarantee_2
      bg-image('guarantee_2')
    &.invoice_2
      bg-image('invoice_2')
    &.special_2

      bg-image('special_2')
    &.decrease_3
      bg-image('decrease_3')
    &.discount_3
      bg-image('discount_3')
    &.guarantee_3
      bg-image('guarantee_3')
    &.invoice_3
      bg-image('invoice_3')
    &.special_3

      bg-image('special_3')
    &.decrease_4
      bg-image('decrease_4')
    &.discount_4
      bg-image('discount_4')
    &.guarantee_4
      bg-image('guarantee_4')
    &.invoice_4
      bg-image('invoice_4')
    &.special_4
      bg-image('special_4')
</style>
