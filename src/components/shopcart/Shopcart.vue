<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
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
          <div class="pay" :class="enough" @click.stop.prevent="pay">
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
      <transition name="fold">
        <div class="shopcart-list" v-show="cartDetailShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="list-content">
            <ul>
              <li class="food" v-for="food in selectFoods" :key="food.name">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>
                    ￥{{food.price*food.count}}
                  </span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="cartDetailShow" @click="hideCartList"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Cartcontrol from '@/components/cartcontrol/Cartcontrol'
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
  components: {
    Cartcontrol
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
      dropBalls: [],
      listShow: false
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
    },
    // 当购物车数量大于 0 且被点击的时候显示
    cartDetailShow () {
      if (this.totalCount > 0 && this.listShow) {
        return true
      } else {
        return false
      }
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
    },
    // 切换购物车详情页的显示和隐藏
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.listShow = !this.listShow
      // dom 更新完成之后初始化 better-scroll
      this.$nextTick(() => {
        // 判断是否存在 scroll 实例
        if (!this.scroll) {
          let el = this.$refs['list-content']
          this.scroll = new BScroll(el, {
            click: true
          })
        } else {
          // 如果存在调用 refresh 重新计算高度差
          this.scroll.refresh()
        }
      })
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
      this.listShow = false
    },
    hideCartList () {
      this.listShow = false
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付${this.totalPrice}`)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/common/styles/mixin.styl'
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 99
    width 100%
    height 48px
    transition all .4s ease

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
    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      transform translate3d(0, -100%, 0)
      &.fold-enter, &.fold-leave-to
        transform translate3d(0, 0, 0)
      &.fold-enter-active, &.fold-leave-active
        transition all .4s ease
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background-color #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background-color #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    background-color rgba(7, 17, 27, 0.6)
    &.fade-enter,&.fade-leave-to
      opacity 0
    &.fade-enter-active,&.fade-leave-active
      transition all .4s ease
</style>
