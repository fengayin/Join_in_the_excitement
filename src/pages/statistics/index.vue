<template>
  <view class="calorieDetail">
    <view class="dateView" @click="changeDate()">
      <view class="dateImgView">
        <image class="dateImg" src="../../static/icon/date.png"></image>
      </view>
      <text class="dateText">{{ checkData | dateFilter }}</text>
    </view>
    <view class="signSelect">
      <uni-data-select
        :clear="false"
        v-model="signSelect"
        :localdata="selectSign"
        @change="changeSign()"
      ></uni-data-select>
    </view>

    <!-- 普通弹窗 -->
    <view class="popup" v-if="popupShow">
      <view class="uni-padding-wrap uni-common-mt">
        <uni-segmented-control
          :current="current"
          :values="items"
          style-type="text"
          active-color="#06a446"
          @clickItem="onClickItem"
        />
      </view>
      <view class="content">
        <view v-if="current === 0"
          ><text class="content-text">选项卡1的内容</text></view
        >
        <view v-if="current === 1"
          ><text class="content-text">选项卡2的内容</text></view
        >
        <view v-if="current === 2"
          ><text class="content-text">选项卡3的内容</text></view
        >
      </view>
    </view>
    <!-- 遮罩层 -->
    <view
      class="popup-mark"
      v-if="isShowpopupMark"
      @click="clickpopupMark"
    ></view>
    <!-- <view class="charts-box">
      <qiun-data-charts type="column" :chartData="chartData" />
    </view> -->
  </view>
</template>

<script>
import {
  countSummaryCalculation,
  optionalSummaryCalculation,
  showCalculation,
} from "../../api/calorie";
export default {
  data() {
    return {
      signSelect: 0,
      selectSign: [
        {
          text: "摄入-消耗",
          value: 0,
        },
        {
          text: "摄入",
          value: 1,
        },
        {
          text: "消耗",
          value: 2,
        },
      ],
      items: ["按年查看", "按月查看", "按日查看"],
      current: 0,
      checkData: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: 0,
        sign: "tb",
      },
      popupShow: false,
      isShowpopupMark: false,
      chartData: {},
    };
  },
  filters: {
    dateFilter(value) {
      let str = "";
      if (value.year) {
        str = str + value.year + "年";
      }
      if (value.month) {
        str = str + value.month + "月";
      }
      if (value.day) {
        str = str + value.day + "日";
      }
      return str;
    },
  },

  onShow() {
    this.getServerData();
  },

  methods: {
    changeDate() {
      this.popupShow = true;
      this.isShowpopupMark = true;
    },
    clickpopupMark() {
      this.popupShow = false;
      this.isShowpopupMark = false;
    },
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
    // 年月日报表
    async countSummaryCalculation() {
      try {
        this.chartData = await countSummaryCalculation(this.checkData);
        console.log(this.chartData);
        this.chartData = JSON.parse(JSON.stringify(this.chartData));
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * 查询某一年的各月销售
     * 查询某一月的各日销售
     * month=0就是查询某一年的个月销售
     * 0<month<13就是查询某一月的销售
     * sign=taken（摄入）、burned（消耗）、tb（摄入-消耗）
     */
    async optionalSummaryCalculation() {
      try {
        this.chartData = await optionalSummaryCalculation(this.checkData);
        console.log(this.chartData);
        this.chartData = JSON.parse(JSON.stringify(this.chartData));
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * 单独查询某一年或者某一月、某一日的数据
     * 如果查询年就year=需要查询的  month=0 day随意
     * 如果查询月就year、month需要查询的  day=0
     * 如果查询某一天就全都需要有值
     * sign=taken（摄入）、burned（消耗）、tb（摄入-消耗）
     */
    async showCalculation() {
      try {
        this.chartData = await showCalculation(this.checkData);
        console.log(this.chartData);
        this.chartData = JSON.parse(JSON.stringify(this.chartData));
      } catch (e) {
        console.log(e);
      }
    },

    getServerData() {
      this.optionalSummaryCalculation();
      this.showCalculation();
    },
    changeSign() {
      console.log(this.signRadio);
    },
  },
};
</script>
<style >
.calorieDetail {
  position: relative;
  width: 100%;
  height: 100%;
}
/* 左边日期选择 */
.dateView {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  display: flex;
  height: 70rpx;
  line-height: 70rpx;
}
.dateImgView {
  width: 70rpx;
  position: relative;
}
.dateImg {
  display: inline-block;
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.dateText {
  flex: 1;
  font-size: 30rpx;
}

/* 下方日期选择 */
.popup {
  /* display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center; */
  width: 100%;
  height: 500rpx;
  background-color: #d1fee3;
  position: fixed;
  bottom: 0;
  border-radius: 10px 10px 0px 0px;
  z-index: 90;
}

/* 右边选择器 */
.signSelect {
  position: absolute;
  width: 220rpx;
  /* padding-left: 10px;
  padding-right: 10px; */
  top: 20rpx;
  right: 20rpx;
}
.charts-box {
  width: 100%;
  height: 300px;
}

/* 遮罩层 */
.popup-mark {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 80;
  background-color: rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease-in 0s;
}
</style>