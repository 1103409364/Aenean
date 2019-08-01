<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar" alt="avatar">
      </div>

      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>

        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>

        <div v-if="seller.supports" class="supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>

      <div v-if="seller.supports" class="support-content" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>

    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background" :style="styleObj"/>
    <div v-show="detailShow" class="detail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
        </div>
      </div>
      <div class="detail-close">
        <i class="icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import star from '@/components/star/Star'

export default {
  name: 'Header',
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    star
  },
  data () {
    return {
      detailShow: false
    }
  },
  // 监听 props 变化,更新样式
  computed: {
    styleObj () {
      return {
        'background-image': 'url(' + this.seller.avatar + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center center'
      }
    }
  },
  methods: {
    showDetail () {
      this.detailShow = true
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  updated () {
    this.avatar = this.seller.avatar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import '~@/common/styles/mixin.styl'

  .header
    position relative
    overflow hidden
    color #fff
    background-color rgba(7, 17, 27, 0.5)
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      font-size 0
      .avatar
        font-size 14px
        display inline-block
        vertical-align top
        img
          border-radius 2px
      .content
        margin-left 16px
        display inline-block
        .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            vertical-align top
            width 30px
            height 18px
            bg-image('brand')
            background-size 30px 18px
            background-repeat no-repeat
          .name
            margin-left 6px
            font-size 16px
            line-height 18px
        .description
          margin-bottom 10px
          line-height 12px
          font-size 12px
        .supports
          .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            margin-right 4px
            // 背景图片根据后端返回的数据决定
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
               bg-image('special_1')
          .text
            line-height 12px
            font-size 10px
      .support-content
        position absolute
        right 12px
        bottom 18px
        padding 0 8px
        height 24px
        line-height 24px
        border-radius 14px
        background-color rgba(0,0,0,0.2)
        .count
          font-size 10px
          font-weight 400
        .icon-keyboard_arrow_right
          vertical-align top
          line-height 24px
          margin-left 2px
          font-size 10px
    .bulletin-wrapper
      height 28px
      line-height 28px
      padding 0 22px 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      position relative
      background-color rgba(7,17,27,.2)
      .bulletin-title
        display inline-block
        width 22px
        height 12px
        bg-image('bulletin')
        background-size 22px 12px
        background-repeat no-repeat
        vertical-align middle
      .bulletin-text
        // vertical-align middle
        margin 0 4px
        font-size 10px
      .icon-keyboard_arrow_right
        position absolute
        font-size 10px
        right 12px
        top 8px
    .background
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        overflow hidden
        z-index -1
        filter blur(5px)
    .detail
      position fixed
      top 0
      left 0
      z-index 100
      width 100%
      height 100%
      overflow auto
      background: rgba(7, 17, 27, 0.8)
      .detail-wrapper
        width 100%
        min-height 100%
        box-sizing border-box
        .detail-main
          padding-top 64px
          padding-bottom 64px
          .name
            line-height 16px
            text-align center
            font-sizt 16px
            font-weight 700
      .detail-close
        position relative
        width 32px
        height 32px
        margin -64px auto 0 auto
        font-size 32px
        clear both
</style>
