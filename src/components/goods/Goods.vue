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
    <div class="foods-wrapper"></div>
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
</style>
