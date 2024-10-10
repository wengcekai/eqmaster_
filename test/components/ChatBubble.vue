<template>
  <view class="bubble-container">
    <view class="wording">{{ wording }}</view>
  </view>
</template>

<script>
export default {
  props: {
    wording: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.bubble-container {
  background-color: #F7E4BF;
  border-radius: 12px;
  padding: 12px;
  max-width: 90%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #000000;
  line-height: 1.5;
}

.wording {
  text-align: left;
}
</style>