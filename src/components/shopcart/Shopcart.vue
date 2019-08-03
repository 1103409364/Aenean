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
    <div class="ball-container">
      <div v-for="ball of balls" :key="ball.id">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <!-- 小球有两层 div，外层控制 y 轴，内层控制 x轴 -->
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
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
  data () {
    return {
      balls: [{
        id: 0,
        show: false
      }, {
        id: 1,
        show: false
      }, {
        id: 2,
        show: false
      }, {
        id: 3,
        show: false
      }, {
        id: 4,
        show: false
      }],
      dropBalls: []
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
  },
  methods: {
    // 小球动画逻辑,这里的 el 是添加商品控件的 dom，由父组件通过 ref 直接调用
    drop (el) {
      // 遍历小球数组,找一个不在显示状态的小球,把它的状态改为show:true,v-show 从false 变为 true 时,会触发动画
      for (const ball of this.balls) {
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    // 动画开始前，设置初始位置，此处 el 是小球的 dom
    beforeDrop (el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          // 计算小球动画起始位置
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          // 获取小球内部的 dom，用来控制 x 轴
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    dropping (el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight // 触发重绘
      // 在 dom 更新之后再修改 css
      this.$nextTick()
        .then(() => {
          el.style.webkitTransform = `translate3d(0, 0, 0)`
          el.style.transform = `translate3d(0, 0, 0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(0, 0, 0)`
          inner.style.transform = `translate3d(0, 0, 0)`
          el.addEventListener('transitionend', done)
        })
    },
    // 动画结束重置小球
    afterDrop (el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
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
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 99
        transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height: 16px
          border-radius: 50%
          background-color : rgb(0, 160, 220)
          transition: all .4s linear
</style>
