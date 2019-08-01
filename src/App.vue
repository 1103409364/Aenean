<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <router-link tag="div" to="/goods" class="tab-item">商品</router-link>
      <router-link tag="div" to="/ratings" class="tab-item">评论</router-link>
      <router-link tag="div" to="/seller" class="tab-item">商家</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from '@/components/header/Header'
// 状态码常量
const STATUS_OK = 'OK'

export default {
  name: 'App',
  data () {
    return {
      seller: {}
    }
  },
  components: {
    'v-header': Header
  },
  created () {
    this.axios.get('/api/seller').then((res) => {
      if (res.statusText === STATUS_OK) {
        const result = res.data
        // console.log(result.data)
        this.seller = result.data
      }
    })
  }
}
</script>

<style lang="stylus">
@import '~@/common/styles/mixin.styl'
#app
  color #2c3e50
  .tab
    display flex
    width 100%
    height 40px
    line-height 40px
    border-1px(rgba(1, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align center
      font-size 14px
      color rgb(77, 85, 93)
      &.active
        color rgb(240, 20, 20)
</style>
