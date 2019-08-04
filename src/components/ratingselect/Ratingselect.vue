<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <div class="block all" :class="{'active': allActive}" @click="selectALL">
        {{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </div>
      <div class="block positive" :class="{'active': positiveActive}" @click="selectPOSITIVE">
        {{desc.positive}}
        <span class="count">{{positiveRatings.length}}</span>
      </div>
      <div class="block negative" :class="{'active': negativeActive}" @click="selectNEGATIVE">
        {{desc.negative}}
        <span class="count">{{negativeRatings.length}}</span>
      </div>
    </div>
    <div class="switch" :class="{'on': onlyContent}" @click="toggle">
      <i class="icon-check_circle"></i>
      只看有内容评价
    </div>
  </div>
</template>

<script>
// 使用具有语义的常量表示评价类型
const ALL = 2
const POSITIVE = 0
const NEGATIVE = 1

export default {
  name: 'Ratingselect',
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    // 描述文本
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    // 由父组件维护 selectType onlyContent,子组件发布事件通知父组件改变
    // 评价类型
    selectType: {
      type: Number,
      default: ALL
    },
    // 只看有内容评价
    onlyContent: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 通过 ratings 计算
    positiveRatings () {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negativeRatings () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    },
    // 动态添加 'active' class
    positiveActive () {
      return this.selectType === POSITIVE
    },
    negativeActive () {
      return this.selectType === NEGATIVE
    },
    allActive () {
      return this.selectType === ALL
    }
  },
  methods: {
    selectPOSITIVE () {
      // 发布事件,通知父组件 type 改变了
      this.$emit('select', POSITIVE)
    },
    selectNEGATIVE () {
      // 发布事件,通知父组件 type 改变了
      this.$emit('select', NEGATIVE)
    },
    selectALL () {
      // 发布事件,通知父组件 type 改变了
      this.$emit('select', ALL)
    },
    toggle () {
      this.$emit('toggle')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/styles/mixin.styl"

  .ratingselect
    .rating-type
      padding 18px 0
      margin  0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        border-radius 1px
        font-size 12px
        color rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left 2px
          font-size 8px
          line-height 12px
        &.all, &.positive
          background-color rgba(0, 160, 220, 0.2)
          &.active
            background-color rgb(0, 160, 220)
        &.negative
          background-color rgba(77, 85, 93, 0.2)
          &.active
            background-color rgb(77, 85, 93)
    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7, 17, 27, 0.1)
      color rgb(147, 153, 159)
      &.on
        .icon-check_circle
          color: #00c850
    .icon-check_circle
      display inline-block
      vertical-align top
      margin-right 4px
      font-size 24px
    .text
      font-size 12px
</style>
