<template>
  <view class="u-wrap">
    <!-- 食物列表 -->
    <view class="u-menu-wrap">
      <!-- 左侧导航 -->
      <scroll-view
        scroll-y
        scroll-with-animation
        class="u-tab-view menu-scroll-view"
        :scroll-top="scrollTop"
        :scroll-into-view="itemId"
      >
        <view
          v-for="(item, index) in foodList"
          :key="index"
          class="u-tab-item"
          :class="[current == index ? 'u-tab-item-active' : '']"
          @tap.stop="swichMenu(index)"
        >
          <text class="u-line-1">{{ item.foodCategory }}</text>
        </view>
      </scroll-view>
      <!-- 右侧导航 -->
      <scroll-view
        :scroll-top="scrollRightTop"
        scroll-y
        scroll-with-animation
        class="right-box"
        @scroll="rightScroll"
      >
        <view class="page-view">
          <view
            class="class-item"
            :id="'item' + index"
            v-for="(item, index) in foodList"
            :key="index"
          >
            <view class="item-title">
              <text>{{ item.foodCategory }}</text>
            </view>
            <view class="item-container">
              <view
                class="thumb-box"
                v-for="(item1, index1) in item.list"
                :key="index1"
                ><uni-card
                  class="uniCard item-menu-uniCard"
                  margin="0"
                  spacing="0"
                >
                  <view class="item-menu-name">{{ item1.foodName }} </view>
                  <view class="item-menu-quantity-foodCalorie"
                    >{{ item1.foodCalorie }}卡路里 * {{ item1.quantity }}</view
                  >
                  <uni-icons
                    class="addFoodBtn"
                    type="plus"
                    size="25"
                    @click="addFoodBtn(item1)"
                  ></uni-icons>
                </uni-card>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 下方查看详情 -->
    <view class="details">
      <view class="details-left">
        <view class="details-calorie">{{ totalCal }}卡路里</view>
      </view>
      <view class="details-right">
        <view class="details-text" @click="sureFoodList()">确定</view>
      </view>
    </view>
    <!-- 凸起图标 -->
    <view class="details-img-back" @click="clickDetails">
      <image
        class="details-img"
        src="../../static/icon/food.png"
        mode=""
      ></image>
      <!-- 角标 -->
      <view class="details-num">
        <text class="details-num-text">{{ totalNum }}</text>
      </view>
    </view>
    <!-- 已选食物列表 -->
    <view class="details-list" v-if="isShowList">
      <scroll-view scroll-y="true" style="height: 500rpx">
        <view
          class="details-box"
          v-for="(item, index) in addFoodList"
          :key="index"
        >
          <view class="details-right-text">
            <view class="details-menu-left">
              <view class="details-menu-name">{{ item.foodName }}</view>
              <view class="details-menu-quantity"
                >{{ item.foodCalorie }}卡路里 * {{ item.quantity }}
              </view>
            </view>
            <view class="details-menu-right">
              <view class="details-menu-totalCalorie"
                >{{ item.totalCalorie }}卡路里</view
              >
              <view class="details-num-select">
                <view @click="clickMinus(index)">
                  <image
                    style="width: 48rpx; height: 48rpx"
                    src="../../static/icon/jian.png"
                  ></image>
                </view>
                <view style="margin: 0rpx 15rpx; font-size: 28rpx">
                  {{ item.count }}
                </view>
                <view @click="clickAdd(index)">
                  <image
                    style="width: 48rpx; height: 48rpx"
                    src="../../static/icon/jia.png"
                  ></image>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 遮罩层 -->
    <view
      class="details-mark"
      v-if="isShowDetailsMark"
      @click="clickDetailsMark"
    ></view>
  </view>
</template>

<script>
import { getFoodList } from "../../api/getFoodList";
import { recordAllFood } from "../../api/recordAllFood";
import { mapState, mapMutations } from "vuex";
export default {
  computed: mapState(["record"]),
  data() {
    return {
      foodList: undefined,
      scrollTop: 0, //tab标题的滚动条的位置
      oldScrollTop: 0, //tab标题的滚动条旧位置
      itemId: "", //栏目右边scroll-view用于滚动的id
      scrollRightTop: 0, //右边栏目scroll-view的滚动条高度
      arr: [],
      current: 0, //预设当前值
      menuHeight: 0, //左边菜单的高度
      menuItemHeight: 0, //左边菜单item的高度
      timer: null,
      addFoodMap: new Map(),
      addFoodList: [],
      totalCal: 0,
      totalNum: 0,
      isShowList: false,
      isShowDetailsMark: false,
      recordId: undefined,
    };
  },
  onLoad: function (option) {
    this.recordId = option.recordId;
    this.getFoodList();
  },

  onReady() {
    this.getMenuItemTop();
  },
  methods: {
    ...mapMutations(["updateRecord", "changeRecord"]),
    async getFoodList() {
      try {
        this.foodList = await getFoodList();
      } catch (e) {
        console.log(e);
      }
      this.foodList = this.dealWithData(this.foodList);
    },
    // 数据分类  传进要分类的数据列表
    dealWithData(data) {
      let c = [];
      let d = {};
      let i = 0;
      data.forEach((element) => {
        if (!d[element.foodCategory]) {
          // 按照type分类
          c.push({
            foodCategoryId: i,
            foodCategory: element.foodCategory,
            list: [element],
          });
          i++;
          d[element.foodCategory] = element;
        } else {
          c.forEach((ele) => {
            if (ele.foodCategory == element.foodCategory) {
              ele.list.push(element);
            }
          });
        }
      });
      return c;
    },
    /**
     * 获取一个目标元素的高度
     * @elClass 元素的类名
     * @dataVal 储存高度的对象
     */
    getElRect(elClass, dataVal) {
      new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select("." + elClass)
          .fields(
            {
              size: true,
            },
            (res) => {
              // 如果节点尚未生成，res值为null，循环调用执行
              if (!res) {
                setTimeout(() => {
                  this.getElRect(elClass);
                }, 10);
                return;
              }
              this[dataVal] = res.height;
              resolve();
            }
          )
          .exec();
      });
    },
    /**
     * 获取右边菜单每个item到顶部的距离
     * 储存到 arr 数组里面用于后面滚动判断
     */
    getMenuItemTop() {
      new Promise((resolve) => {
        let selectorQuery = uni.createSelectorQuery();
        selectorQuery
          .selectAll(".class-item")
          .boundingClientRect((rects) => {
            // 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
            if (!rects.length) {
              setTimeout(() => {
                this.getMenuItemTop();
              }, 10);
              return;
            }
            rects.forEach((rect) => {
              // 视情况而定，这里减去rects[0].top，是因为第一项顶部可能不是贴到导航栏(比如有个搜索框的情况)
              // this.arr.push(rect.top - rects[0].top);
              this.arr.push(rect.top);
              resolve();
            });
          })
          .exec();
      });
    },

    // 监听右侧元素滚动时交互的状态
    /**
     * 观测元素相交状态
     * 检测右边scroll-view的id为itemxx的元素与right-box的相交状态
     * 如果跟.right-box底部相交，就动态设置左边栏目的活动状态
     */
    async observer() {
      this.foodList.map((val, index) => {
        let observer = uni.createIntersectionObserver(this);
        observer
          .relativeTo(".right-box", {
            top: 0,
          })
          .observe("#item" + index, (res) => {
            if (res.intersectionRatio > 0) {
              let id = res.id.substring(4);
              this.leftMenuStatus(id);
            }
          });
      });
    },
    /**
     * 设置左边菜单的滚动状态
     * @index 传入的 ID
     */
    async leftMenuStatus(index) {
      this.current = index;
      // 如果为0，意味着尚未初始化
      if (this.menuHeight == 0 || this.menuItemHeight == 0) {
        await this.getElRect("menu-scroll-view", "menuHeight");
        await this.getElRect("u-tab-item", "menuItemHeight");
      }
      // 将菜单活动item垂直居中
      this.scrollTop =
        index * this.menuItemHeight +
        this.menuItemHeight / 2 -
        this.menuHeight / 2;
    },

    // 实现左侧菜单点击联动右侧滚动
    /**
     * 点击左边的栏目切换
     * @index 传入的 ID
     */
    async swichMenu(index) {
      if (this.arr.length == 0) {
        await this.getMenuItemTop();
      }
      if (index == this.current) return;
      this.scrollRightTop = this.oldScrollTop;
      this.$nextTick(function () {
        this.scrollRightTop = this.arr[index];
        this.current = index;
        this.leftMenuStatus(index);
      });
    },
    // 实现右侧菜单滚动联动左侧高亮
    /**
     * 右边菜单滚动
     * 如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
     */
    async rightScroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
      if (this.arr.length == 0) {
        await this.getMenuItemTop();
      }
      if (this.timer) return;
      if (!this.menuHeight) {
        await this.getElRect("menu-scroll-view", "menuHeight");
      }
      setTimeout(() => {
        // 节流
        this.timer = null;
        // scrollHeight为右边菜单垂直中点位置
        // let scrollHeight = e.detail.scrollTop + this.menuHeight / 2;
        // scrollHeight为右边菜单头部位置
        let scrollHeight = e.detail.scrollTop + 20;
        for (let i = 0; i < this.arr.length; i++) {
          let height1 = this.arr[i];
          let height2 = this.arr[i + 1];
          if (!height2 || (scrollHeight >= height1 && scrollHeight < height2)) {
            this.leftMenuStatus(i);
            return;
          }
        }
      }, 10);
    },
    /**
     * 右导航+点击事件
     */
    addFoodBtn(item1) {
      let foodId = item1.foodId;
      let getFood = this.addFoodMap.get(foodId);
      if (getFood) {
        let count = getFood.count;
        item1.count = count + 1;
        this.addFoodMap.set(foodId, item1);
      } else {
        item1.count = 1;
        this.addFoodMap.set(foodId, item1);
      }
      this.traMap();
    },
    traMap() {
      let foodList = [];
      for (let [key, value] of this.addFoodMap) {
        value.totalCalorie = value.foodCalorie * value.count;
        foodList.push(value);
      }
      this.addFoodList = foodList;
      this.allNumCal();
    },
    // 打开关闭详细列表
    clickDetails() {
      this.isShowList = !this.isShowList;
      this.isShowDetailsMark = !this.isShowDetailsMark;
    },
    clickDetailsMark() {
      this.isShowList = !this.isShowList;
      this.isShowDetailsMark = !this.isShowDetailsMark;
    },
    //点击-号
    clickMinus(index) {
      let id = this.addFoodList[index].foodId;
      if (this.addFoodMap.get(id).count > 1) {
        this.addFoodMap.get(id).count--;
      } else {
        this.addFoodMap.delete(id);
      }
      this.traMap();
    },
    // 点击+号
    clickAdd(index) {
      let id = this.addFoodList[index].foodId;
      this.addFoodMap.get(id).count++;

      this.traMap();
    },
    // 计算数量总卡路里
    allNumCal() {
      let num = 0;
      let cal = 0;
      this.addFoodList.forEach((item) => {
        num += item.count;

        item.totalCalorie = item.count * item.foodCalorie;
        cal += item.totalCalorie;
      });
      this.totalNum = num;
      this.totalCal = cal;
      if (this.totalNum == 0) {
        this.clickDetails();
      }
    },
    //确认按钮
    sureFoodList() {
      let sureFoodList = [];
      this.addFoodList.forEach((item) => {
        let sureFood = {
          recordId: this.recordId,
          foodId: item.foodId,
          FoodFrequency: item.count,
        };
        sureFoodList.push(sureFood);
      });
      if (sureFoodList.length > 0) {
        this.recordAllFood(sureFoodList);
        this.addFoodMap = new Map();
        this.traMap();
        if (this.isShowList == true) {
          this.clickDetails();
        }
        this.foodList = null;
        this.changeRecord("food");
        uni.switchTab({
          url: "/pages/record/index",
        });
      }
    },
    //添加记录请求
    async recordAllFood(sureFoodList) {
      try {
        await recordAllFood(sureFoodList);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style>
.u-wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
/* 食物列表 */

.u-menu-wrap {
  flex: 1;
  display: flex;
  overflow: hidden;
  margin-bottom: 100rpx;
}
/* 左边 */
.u-tab-view {
  width: 200rpx;
  height: 100%;
}
.u-tab-item {
  height: 110rpx;
  background-color: #f6f6f6;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #444;
  font-weight: 400;
  line-height: 110rpx;
}
.u-tab-item-active {
  position: relative;
  color: #06a446;
  font-size: 30rpx;
  font-weight: 500;
  background-color: #d6ffe7;
}
.u-tab-item-active ::before {
  content: "";
  position: absolute;
  border-left: 4px solid #06a446;
  height: 52rpx;
  left: 0;
  top: 29rpx;
}

/* 右边 */
.right-box {
  background-color: rgb(250, 250, 250);
}
.page-view {
  padding: 16rpx;
}
.class-item {
  margin-bottom: 30rpx;
  background-color: #fff;
  padding: 16rpx;
  border-radius: 8rpx;
}
.class-item:last-child {
  min-height: 100vh;
}
.item-title {
  font-size: 26rpx;
  color: #0e0e0e;
  font-weight: bold;
}
.item-container {
  display: flex;
  flex-wrap: wrap;
}
.thumb-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-top: 20rpx;
}
.item-menu-uniCard {
  width: 100%;
  position: relative;
}
.addFoodBtn {
  display: inline-block;
  position: absolute;
  right: 2rpx;
  top: 35%;
  transform: translate(-50%, 0);
}
/* 下方  详细列表 */
.details {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100rpx;
  width: 100%;
  position: fixed;
  bottom: 0rpx;
  background-color: #ffffff;
  z-index: 79;
}
.details-img-back {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  width: 100rpx;
  position: fixed;
  bottom: 35rpx;
  left: 30rpx;
  border-radius: 50%;
  background-color: #d1fee3;
  z-index: 100;
}
.details-left {
  flex: 1;
}
.details-calorie {
  padding-left: 160rpx;
  font-size: 34rpx;
  font-weight: 700;
}
.details-img {
  height: 70rpx;
  width: 70rpx;
}

.details-num {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 30rpx;
  width: 30rpx;
  position: fixed;
  bottom: 100rpx;
  left: 110rpx;
  background-color: #ececec;
  border-radius: 50%;
  z-index: 100;
}
.details-num-text {
  font-size: 20rpx;
}

.details-right {
  flex: 1;
}
.details-text {
  height: 100rpx;
  width: 200rpx;
  line-height: 100rpx;
  margin-left: 200rpx;
  text-align: center;
  background-color: #d1fee3;
}
.details-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 500rpx;
  width: 100%;
  position: fixed;
  bottom: 100rpx;
  background-color: #ffffff;
  border-radius: 10px 10px 0px 0px;
  z-index: 90;
}
.details-box {
  width: 100%;
  height: 120rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20rpx 10rpx;
  border-bottom: solid #f4f4f4 1px;
}
.details-right-text {
  display: flex;
  width: 100%;
}
.details-menu-left {
  flex: 1;
}
.details-menu-name {
  font-weight: normal;
  font-style: 28rpx;
  margin-bottom: 10rpx;
}
.details-menu-quantity {
  font-size: 20rpx;
  margin-bottom: 10rpx;
}
.details-menu-right {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.details-menu-totalCalorie {
  font-size: 26rpx;
  font-weight: 600;
}
.details-num-select {
  display: flex;
  flex-direction: row;
  width: 160rpx;
  height: 36rpx;
}
.details-mark {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 77;
  background-color: rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease-in 0s;
}
</style>