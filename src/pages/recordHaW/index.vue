<template>
  <view>
    <!-- <swiperModel
      ref="refswiper"
      :max-value="maxValue"
      :ruleType="ruleType"
      :current="current"
      @finishRuler="finishRuler"
    />-->
    <uni-section title="对齐方式" type="line">
      <view class="example">
        <!-- 展示不同的排列方式 -->
        <uni-forms
          ref="baseForm"
          :modelValue="alignmentFormData"
          :label-position="alignment"
        >
          <uni-forms-item label="身高" required>
            <uni-easyinput v-model="haw.height" placeholder="请输入身高" />
          </uni-forms-item>
          <uni-forms-item label="体重" required>
            <uni-easyinput v-model="haw.weight" placeholder="请输入体重" />
          </uni-forms-item>
        </uni-forms>
      </view>
      <button type="primary" @click="submit()">提交</button>
    </uni-section>
  </view>
</template>

<script>
// import swiperModel from "@/components/swiper-ruler/index";
import { addHaw } from "../../api/addHaw";
export default {
  // components: {
  //   swiperModel,
  // },
  data() {
    return {
      // current: 0,
      // maxValue: 150,
      // ruleType: "cm",
      // value: 0,
      haw: {
        height: undefined,
        weight: undefined,
      },
    };
  },
  methods: {
    // finishRuler(e) {
    //   this.value = e;
    //   console.log(this.value);
    // },
    // 添加Haw
    async addHaw() {
      try {
        let hawList = await addHaw(this.haw);
        console.log("haw", hawList);
      } catch (e) {
        console.log(e);
      }
    },
    submit() {
      this.addHaw();
      console.log("haw1", this.haw);
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style>
</style>