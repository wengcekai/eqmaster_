<template>
  <view class="container">
    <canvas canvas-id="sProgress" class="progress-canvas"></canvas>
    <view class="progress-text">{{ progress }}%</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      progress: 0, // 初始进度
      intervalId: null,
      bezierPoints: [], // 存储贝塞尔曲线的采样点
    };
  },
  mounted() {
    this.calculateBezierPoints(); // 计算贝塞尔曲线的采样点
    this.startProgress(); // 开始进度更新
  },
  methods: {
    // 计算贝塞尔曲线的采样点
    calculateBezierPoints() {
      const width = 300;
      const height = 150;

      // 定义贝塞尔曲线的控制点
      const p0 = { x: 20, y: height / 2 };
      const p1 = { x: 100, y: 0 };
      const p2 = { x: 200, y: height };
      const p3 = { x: 280, y: height / 2 };

      const points = [];
      const steps = 100; // 采样点数量

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const point = this.getCubicBezierPoint(t, p0, p1, p2, p3);
        points.push(point);
      }

      this.bezierPoints = points;
    },
    // 获取三次贝塞尔曲线上指定 t 的点
    getCubicBezierPoint(t, p0, p1, p2, p3) {
      const x =
        Math.pow(1 - t, 3) * p0.x +
        3 * Math.pow(1 - t, 2) * t * p1.x +
        3 * (1 - t) * Math.pow(t, 2) * p2.x +
        Math.pow(t, 3) * p3.x;

      const y =
        Math.pow(1 - t, 3) * p0.y +
        3 * Math.pow(1 - t, 2) * t * p1.y +
        3 * (1 - t) * Math.pow(t, 2) * p2.y +
        Math.pow(t, 3) * p3.y;

      return { x, y };
    },
    // 绘制 S 形进度条
    drawSProgress() {
      const ctx = uni.createCanvasContext('sProgress', this);
      const width = 300;
      const height = 150;

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

      // 绘制进度条（绿色）
      const progressSteps = Math.floor((this.progress / 100) * this.bezierPoints.length);

      if (progressSteps > 0) {
        ctx.beginPath();
        ctx.moveTo(this.bezierPoints[0].x, this.bezierPoints[0].y);
        for (let i = 1; i <= progressSteps; i++) {
          ctx.lineTo(this.bezierPoints[i].x, this.bezierPoints[i].y);
        }
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#4caf50';
        ctx.stroke();
      }

      ctx.draw();
    },
    // 开始更新进度
    startProgress() {
      this.intervalId = setInterval(() => {
        if (this.progress >= 100) {
          clearInterval(this.intervalId);
        } else {
          this.progress += 1; // 每次增加1%的进度
          this.drawSProgress(); // 重新绘制进度条
        }
      }, 100); // 每100ms更新一次
    },
  },
  onUnload() {
    clearInterval(this.intervalId);
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f5f5f5;
}

.progress-canvas {
  width: 300px;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.progress-text {
  margin-top: 10px;
  font-size: 18px;
}
</style>
