<template>
  <!-- <div> -->
  <div class="goods">
    <div class="menu-wrapper" ref="menu-wrapper">
      <ul>
        <li
          v-for="(item, index) in goods"
          :key="item.name"
          class="menu-item"
          :class="calCurrentClass(index)"
          @click="selectMenu(index)"
        >
          <span class="text border-1px">
            <icon v-show="item.type > 0" class="icon" size="3" :type="item.type"></icon>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foods-wrapper">
      <ul>
        <li v-for="item in goods" class="food-list" :key="item.name" ref="food-list">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item boder-1px" :key="food.name" @click="getFoodDetail(food)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" :alt="food.name">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @cartAdd="handleDrop"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart
      :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice"
      :select-foods="selectFoods"
      ref="shopcart"
    />
    <food class="foodDetail" ref="foodDetail" :food="selectedFood" @cartAdd="handleDrop"></food>
  </div>
  <!-- </div> -->
</template>

<script>
import BScroll from 'better-scroll'
import Icon from '@/components/icon/Icon'
import Shopcart from '@/components/shopcart/Shopcart'
import Cartcontrol from '@/components/cartcontrol/Cartcontrol'
import Food from '@/components/food/Food'

const STATUS_OK = 'OK'

export default {
  name: 'Goods',
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    Icon,
    Shopcart,
    Cartcontrol,
    Food
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () {
      for (let index = 0; index < this.listHeight.length; index++) {
        let h1 = this.listHeight[index]
        let h2 = this.listHeight[index + 1]
        // h1 是最后一项的时候，h2为 undefined
        if (!h2 || (this.scrollY >= h1 && this.scrollY < h2)) {
          return index
        }
      }
    },
    // 被选食物,有 count 说明被选了,count 有 cartControl 组件添加,得到被选择的 foods 数组传给购物车
    selectFoods () {
      let foods = []
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    // 初始化 better-scroll
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs['menu-wrapper'], {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs['foods-wrapper'], {
        probeType: 3,
        click: true
      })
      this.foodsScroll.on('scroll', (pos) => {
        // 滚动值是负数转为绝对值
        this.scrollY = Math.abs(Math.round(pos.y))
        // 屏幕高度小于 menu 的时候,menu 被遮挡,滚到最后让菜单往下滚一点
        if (this.scrollY > this.listHeight[this.listHeight.length - 2]) {
          this.menuScroll.scrollTo(0, -30)
        } else {
          this.menuScroll.scrollTo(0, 0)
        }
      })
    },
    // 计算列表高度
    _calcHeight () {
      let foodList = this.$refs['food-list']
      let height = 0
      this.listHeight.push(height)
      for (let item of foodList) {
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    // 计算当前是否是 'current'
    calCurrentClass (index) {
      return this.currentIndex === index ? 'current' : ''
    },
    selectMenu (index) {
      let foodList = this.$refs['food-list']
      let el = foodList[index]
      // better-scroll 的api 可以滚动到指定的 dom
      this.foodsScroll.scrollToElement(el, 300)
    },
    handleDrop (target) {
      // nextTick 异步执行，优化性能
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    getFoodDetail (food) {
      this.selectedFood = food
      this.$refs.foodDetail.show()
    }
  },
  created () {
    this.axios.get('/api/goods').then((res) => {
      if (res.statusText === STATUS_OK) {
        const result = res.data
        this.goods = result.data
        // 在 nextTick 之后 DOM 更新，在这之后做 DOM 相关操作
        this.$nextTick()
          .then(() => {
            this._initScroll()
            this._calcHeight()
          })
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
        display table
        height 54px
        width 56px
        padding 0 12px
        line-height 14px
        &.current
          position relative
          z-index 10
          // 盖住 border
          margin-top -1
          background-color #fff
          font-weight 700
          .text
            border-none()
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
            line-height 14px
          .extra
            .count
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
            right 0
            bottom 12px
</style>
