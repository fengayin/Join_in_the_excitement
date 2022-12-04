<template>
  <view>
    <view class="remindItem">
      <textarea
        placeholder="请输入内容"
        v-model="remindItem.thing1"
        maxlength="-1"
      ></textarea>
    </view>
    <view class="example-body">
      <uni-datetime-picker v-model="single" @change="remindSaveBtn">
        <image class="remindSaveBtn" src="../../static/icon/save.png"></image>
      </uni-datetime-picker>
    </view>
  </view>
</template>

<script>
import { sendMsg } from "../../api/sendMsg";
import {deleteMess} from "../../api/deleteMess"
export default {
  data() {
    return {
      remindItem: {
        time2: undefined,
        thing1: undefined,
      },
      messId: undefined,
      single: "",
    };
  },
  created() {
    // this.getremindList();
  },
  onLoad: function (option) {
    if (Object.keys(option).length > 0) {
      //option为object类型，会序列化上个页面传递的参数
      console.log(option); //打印出上个页面传递的参数。
      this.remindItem.thing1 = option.messValue;
      this.messId = option.messId;
    }
  },
  methods: {
    // getremindList() {
    //   uni.getStorage({
    //     key: "remindList",
    //     success: (res) => {
    //       this.remindList =
    //         Object.keys(res.data).length === 0 ? "" : Object.values(res.data);
    //     },
    //   });
    // },
    // 格式化日对象
    getNowDate(t) {
      var date = new Date(t);
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
   
    // 发送消息
    async sendMsg() {
      try {
        let remindList = await sendMsg(this.remindItem);
      } catch (e) {
        console.log(e);
      }
    },
     // 删除消息
     async deleteMess() {
      try {
        let isdelete = await deleteMess(this.messId);
      } catch (e) {
        console.log(e);
      }
    },
    remindSaveBtn(e) {
      if (this.remindItem.thing1) {
        this.remindItem.time2 = this.getNowDate(e);
        // this.remindList.push(this.remindItem);
        // uni.setStorage({
        //   key: "remindList",
        //   data: this.remindList,
        // });
        if (this.messId) {
          this.deleteMess()
        }
        wx.requestSubscribeMessage({
          tmplIds: ["601S4P4tM65eUp4_Upls5Vb-8yEpdYVCxNRYkSG3xX8"],
          success: (res) => {
            this.sendMsg();
            uni.redirectTo({
              url: "../mine_remind/index",
            });
          },
        });
      }
    },
  },
};
</script>

<style>
.remindItem {
  position: relative;
  height: 300rpx;
  margin: 50rpx;
  border-radius: 5%;
  box-shadow: 1rpx 1rpx 1rpx 1rpx rgba(0, 0, 0, 0.5);
  overflow: scroll;
}
.remindItem textarea {
  position: absolute;
  height: 240rpx;
  margin: 30rpx;
  font-size: 40rpx;
}
.remindSaveBtn {
  width: 100rpx;
  height: 100rpx;
  margin: auto;
}
</style>