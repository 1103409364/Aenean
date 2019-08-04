<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" :alt="food.name">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售 {{food.sellCount}}</span>
            <span class="rating">好评率 {{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @cartAdd="transCartAdd"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="showBuy" @click="addFood">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"/>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split />
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect
            :select-type="selectType"
            :only-content="onlyContent"
            :desc="desc"
            :ratings="food.ratings"
            @select="handleSelect"
            @toggle="handleToggle"
          />
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li class="rating-item border-1px"
                v-for="rating of food.ratings"
                :key="rating.username"
                v-show="needShow(rating.rateType, rating.text)"
              >
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img width="12" height="12" :src="rating.avatar" alt="avatar" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i :class="{'icon-thumb_up': rating.rateType===0,'icon-thumb_down': rating.rateType===1}"></i>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!(food.ratings && food.ratings.length)">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll'
import Cartcontrol from '@/components/cartcontrol/Cartcontrol'
import Split from '@/components/split/Split'
import Ratingselect from '@/components/ratingselect/Ratingselect'
import { formatDate } from '@/common/js/date'

const ALL = 2
// const POSITIVE = 0
// const NEGATIVE = 1

export default {
  name: 'Food',
  components: {
    Cartcontrol,
    Split,
    Ratingselect
  },
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全局',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  computed: {
    showBuy () {
      return !this.food.count || !this.food.count === 0
    }
  },
  methods: {
    show () {
      this.showFlag = true
      // 评价组件被多个商品使用,评价状态每次都要初始化
      this.selectType = ALL
      this.onlyContent = true
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          // refresh 重新计算内容高度
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    addFood () {
      this.$emit('cartAdd', event.target)
      this.$set(this.food, 'count', 1)
    },
    // 把 cartcontrol 派发的事件转给父组件,用来触发动画
    transCartAdd () {
      this.$emit('cartAdd', event.target)
    },
    handleSelect (type) {
      this.selectType = type
      // this.$nextTick(() => {
      //   // refresh 重新计算内容高度
      //   this.scroll.refresh()
      // })
    },
    handleToggle () {
      this.onlyContent = !this.onlyContent
    },
    // 是否显示评论
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~@/common/styles/mixin.styl"

  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background-color #fff
    &.move-enter, &.move-leave-to
      transform translate3d(100%, 0, 0)
      opacity 0
    &.move-leave-active, &.move-enter-active
      transition all 0.3s ease
    .image-header
      position relative
      width 100%
      height 0
      padding-bottom 100%
      img
        position absolute
        left 0
        top 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff
          text-shadow 0 0 4px #333
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rbg(7, 17, 27)
      .detail
        margin-bottom 18px
        height 10px
        line-height 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sell-count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        .now
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        height 24px
        line-height 24px
        border-radius 12px
        padding 0 12px
        box-sizing border-box
        font-size 10px
        color #fff
        background-color rgb(0, 160, 220)
        &.fade-enter, &.fade-leave-to
          opacity 0
        &.fade-leave-active, &.fade-enter-active
          transition all 0.3s ease
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)
      .text
        line-height 24px
        padding 0 8px
        color rgb(77, 85, 93)
        font-size 12px
    .rating
      padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        color rgb(7, 17, 27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display inline-block
              margin-right 6px
              vertical-align top
              font-size 10px
              color rgb(147, 153, 159)
            .avatar
              border-radius 50%
          .time
            margin-bottom  6px
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right 4px
              font-size 12px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
        .no-rating
          padding 16px
          font-size 12px
          color rgb(147, 153, 159)
</style>
