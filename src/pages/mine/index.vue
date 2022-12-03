<template>
  <view>
    <view class="head">
      <!-- <view class="sculpture">
        <button
          class="circle"
          open-type="chooseAvatar"
          bind:chooseavatar="onChooseAvatar"
        >
          <image :src="userList.userPicSrc" />
        </button>
      </view> -->
      <!-- <view class="sculpture">
        <image class="circle" :src="userList.userPicSrc" />
      </view>
      <view class="userName" @click="loginBtn">
        <input type="nickname" v-model="userList.username" class="weui-input" />
      </view>
    </view> -->
      <view class="sculpture">
        <image class="circle" :src="uerInfo.userPicSrc" />
      </view>
      <view class="userName" @click="loginBtn">
        {{ uerInfo.username }}
      </view>
    </view>

    <view class="main">
      <uni-card class="uniCard" @click="toRemindHandle">
        <view class="cardView">
          <image src="../../static/icon/remind.png"></image>
          <view class="cardViewText">
            <text> 自定义提醒 </text>
          </view>
        </view>
      </uni-card>
      <uni-card class="uniCard">
        <view class="cardView">
          <image src="../../static/icon/set_up.png"></image>
          <view class="cardViewText">
            <text> 设置 </text>
          </view>
        </view>
      </uni-card>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: mapState(["uerInfo"]),
  data() {
    return {};
  },
  onLoad() {},

  methods: {
    ...mapMutations(["isLoginBtn"]),

    loginBtn() {
      console.log("点击了昵称");
    },
    //跳转到 自定义 提醒界面
    // 保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面。
    toRemindHandle() {
      uni.navigateTo({
        url: "../mine_remind/index",
        animationType: "fade-in",
        animationDuration: 100,
        success: (res) => {
          console.log(res);
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
  },
};
</script>

<style lang="scss">
.head {
  position: absolute;
  width: 85%;
  height: 20%;
  background-color: rgb(225, 225, 225);
  top: 3%;
  left: 50%;
  transform: translate(-50%, 0);
  overflow: hidden;
  display: flex;
  border-radius: 20px;
}
.head .sculpture {
  width: 160rpx;
  position: relative;
}

.sculpture .circle {
  position: absolute;
  width: 120rpx;
  height: 120rpx;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border-radius: 50%;
  border: 5rpx solid #ffffff;
}
// .sculpture .circle image {
//   position: absolute;
//   width: 120rpx;
//   height: 120rpx;
//   left: 0;
//   right: 0;
//   top: 0;
//   bottom: 0;
//   margin: auto;
//   border-radius: 50%;
//   border: 5rpx solid #ffffff;
// }
.head .userName {
  flex: 1;
  margin: auto 25rpx;
  font-size: 45rpx;
  font-weight: bold;
}
.head .userName .weui-input {
  height: 100%;
}

.main {
  position: absolute;
  width: 85%;
  top: 27%;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 20px;
  border: 1px solid rgb(154, 149, 149);
}

.main .uniCard .cardView {
  display: flex;
}
.main image {
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  left: 10rpx;
  top: 0;
  bottom: 0;
  margin: auto;
}

.main .uniCard .cardViewText {
  flex: 1;
  margin-left: 30rpx;
}
</style>