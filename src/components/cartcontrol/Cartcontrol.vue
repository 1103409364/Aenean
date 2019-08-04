<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count > 0" @click.stop.prevent="decreaseCart"></div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>

export default {
  name: 'cartcontrol',
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart () {
      // 添加一个不存在的字段,Vue 无法监听这个字段的变化
      if (!this.food.count) {
        this.$set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      // 派发事件,用于小球动画
      this.$emit('cartAdd', event.target)
    },
    decreaseCart () {
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .cartcontrol
    font-size 0
    .cart-decrease, .cart-count, .cart-add
      display inline-block
      padding 6px
      font-size 24px
      color rgb(0, 160, 220)
    .cart-count
      vertical-align top
      width 12px
      padding 6px 0
      line-height 24px
      text-align center
      font-size 10px
      color rgb(157, 153, 159)
    .cart-decrease
      // 动画
      &.move-enter, &.move-leave-to
        opacity: 0
        transform translate3d(24px, 0, 0) rotate(180deg)
      &.move-enter-active, &.move-leave-active
        transition: all .5s ease
</style>
