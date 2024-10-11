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
      const width = this.canvasWidth; // 使用动态宽度
      const height = this.canvasHeight; // 使用动态高度
      const radius = this.circleRadius; // 使用 circleRadius 变量
      const offset = this.verticalOffset; // 使用 verticalOffset 变量

      const points = [];
      const steps = 100; // 每个半圆的采样点数量
      const loops = 1; // 总循环次数，可以根据需要调整

      // 曲线初始点
      const initX = width / 2;
      const initY = offset;
      points.push({ x: initX, y: initY });

      for (let i = 0; i <= steps / 2; i++) {
          const angle = (-Math.PI / 2) + (Math.PI * i) / steps;
          const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
          const y = radius + radius * Math.sin(angle) + offset;
          points.push({ x, y });
        }

      for (let loop = 0; loop < loops; loop++) {
        const baseY = loop * 4 * radius; // 每个循环的基础Y坐标

        // 组件1
        for (let i = steps / 2; i <= steps; i++) {
          const angle = (-Math.PI / 2) + (Math.PI * i) / steps;
          const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
          const y = baseY + radius + radius * Math.sin(angle) + offset;
          points.push({ x, y });
        }
        for (let i = 0; i <= steps / 2; i++) {
          const angle = Math.PI / 2 + (Math.PI * i) / steps;
          const x = width / 2 + radius * Math.cos(angle) - this.circleDistance / 2;
          const y = baseY + 4 * radius - (radius + radius * Math.sin(angle)) + offset;
          points.push({ x, y });
        }

        // 组件2
        for (let i = steps / 2; i <= steps; i++) {
          const angle = Math.PI / 2 + (Math.PI * i) / steps;
          const x = width / 2 + radius * Math.cos(angle) - this.circleDistance / 2;
          const y = baseY + 4 * radius - (radius + radius * Math.sin(angle)) + offset;
          points.push({ x, y });
        }
        for (let i = 0; i <= steps / 2; i++) {
          const angle = (-Math.PI / 2) + (Math.PI * i) / steps;
          const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
          const y = baseY + 4 * radius + radius + radius * Math.sin(angle) + offset;
          points.push({ x, y });
        }
      }

      // 定义关键节点
      const keyPoints = {
        leftCenter: points[steps + Math.floor(steps / 2) + 1],
        rightCenter: points[Math.floor(steps / 2)],
      };

      this.bezierPoints = points;
      this.keyPoints = keyPoints;
    },
    drawSProgress() {
      const ctx = uni.createCanvasContext('sProgress', this);
      const width = this.canvasWidth; // 使用动态宽度
      const height = this.canvasHeight; // 使用动态高度

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

      // Removed progress drawing logic

      // 绘制关键节点
      this.drawKeyPoints(ctx);

      ctx.draw();
    },
    drawKeyPoints(ctx) {
      const keyPoints = this.keyPoints;
      const radius = 5; // 圆的半径

      // 绘制左半圆中心点
      ctx.beginPath();
      ctx.arc(keyPoints.leftCenter.x, keyPoints.leftCenter.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'grey'; // 保持灰色
      ctx.fill();

      // 绘制右半圆中心点
      ctx.beginPath();
      ctx.arc(keyPoints.rightCenter.x, keyPoints.rightCenter.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'grey'; // 保持灰色
      ctx.fill();
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