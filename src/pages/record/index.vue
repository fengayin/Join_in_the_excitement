<template>
  <view>
    <view class="container">
      <view class="haw">
        <view @click="addhaw">
          <image src="../../static//icon/recordbg2.png"></image>
          <text class="addHawtext">记指标</text>
          <image class="addHaw" src="../../static/icon/hawbg.png"></image>
        </view>
      </view>
      <view class="motion" @click="addMotion">
        <view class="addmotiontextView">
          <text class="addmotiontext">记运动</text>
        </view>

        <image class="addmotion" src="../../static/icon/motionbg.png"></image>
      </view>
      <view class="food" @click="addFood">
        <view class="addFoodtextView">
          <text class="addFoodtext">记饮食</text>
        </view>

        <image class="addFood" src="../../static/icon/foodbg.png"></image>
      </view>
    </view>
    <!-- 遮罩层 -->
    <view class="addNewRecord" v-if="isNewRecord" @click="NewRecord">
      <view class="addNewRecordText">
        <text>新建记录</text>
      </view>
      <image
        class="addNewRecordImg1"
        src="../../static/icon/addRecore.png"
      ></image>
      <image
        class="addNewRecordImg2"
        src="../../static/icon/newRecore.png"
      ></image>
    </view>
  </view>
</template>

<script>
import { createRecord } from "../../api/createRocord";
import { mapState, mapMutations } from "vuex";
export default {
  computed: mapState(["record"]),
  data() {
    return {
      isNewRecord: undefined,
      recordId: undefined,
    };
  },
  onShow() {
    this.getRocord();
  },
  methods: {
    ...mapMutations(["updateRecord"]),
    getRocord() {
      if (this.record.foodRecord == true && this.record.motionRecord == true) {
        this.isNewRecord = true;
        this.updateRecord();
        console.log("11111");
      } else if (
        this.record.foodRecord == false &&
        this.record.motionRecord == false
      ) {
        this.isNewRecord = true;
        console.log("112");
      }
    },
    async createRecord() {
      try {
        let recordData = await createRecord();
        this.recordId = recordData.recordId;
        console.log(this.recordId);
      } catch (e) {
        console.log(e);
      }
    },
    NewRecord() {
      this.isNewRecord = false;
      this.createRecord();
    },
    addhaw() {
      uni.navigateTo({
        url: "../recordHaW/index",
      });
    },
    addFood() {
      uni.navigateTo({
        url: "../recordFood/index?recordId=" + this.recordId,
      });
    },
    addMotion() {
      uni.navigateTo({
        url: "../recordMotion/index?recordId=" + this.recordId,
      });
    },
  },
};
</script>

<style>
.container {
  position: absolute;
  display: grid;
  width: 100%;
  height: 100%;
  grid-auto-columns: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10rpx 10rpx;
  grid-template-areas:
    "haw haw"
    "motion food";
}
.haw {
  justify-self: center;
  align-self: center;
  grid-area: haw;
  width: 70%;
  height: 100%;
  position: relative;
}
.haw .addHawtext {
  font-size: 60rpx;
  font-weight: 500;
  position: absolute;
  left: 25%;
  top: 40%;
}
.haw .addHaw {
  position: absolute;
  width: 150rpx;
  height: 150rpx;
  left: 350rpx;
  top: 265rpx;
}
.motion {
  justify-self: center;
  /* align-self: center; */
  grid-area: motion;
  position: relative;
  width: 70%;
  height: 80%;
  border: 15rpx solid rgb(57, 57, 57);
  border-radius: 5%;
}
.motion .addmotion {
  position: absolute;
  width: 130rpx;
  height: 130rpx;
  left: 10rpx;
  top: 260rpx;
}
.motion .addmotiontextView {
  position: absolute;
  width: 60rpx;
  left: 50%;
  top: 4%;
}
.motion .addmotiontextView .addmotiontext {
  font-size: 60rpx;
  font-weight: 500;
}
.food {
  justify-self: center;
  /* align-self: center; */
  grid-area: food;
  position: relative;
  width: 70%;
  height: 80%;
  border: 15rpx solid rgb(57, 57, 57);
  border-radius: 5%;
}

.food .addFood {
  position: absolute;
  width: 130rpx;
  height: 130rpx;
  left: 95rpx;
  top: 260rpx;
}
.food .addFoodtextView {
  position: absolute;
  width: 60rpx;
  left: 20%;
  top: 4%;
}
.food .addFoodtextView .addFoodtext {
  font-size: 60rpx;
  font-weight: 500;
}
.addNewRecord {
  position: fixed;
  width: 100%;
  height: 50%;
  bottom: 0;
  background-color: #fff;
}

.addNewRecord .addNewRecordText {
  position: absolute;
  width: 600rpx;
  height: 300rpx;
  background-color: #d1fee3;
  font-size: 50rpx;
  font-weight: 500;
  text-align: center;
  line-height: 300rpx;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  border-radius: 10%;
}

.addNewRecord .addNewRecordImg1,
.addNewRecord .addNewRecordImg2 {
  width: 200rpx;
  height: 200rpx;
  position: absolute;
}
.addNewRecord .addNewRecordImg1 {
  top: 10rpx;
  left: 0rpx;
}
.addNewRecord .addNewRecordImg2 {
  right: 10rpx;
  bottom: 40rpx;
}
</style>