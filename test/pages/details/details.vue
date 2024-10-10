
<view class="progress-bar">
  <view class="progress-track">
    <view class="progress-filled" :style="{ width: progress + '%' }"></view>
    <view class="progress-circle" :style="{ left: progress + '%' }"></view>
  </view>
</view>
<style>
/* Add these styles to your page or component stylesheet */
.scoreallprogress-bar {
  width: 100%;
  height: 20px;
  background-color: #2e2e3e; /* Track background color */
  border-radius: 10px;
  position: relative;
}

.progress-track {
  width: 100%;
  height: 100%;
  position: relative;
}

.progress-filled {
  height: 100%;
  background-color: #a3f280; /* Progress fill color */
  border-radius: 10px 0 0 10px;
  position: absolute;
  top: 0;
  left: 0;
}

.progress-circle {
  width: 30rpx;
  height: 30rpx;
  background-color: #f50000; /* Same color as your progress bar */
  border-radius: 50%;
  position: absolute;
  top: -10rpx; /* Adjust this value to align the circle vertically */
  z-index: 1;
}

</style>
<script>
export default {
  data() {
    return {
      progress: 40, // This represents the current progress in percentage
    };
  },
};
</script>
