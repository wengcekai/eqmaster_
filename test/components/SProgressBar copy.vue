<template>
  <view class="container">
    <canvas canvas-id="sProgress" class="progress-canvas"></canvas>
    <!-- Removed progress text display -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      // Removed progress variable
      bezierPoints: [], // 存储贝塞尔曲线的采样点
      canvasWidth: 0, // 动态获取画布宽度
      canvasHeight: 0, // 动态获取画布高度
      circleRadius: 90, // 调整后的圆的半径
      circleDistance: 100, // 控制两个半圆之间的横向距离
      verticalOffset: 50 // 新增的垂直偏移量
    };
  },
  mounted() {
    uni.getSystemInfo({
      success: (res) => {
        this.canvasWidth = res.windowWidth * 0.8; // 动态设置画布宽度为窗口宽度的80%
        this.canvasHeight = this.canvasWidth * 2; // 动态设置高度为宽度的两倍
        this.calculateBezierPoints(); // 计算贝塞尔曲线的采样点
        this.drawSProgress(); // 直接绘制进度条
      },
    });
  },
  methods: {
    calculateBezierPoints() {
      const width = this.canvasWidth;
      const height = this.canvasHeight;
      const radius = this.circleRadius;
      const offset = this.verticalOffset;
      const steps = 100;
      const points = [];

      const rounds = 3; // 当前的轮数，可以根据需要增加

      // 起始点
      points.push({ x: width / 2, y: offset });

      for (let round = 0; round < rounds; round++) {
        const baseY = round * 2 * radius;
        const isEvenRound = round % 2 === 0;

        if (isEvenRound) {
          // 右半圆
          for (let i = 0; i <= steps; i++) {
            const angle = (-Math.PI / 2) + (Math.PI * i) / steps;
            const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
            const y = baseY + radius + radius * Math.sin(angle) + offset;
            points.push({ x, y });
          }
        } else {
          // 左半圆
          for (let i = 0; i <= steps; i++) {
            const angle = Math.PI / 2 + (Math.PI * i) / steps;
            const x = width / 2 + radius * Math.cos(angle) - this.circleDistance / 2;
            const y = baseY + radius - radius * Math.sin(angle) + offset;
            points.push({ x, y });
          }
        }

        // 连接点（除了最后一轮）
        if (round < rounds - 1) {
          points.push({ x: width / 2, y: baseY + 2 * radius + offset });
        }
      }

      // 最后一个点
      points.push({ x: width / 2, y: rounds * 2 * radius + offset });

      this.bezierPoints = points;
    },
    drawSProgress() {
      const ctx = uni.createCanvasContext('sProgress', this);
      const width = this.canvasWidth;
      const height = this.canvasHeight;

      // 清空画布
      ctx.clearRect(0, 0, width, height);

      // 绘制 S 形路径的背景（灰色）
      ctx.beginPath();
      ctx.moveTo(this.bezierPoints[0].x, this.bezierPoints[0].y);
      for (let i = 1; i < this.bezierPoints.length; i++) {
        ctx.lineTo(this.bezierPoints[i].x, this.bezierPoints[i].y);
      }
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ddd';
      ctx.stroke();

      ctx.draw();
    },
    // Removed calculateProgressSteps method
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  flex-direction: column;
  background-color: #f5f5f5;
}

.progress-canvas {
  width: 600rpx; /* Adjust canvas size */
  height: 1200rpx;
  margin: 20rpx; /* Add margin to control spacing */
}

.progress-text {
  /* Removed styling for progress text */
}
</style>