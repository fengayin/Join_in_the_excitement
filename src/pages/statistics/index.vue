<template>
  <view class="calorieDetail">
    <!-- 左边日期按钮 -->
    <view class="dateView" @click="changeDate()">
      <view class="dateImgView">
        <image class="dateImg" src="../../static/icon/date.png"></image>
      </view>
      <text class="dateText">{{ checkData | dateFilter }} </text>
    </view>

    <!-- 右边选择器 -->
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
        <!-- 按年查看 -->
        <view class="dateList" v-if="current === 0">
          <view class="flexItem" v-for="k in yearList" @click="sureYear(k)">
            <text>{{ k }}</text>
          </view>
        </view>
        <!-- 按月查看 -->
        <view class="dateList" v-if="current === 1">
          <view class="flexYear">
            <view class="yearImgleft" @click="jianYear()">
              <image
                v-if="jianhaoshow"
                src="../../static/icon/left.png"
              ></image>
              <image
                v-if="!jianhaoshow"
                src="../../static/icon/left_dis.png"
              ></image>
            </view>
            <text>{{ monthListYear }}</text>
            <view class="yearImgright" @click="jiaYear()">
              <image
                v-if="jiahaoshow"
                src="../../static/icon/right.png"
              ></image>
              <image
                v-if="!jiahaoshow"
                src="../../static/icon/right_dis.png"
              ></image>
            </view>
          </view>
          <view class="flexItem" v-for="k in monthList" @click="sureMonth(k)">
            <text>{{ k }}</text>
          </view>
        </view>
        <!-- 按日查看 -->
        <view class="dateList" v-if="current === 2">
          <view>
            <picker-view
              :indicator-style="indicatorStyle"
              :value="dayValue"
              @change="bindChange($event)"
              class="picker-view"
            >
              <picker-view-column>
                <view
                  class="item"
                  v-for="(item, index) in yearList"
                  :key="index"
                  >{{ item }}年</view
                >
              </picker-view-column>
              <picker-view-column>
                <view
                  class="item"
                  v-for="(item, index) in monthList"
                  :key="index"
                  >{{ item }}月</view
                >
              </picker-view-column>
              <picker-view-column>
                <view class="item" v-for="(item, index) in dayList" :key="index"
                  >{{ item }}日</view
                >
              </picker-view-column>
            </picker-view>
          </view>
          <button class="sureDayBtn" @click="sureDay">确定</button>
        </view>
      </view>
    </view>
    <!-- 遮罩层 -->
    <view
      class="popup-mark"
      v-if="isShowpopupMark"
      @click="clickpopupMark"
    ></view>
    <view class="charts-box">
      <qiun-data-charts
        type="column"
        :opts="opts"
        :ontouch="true"
        :chartData="chartData"
      />
    </view>
    <view class="totalText" v-if="totalTextShow">
      <text>累计{{ total }}cal</text>
    </view>
    <view class="totalText" v-if="!totalTextShow">
      <text>今日摄入：{{ taken }}cal</text>
      <text>今日消耗：{{ burned }}cal</text>
      <text>今日总得：{{ tb }}cal</text>
    </view>
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
        day: new Date().getDate(),
        sign: "tb",
      },
      popupShow: false,
      isShowpopupMark: false,
      chartData: undefined,
      yearList: [],
      monthList: [],
      dayList: [],
      monthListYear: undefined,
      jianhaoshow: true,
      jiahaoshow: false,
      dayValue: undefined,
      indicatorStyle: `height: 100rpx;`,
      total: undefined,
      totalTextShow: false,

      taken: undefined,
      burned: undefined,
      tb: undefined,

      amount: undefined,
      opts: {
        enableScroll: true, //开启图表拖拽功能
        xAxis: {
          disableGrid: true,
          scrollShow: true, //新增是否显示滚动条，默认false
          itemCount: 3,
        },
        yAxis: {
          data: [
            {
              min: 0,
            },
          ],
        },
        extra: {
          column: {
            type: "group",
          },
        },
      },
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
    this.getYearList();
    this.getMonthList();
  },
  methods: {
    // 年月日报表
    async countSummaryCalculation() {
      try {
        let data1 = await countSummaryCalculation({
          span: "d",
          sign: this.checkData.sign,
        });
        this.chartData = this.changeChartData(data1);
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
        let data = await optionalSummaryCalculation(this.checkData);
        this.chartData = this.changeChartData(data);
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
    async showCalculation(sign) {
      try {
        let data = {
          year: this.checkData.year,
          month: this.checkData.month,
          day: this.checkData.day,
          sign: sign,
        };
        let data1 = await showCalculation(data);
        this.total = data1.amount;
        if (data.sign == "taken") {
          this.taken = data1.amount;
        } else if (data.sign == "burned") {
          this.burned = data1.amount;
        } else if (data.sign == "tb") {
          this.tb = data1.amount;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 初始值：默认当年某个月
    getServerData() {
      this.countSummaryCalculation();

      this.showCalculation("taken");
      this.showCalculation("burned");
      this.showCalculation("tb");
    },
    // 改变数据格式
    changeChartData(data) {
      let Column = {
        categories: [],
        series: [
          {
            name: "卡路里",
            data: [],
          },
        ],
      };
      this.opts.yAxis.data[0].min = 0;
      for (let i = 0; i < data.length; i++) {
        Column.categories.push(data[i].date);
        this.opts.yAxis.data[0].min =
          data[i].amount < this.opts.yAxis.data[0].min
            ? data[i].amount
            : this.opts.yAxis.data[0].min;
        Column.series[0].data.push(data[i].amount);
      }
      return Column;
    },
    // 获取日、月、年的数组
    getYearList() {
      // 年份合集
      let year = new Date().getFullYear();
      for (let i = year - 11; i <= year; i++) {
        this.yearList.push(i);
      }
    },
    getMonthList() {
      // 月份合集
      for (let i = 1; i <= 12; i++) {
        this.monthList.push(i);
      }
    },
    getDaylist(years, months) {
      let days = new Date(years, months, 0).getDate();
      // 天数合集
      this.dayList = [];
      for (let i = 1; i <= days; i++) {
        this.dayList.push(i);
      }
    },
    // 定义checkData数据
    sureData(year, month, day) {
      this.checkData.year = year;
      this.checkData.month = month;
      this.checkData.day = day;
    },
    //左边时间选择按钮
    changeDate() {
      this.popupShow = true;
      this.isShowpopupMark = true;
    },
    // 遮罩层
    clickpopupMark() {
      this.popupShow = false;
      this.isShowpopupMark = false;
    },
    // 选项卡
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
      if (this.current == 0) {
        this.todayData = null;
      } else if (this.current == 1) {
        this.monthListYear = this.yearList[this.yearList.length - 1];
        this.todayData = null;
      } else if (this.current == 2) {
        this.getDaylist(this.checkData.year, this.checkData.month);
        this.dayValue = [
          this.yearList.length - 1,
          new Date().getMonth(),
          new Date().getDate() - 1,
        ];
        this.sureData(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate()
        );
      }
    },

    // 月份合集里面减号
    jianYear() {
      this.jiahaoshow = true;
      if (this.monthListYear == this.yearList[1]) {
        this.jianhaoshow = false;
        this.monthListYear--;
      } else if (this.monthListYear > this.yearList[1]) {
        this.monthListYear--;
      }
    },
    jiaYear() {
      this.jianhaoshow = true;
      if (this.monthListYear == this.yearList[this.yearList.length - 2]) {
        this.jiahaoshow = false;
        this.monthListYear++;
      } else if (this.monthListYear < this.yearList[this.yearList.length - 2]) {
        this.monthListYear++;
      }
    },
    // 按年查看
    sureYear(k) {
      this.sureData(k, 0, 0);
      this.changeSign();
      this.clickpopupMark();
      this.totalTextShow = true;
    },
    // 按月查看
    sureMonth(k) {
      this.sureData(this.monthListYear, k, 0);
      this.changeSign();
      this.clickpopupMark();
      this.totalTextShow = true;
    },
    //日期改变
    bindChange(e) {
      const val = e.detail.value;
      this.getDaylist(this.yearList[val[0]], this.monthList[val[1]]);
      this.sureData(
        this.yearList[val[0]],
        this.monthList[val[1]],
        this.dayList[val[2]]
      );
    },
    sureDay() {
      this.clickpopupMark();
      this.getServerData();
      this.totalTextShow = false;
    },

    // 右边sign选择器
    changeSign(e) {
      this.signSelect = e;
      if (this.signSelect == 0) {
        this.checkData.sign = "tb";
      } else if (this.signSelect == 1) {
        this.checkData.sign = "taken";
      } else if (this.signSelect == 2) {
        this.checkData.sign = "burned";
      }
      if (this.current !== 2) {
        this.optionalSummaryCalculation();
        this.showCalculation(this.checkData.sign);
      } else {
        this.countSummaryCalculation();
      }
    },
  },
};
</script>
<style >
.calorieDetail {
  position: relative;
  width: 100%;
  height: 1000rpx;
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
  width: 100%;
  height: 600rpx;
  background-color: #d1fee3;
  position: fixed;
  bottom: 0;
  border-radius: 10px 10px 0px 0px;
  z-index: 90;
}
/* 里边日期选择 */
.popup .content {
  position: relative;
  width: 100%;
  height: 90%;
}
.popup .content .dateList {
  position: absolute;
  width: 90%;
  height: 90%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px 10px 10px 10px;
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.flexYear {
  width: 100%;
  height: 50rpx;
  flex-grow: 4;
  text-align: center;
  line-height: 50rpx;
  margin-top: 5rpx;
  font-size: 30rpx;
  font-weight: 600;
  position: relative;
}
.yearImgleft {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  left: 120rpx;
  top: 0;
  bottom: 0;
  margin: auto 0;
}
.yearImgright {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  right: 120rpx;
  top: 0;
  bottom: 0;
  margin: auto 0;
}
.yearImgleft image,
.yearImgright image {
  display: inline-block;
  width: 40rpx;
  height: 40rpx;
}
.flexItem {
  width: 150rpx;
  height: 100rpx;
  background-color: #d1fee3;
  text-align: center;
  line-height: 100rpx;
  margin: 0 6rpx;
}

/* 按天查看 */
.picker-view {
  width: 750rpx;
  height: 600rpx;
}
.item {
  height: 100rpx;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.sureDayBtn {
  position: fixed;
  height: 60rpx;
  width: 100%;
  bottom: 0;
  font-size: 25rpx;
  background-color: #d1fee3;
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

/* 图表 */
.charts-box {
  position: absolute;
  height: 500rpx;
  left: 50%;
  transform: translate(-50%, 25%);
}

.totalText {
  position: absolute;
  width: 400rpx;
  padding: 20rpx;
  top: 70%;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: #d1fee3;
  border-radius: 20rpx;
  text-align: center;
}
.totalText text {
  display: block;
  font-weight: 600;
  font-size: 35rpx;
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