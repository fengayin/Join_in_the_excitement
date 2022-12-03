<template>
  <view>
    <view class="drinkList">
      <uni-card v-for="k in remindList">
        <view class="remindItem">
          <view class="left">
            <!-- <text class="yearTime">{{ k.time | yearFilter }}</text> -->
            <text class="monthTime">{{ k.messTime | monthFilter }}</text>
            <text class="dayTime">{{ k.messTime | dayFilter }}</text>
          </view>
          <view class="center">
            <text class="itemTitle">{{ k.messValue }} </text>
            <text class="itemTime">{{ k.messTime | timeFilter }}</text>
          </view>
          <view class="right">
            <image
              src="../../static/icon/amend.png"
              @click="amendItem(k)"
            ></image>
            <image
              src="../../static/icon/more.png"
              @click="moreBoxShowClick(k)"
            ></image>
            <view class="moreBox" v-show="k.moreBoxShow">
              <view class="example-body">
                <uni-datetime-picker
                  v-model="single"
                  @change="addRemind(k, $event)"
                >
                  <image src="../../static/icon/addremind.png"></image>
                </uni-datetime-picker>
              </view>

              <image
                src="../../static/icon/delete.png"
                @click="removeRemindItem(k)"
              ></image>
            </view>
          </view>
        </view>
      </uni-card>
    </view>
    <view>
      <!-- 提示窗示例 -->
      <!-- <uni-popup ref="alertPopup" type="dialog">
        <uni-popup-dialog
          ref="alertDialog"
          :type="msgType"
          :index="index"
          cancelText="关闭"
          confirmText="同意"
          content="确定删除吗？"
          @confirm="dialogConfirm(index)"
          @close="dialogClose"
        ></uni-popup-dialog>
      </uni-popup> -->
    </view>
    <movable-area class="area">
      <movable-view
        class="moveable_view"
        :x="x"
        :y="y"
        :friction="40"
        direction="all"
        damping="20"
        @change="onChange"
      >
        <view class="addListBtn">
          <uni-icons
            class="icon"
            type="plusempty"
            size="40"
            @click="addListBtn()"
          ></uni-icons
        ></view>
      </movable-view>
    </movable-area>
  </view>
</template>

<script>
import { getMsgList } from "../../api/getMsgList";
import { sendMsg } from "../../api/sendMsg";
import { deleteMess } from "../../api/deleteMess";
export default {
  data() {
    return {
      x: 0,
      y: uni.getSystemInfoSync().screenHeight - 200,
      sysSync: uni.getSystemInfoSync(),
      syswidth: uni.getSystemInfoSync().screenWidth,

      remindList: undefined,
      remindItem: {
        time2: undefined,
        thing1: undefined,
      },
      single: "",
    };
  },
  filters: {
    yearFilter(value) {
      let loc = value.indexOf(" ");
      let str = value.substring(0, loc).split("-");
      return str[0];
    },
    monthFilter(value) {
      let loc = value.indexOf(" ");
      let str = value.substring(0, loc).split("-");
      return str[1];
    },
    dayFilter(value) {
      let loc = value.indexOf(" ");
      let str = value.substring(0, loc).split("-");
      return str[2];
    },
    timeFilter(value) {
      let loc = value.indexOf(" ");
      return value.substring(loc + 1);
    },
  },
  computed: {},
  onReady() {
    this.getremindList();
  },
  onLoad: function (option) {},
  methods: {
    async getMsgList() {
      try {
        this.remindList = await getMsgList();
        console.log("添加消息", this.remindList);
      } catch (e) {
        console.log(e);
      }
    },
    getremindList() {
      // uni.getStorage({
      //   key: "remindList",
      //   success: (res) => {
      //     console.log(Object.values(res.data));
      //     this.remindList =
      //       Object.keys(res.data).length === 0 ? "" : Object.values(res.data);
      //   },
      // });
      this.getMsgList();
    },

    addListBtn() {
      uni.navigateTo({
        url: "../mine_addRemind/index",
        animationType: "fade-in",
        animationDuration: 100,
      });
    },
    // +更换位置
    onChange: function (e) {
      let width = this.sysSync.screenWidth;
      this.x = e.detail.x < width / 2 ? 0 : width;
      this.y = e.detail.y;
    },
    // 修改按钮
    amendItem(k) {
      uni.navigateTo({
        url:
          "../mine_addRemind/index?messValue=" +
          k.messValue +
          "&messId=" +
          k.messId,
        animationType: "fade-in",
        animationDuration: 100,
      });
    },
    // 更多按钮
    moreBoxShowClick(k) {
      if (!k.moreBoxShow) {
        this.$set(k, "moreBoxShow", false);
        k.moreBoxShow = !k.moreBoxShow;
      } else {
        k.moreBoxShow = !k.moreBoxShow;
      }
    },
    // 发送消息
    async sendMsg() {
      try {
        let remindList = await sendMsg(this.remindItem);
        console.log("remindItem", remindList);
      } catch (e) {
        console.log(e);
      }
    },
    // 删除消息
    async deleteMess(messId) {
      try {
        let isdelete = await deleteMess(messId);
        console.log("isdelete", isdelete);
        uni.redirectTo({
          url: "../mine_remind/index",
        });
      } catch (e) {
        console.log(e);
      }
    },
    // 格式化日对象
    getNowDate(t) {
      var date = new Date(t);
      console.log(date);
      var sign2 = ":";
      var year = date.getFullYear(); // 年
      var month = date.getMonth() + 1; // 月
      var day = date.getDate(); // 日
      var hour = date.getHours(); // 时
      var minutes = date.getMinutes(); // 分
      var seconds = date.getSeconds(); //秒
      // 给一位数的数据前面加 “0”
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      }
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
      }
      let time =
        year +
        "年" +
        month +
        "月" +
        day +
        "日 " +
        hour +
        sign2 +
        minutes +
        sign2 +
        seconds;
      return time;
    },
    addRemind(k, e) {
      k.moreBoxShow = false;
      this.remindItem.thing1 = k.messValue;

      this.remindItem.time2 = this.getNowDate(e);

      console.log("remindItem", this.remindItem);
      wx.requestSubscribeMessage({
        tmplIds: ["601S4P4tM65eUp4_Upls5Vb-8yEpdYVCxNRYkSG3xX8"],
        success: (res) => {
          console.log(k);
          this.sendMsg();
          this.deleteMess(k.messId);
        },
      });
    },
    // 删除按钮
    removeRemindItem(k) {
      k.moreBoxShow = false;
      this.deleteMess(k.messId);
    },
    // dialogConfirm(index) {
    //   this.remindList.splice(index, 1);
    //   uni.setStorage({
    //     key: "remindList",
    //     data: this.remindList,
    //   });
    // },
  },
};
</script>

<style>
/* 列表 */
.remindItem {
  height: 100rpx;
  width: 100%;
  margin: 20rpx;
  display: flex;
}
/* 左边 */
.remindItem .left {
  width: 100rpx;
}
.remindItem .left .yearTime {
  display: block;
  font-size: 30rpx;
}
.remindItem .left .monthTime {
  display: block;
  font-size: 40rpx;
}
.remindItem .left .dayTime {
  display: block;
  font-size: 35rpx;
}
/* 中间 */
.remindItem .center {
  flex: 1;
  position: relative;
  padding: 10rpx;
  border-left: 1rpx solid #000;
  border-right: 1rpx solid #000;
}
.remindItem .center .itemTitle {
  display: block;
  font-size: large;
}
.remindItem .center .itemTime {
  display: block;
  position: absolute;
  font-size: small;
  bottom: 5rpx;
}
/* 右边 */
.remindItem .right {
  width: 100rpx;
  padding: 10rpx;
}
.remindItem .right image {
  width: 55rpx;
  height: 55rpx;
}
.remindItem .right .moreBox {
  position: fixed;
  z-index: 999;
  border: 1rpx solid #000;
}
/* +btn */
.area {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  pointer-events: none;
}
.moveable_view {
  width: 120rpx;
  height: 120rpx;
  pointer-events: auto;
}

.addListBtn {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  box-shadow: 1rpx 1rpx 1rpx 1rpx rgba(0, 0, 0, 0.5);
}
</style>