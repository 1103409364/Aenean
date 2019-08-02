<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="hightLight">
            <i class="icon-shopping_cart"></i>
          </div>
          <div v-show="totalCount > 0" class="num">{{totalCount}}</div>
        </div>
        <div class="amount" :class="hightLight">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="enough">
          {{payDesc}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ShopCart',
  props: {
    // 状态通过 selectFoods 计算出来
    selectFoods: {
      type: Array,
      default () {
        return [{price: 9, count: 1}]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach(food => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach(food => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice} 元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    // 高亮 class
    hightLight () {
      return this.totalPrice > 0 ? 'hightLight' : ''
    },
    // 大于起送价的 class
    enough () {
      return this.totalPrice > this.minPrice ? 'enough' : ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 9
    width 100%
    height 48px
    .content
      display flex
      background-color #141d27
      color rgba(255,255,255,0.4)
      .content-left
        flex 1
        .logo-wrapper, .amount, .desc
          display inline-block
          vertical-align top
        .logo-wrapper
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background-color #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background-color #2b343c
            text-align center
            &.hightLight
              background-color rgb(0, 160, 220)
              .icon-shopping_cart
                color #fff
            .icon-shopping_cart
              font-size 24px
              line-height 44px
              color #80858a
          .num
            position absolute
            top 0
            right 0
            min-width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background-color rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0 , 0.4)
        .amount
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255,255,255,0.1)
          font-size 16px
          font-weight 700
          &.hightLight
            color #fff
        .desc
          line-height 24px
          margin: 12px 0
          font-weight 400
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        background-color #2b343c
        .pay
          height 48px
          line-height 48px
          font-size: 12px
          font-weight 700
          text-align center
          &.enough
            background-color #00b43c
            color #fff
</style>
