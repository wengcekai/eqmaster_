<template>
  <view class="gem-container">
    <image class="gem-icon" src="/static/battlefield/diamond.png" mode="aspectFit"></image>
    <text class="gem-count">{{ gemCount }}</text>
  </view>
</template>

<script>
export default {
  props: {
    gemCount: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.gem-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 250rpx;
  background-color: rgba(16, 16, 16, 0.4); /* 半透明背景 */
  border-radius: 50rpx; /* 圆角背景 */
  padding: 10px 20px; /* 内边距 */
}

.gem-icon {
  width: 28px;
  height: 28px;
  margin-right: 10px; /* 图标与数字之间的间距 */
}

.gem-count {
  color: #ffcc66; /* 数	字颜色 */
  font-size: 24px; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
}
</style>