<template>
  <view>
    <view class="rulerContainer">
      <view class="text-top-icon">
        <image class="icon-top-img" src="../../static/icon/jiantou.png" />
      </view>
      <swiper
        v-if="ruleType === 'in'"
        @animationfinish="finishRuler"
        :current="current"
        :display-multiple-items="30"
        :acceleration="true"
      >
        <!-- 留30刻度以便可以左滑到底，1in为16个刻度 -->
        <swiper-item v-for="(item, index) in maxValue * 1.6 + 30" :key="index">
          <view class="swiper-item" v-if="index < maxValue * 1.6 + 1">
            <view
              class="zoro-line"
              :class="'num-line-' + ((index + index * 10) % 16)"
            ></view>
            <view class="text-num-init" v-if="(index / 16) % 1 == 0">
              <view
                class="zoro-line-num"
                :class="index / 16 >= 10 ? 'big-line-num' : ''"
                >{{ index / 16 }}</view
              >
            </view>
          </view>
        </swiper-item>
      </swiper>
      <swiper
        v-if="ruleType === 'cm'"
        @animationfinish="finishRuler"
        :current="current"
        :display-multiple-items="30"
        :acceleration="true"
      >
        <!-- 留30刻度以便可以左滑到底-->
        <swiper-item v-for="(item, index) in maxValue + 30" :key="index">
          <view class="swiper-item" v-if="index < maxValue + 1">
            <view
              class="zoro-line"
              :class="
                index % 10 == 0 || index % 10 == 5 ? 'num-line-6' : 'num-line-3'
              "
            ></view>
            <view class="text-num-init" v-if="(index / 10) % 1 == 0">
              <view
                class="zoro-line-num"
                :class="index / 10 >= 10 ? 'big-line-num' : ''"
                >{{ index / 10 }}</view
              >
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>
<script>
export default {
  name: "SwiperRuler",
  props: {
    // 选中的页码
    current: {
      type: [Number, String],
      default: 1,
    },
    // 尺子大小 10cm 传100,10in 传100
    maxValue: {
      type: Number,
      default: 100,
    },
    // 尺子类型 cm,in
    ruleType: {
      type: String,
      default: "cm",
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    finishRuler(e) {
      this.$emit(
        "finishRuler",
        this.ruleType === "cm"
          ? e.detail.current / 10
          : (1 / 16) * e.detail.current
      );
    },
  },
};
</script>
<style scoped>
/* 在公共样式添加此代码 */
/* .rulerContainer .uni-swiper-slide-frame{
		left:50%;
		width:16upx!important;
	} */
/* 在公共样式添加此代码 */

.rulerContainer {
  text-align: center;
}
.rulerContainer uni-swiper {
  height: 150upx;
}
.rulerContainer .icon-top-img {
  width: 32upx;
  height: 54upx;
}
.swiper-item {
  width: 100%;
  height: 80upx;
  margin: 0;
}
.rulerContainer uni-swiper-item {
  overflow: initial;
}
.rulerContainer .zoro-line {
  position: relative;
  width: 100%;
  text-align: left;
}
.rulerContainer .zoro-line::before {
  display: block;
  content: "";
  height: 43upx;
  position: absolute;
  border-left: 1px solid #b5b5b5;
  top: 0;
  left: 0;
}
.rulerContainer .num-line-3::before,
.rulerContainer .num-line-5::before,
.rulerContainer .num-line-7::before,
.rulerContainer .num-line-9::before,
.rulerContainer .num-line-11::before,
.rulerContainer .num-line-13::before {
  height: 16upx;
}

.rulerContainer .num-line-6::before,
.rulerContainer .num-line-10::before {
  height: 32upx;
  border-width: 2px;
}

.rulerContainer .num-line-1::before,
.rulerContainer .num-line-15::before {
  height: 16upx;
  border-width: 2px;
}
.rulerContainer .num-line-12::before,
.rulerContainer .num-line-4::before {
  height: 38upx;
}

.rulerContainer .num-line-8::before {
  height: 48upx;
  border-width: 2px;
}

.rulerContainer .num-line-2::before,
.rulerContainer .num-line-14::before {
  height: 32upx;
}

.rulerContainer .zoro-line-num {
  top: 50upx;
  width: 100%;
  left: 0;
  text-align: left;
  position: relative;
  top: 70upx;
  left: -4upx;
  color: #b3b3b3;
  font-size: 24upx;
}
.rulerContainer .big-line-num {
  left: -14upx;
}
.rulerContainer .text-num-init {
  text-align: left;
  width: 100%;
  display: block;
  height: 100%;
}
.text-top-icon {
  display: inline-block;
  
}
</style>