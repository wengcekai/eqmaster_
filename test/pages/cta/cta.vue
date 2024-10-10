<template>
  <view class="loading-container">
    <text class="loading-text">接下来，</text>
    <text class="loading-text">一起来看看你的职场人格类型吧！</text>
    <view class="avatar-container">
      <image class="avatar" src="/static/monkey-avatar.png" mode="aspectFit"></image>
    </view>
    <view class="progress-container">
      <view class="progress-bar" :style="{ width: `${progress}%` }"></view>
    </view>
    <text class="progress-text">{{ progress }}%</text>
    <text class="status-text">你的职场动物人格报告合成中</text>
  </view>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.loading-container {
  background-color: #1C1C1E;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40rpx;
}

.loading-text {
  color: #FFFFFF;
  font-size: 36rpx;
  margin-bottom: 20rpx;
}

.avatar-container {
  width: 200rpx;
  height: 200rpx;
  background-color: #8E44AD;
  border-radius: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 60rpx 0;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
}

.progress-container {
  width: 80%;
  height: 10rpx;
  background-color: #3A3A3C;
  border-radius: 5rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.progress-bar {
  width: 20%;
  height: 20rpx;
  top:200px;
  background-color: #3d3d3d; /* 背景颜色 */
  border-radius: 15rpx;
  margin: 20rpx 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #9EE44D; /* 进度条颜色 */
  border-radius: 15rpx;
}

.status-text {
	top:190px;
  font-size: 40rpx;
  color: #9EE44D;
  margin-top: 20rpx;
}

</style>