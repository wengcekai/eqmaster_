<template>
  <view class="container">
    <!-- 圆形进度条 -->
    <canvas id="progress-bar" class="progress-bar"></canvas>
    
    <!-- 圆形排列的图片 -->
    <view v-for="(image, index) in images" :key="index" 
          :style="{ top: `${getPosition(image.angle, 100).y}rpx`, left: `${getPosition(image.angle, 100).x}rpx` }" 
          class="circle-image">
      <image :src="image.src" mode="aspectFill"></image>
    </view>
    
    <!-- 中心文本 -->
    <view class="center-text">
      <text>{{ percentage }}%</text>
      <text>合成中</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      percentage: 75, // 进度百分比，您可以更改此值来模拟进度
      images: [
        { src: '/static/image1.png', angle: 0 },   // 修改为您自己的图片路径
        { src: '/static/image2.png', angle: 60 },
        { src: '/static/image3.png', angle: 120 },
        { src: '/static/image4.png', angle: 180 },
        { src: '/static/image5.png', angle: 240 },
        { src: '/static/image6.png', angle: 300 },
      ]
    };
  },
  onReady() {
    this.drawProgressBar();
  },
  methods: {
    // 绘制圆形进度条
	drawProgressBar() {
	  const ctx = uni.createCanvasContext('progress-bar', this);
	  const percent = this.percentage;

	  // 绘制背景圆圈
	  ctx.setStrokeStyle('#e5e5e5');
	  ctx.setLineWidth(10);
	  ctx.arc(150, 150, 90, 0, 2 * Math.PI);
	  ctx.stroke();

	  // 绘制进度条圆圈
	  ctx.setStrokeStyle('#4c84ff');
	  ctx.setLineWidth(10);
	  ctx.beginPath();
	  ctx.arc(150, 150, 90, -Math.PI / 2, (percent / 100) * 2 * Math.PI - Math.PI / 2);
	  ctx.stroke();

	  // 设置填充样式
	  const grd = ctx.createLinearGradient(0, 0, 200, 0);
	  grd.addColorStop(0, 'black');
	  grd.addColorStop(1, 'black');
	  ctx.setFillStyle(grd); // 使用渐变填充

	  // 绘制百分比文本
	  ctx.setFontSize(30);
	  ctx.setTextAlign('center');
	  ctx.setTextBaseline('middle');
	  ctx.fillText(`${percent}%`, 150, 150);

	  ctx.draw();
	}
	,
    // 页面跳转方法
    navigateToDashboard() {
      uni.navigateTo({
        url: '/pages/dashboard/dashboard'
      });
    },
    // 计算图片位置
    getPosition(angle, radius) {
      const radians = (angle * Math.PI) / 180;
      const x = 150 + radius * Math.cos(radians); // 150为中心点x坐标
      const y = 150 + radius * Math.sin(radians); // 150为中心点y坐标
      return { x, y };
    }
  }
};
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 500rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-bar {
  position: absolute;
  width: 300rpx;
  height: 300rpx;
}

.circle-image {
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  overflow: hidden;
}

.center-text {
  position: absolute;
  text-align: center;
  font-size: 30rpx;
  color: #333;
}
</style>
