<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="item in goods" :key="item.name" class="menu-item">
          <span class="text border-1px">
            <icon v-show="item.type > 0" class="icon" size="3" :type="item.type"></icon>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper">
      <ul>
        <li v-for="item in goods" class="food-list" :key="item.name">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item boder-1px" :key="food.name">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" :alt="food.name">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/icon/Icon'
const STATUS_OK = 'OK'

export default {
  name: 'Goods',
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    Icon
  },
  data () {
    return {
      goods: []
    }
  },
  created () {
    this.axios.get('/api/goods').then((res) => {
      if (res.statusText === STATUS_OK) {
        const result = res.data
        this.goods = result.data
      } else {
        console.log(res.statusText)
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/common/styles/mixin.styl'
  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      height 100%
      background-color #f3f5f7
      .menu-item
        display inline-block
        vertical-align top
        display table
        margin 0 auto
        height 54px
        width 56px
        line-height 14px
      .icon
        margin-right 2px
        width 12px
        height 12px
        background-size 12px 12px
      .text
        display table-cell
        width 56px
        vertical-align middle
        border-1px(rgba(7,17,27,0.1))
        font-size 12px
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147,153,159)
        background-color #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        overflow hidden
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            font-weight 400
            color rgb(7, 17, 27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .desc
            margin-bottom 8px
          .extra
            .count
              margin-right 2px
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
</style>
