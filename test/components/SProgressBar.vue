<template>
  <view class="container">
    <canvas canvas-id="sProgress" class="progress-canvas"></canvas>
  </view>
</template>

<script>
export default {
  props: {
    finishComponents: {
      type: Number,
      default: 1
    },
    totalComponents: {
      type: Number,
      default: 3
    },
    circleRadius: {
      type: Number,
      default: 90
    },
    circleDistance: {
      type: Number,
      default: 120
    },
    verticalOffset: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      bezierPoints: [],
      endPoints: [],
      canvasWidth: 0,
      canvasHeight: 0,
      levelNames: ['新手村', '初级训练', '中级挑战', '高级试炼', '精英赛场'],
      starRatings: [3, 2, 1, 0, 0], // 示例评分，您可以根据实际情况修改
      isDrawn: false, // Add this new property
    };
  },
  mounted() {
    uni.getSystemInfo({
      success: (res) => {
        this.canvasWidth = res.windowWidth * 0.9;
        this.canvasHeight = this.canvasWidth * 2;
        this.calculateBezierPoints();
        this.drawSProgress();
      },
    });
  },
  methods: {
    calculateBezierPoints() {
      const width = this.canvasWidth;
      const radius = this.circleRadius;
      const offset = this.verticalOffset;
      const steps = 100;

      this.bezierPoints = [];
      this.endPoints = [];

      // 初始化计算逻辑（与原代码相同）
      const initialPoints = [];
      const initX = width / 2;
      const initY = offset;
      initialPoints.push({ x: initX, y: initY });
      for (let i = 0; i <= steps / 2; i++) {
        const angle = (-Math.PI / 2) + (Math.PI * i) / steps;
        const x = initX + radius * Math.cos(angle) + this.circleDistance / 2;
        const y = radius + radius * Math.sin(angle) + offset;
        initialPoints.push({ x, y });
      }
      this.bezierPoints.push(initialPoints);
      this.endPoints.push(initialPoints[initialPoints.length - 1]);

      for (let component = 0; component < this.totalComponents; component++) {
        const componentPoints = [];
        const baseY = component * 2 * radius;

        let endPoint;

        if (component % 2 === 0) {
          for (let i = steps / 2; i <= steps; i++) {
            const angle = (-Math.PI / 2) + (Math.PI * i) / steps;
            const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
            const y = baseY + radius + radius * Math.sin(angle) + offset;
            componentPoints.push({ x, y });
          }
          for (let i = 0; i <= steps / 2; i++) {
            const angle = Math.PI / 2 + (Math.PI * i) / steps;
            const x = width / 2 + radius * Math.cos(angle) - this.circleDistance / 2;
            const y = baseY + 4 * radius - (radius + radius * Math.sin(angle)) + offset;
            componentPoints.push({ x, y });
          }
          endPoint = componentPoints[componentPoints.length - 1];
        } else {
          for (let i = steps / 2; i <= steps; i++) {
            const angle = Math.PI / 2 + (Math.PI * i) / steps;
            const x = width / 2 + radius * Math.cos(angle) - this.circleDistance / 2;
            const y = baseY + 2 * radius - (radius + radius * Math.sin(angle)) + offset;
            componentPoints.push({ x, y });
          }
          for (let i = 0; i <= steps / 2; i++) {
            const angle = (-Math.PI / 2) + (Math.PI * i) / steps;
            const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
            const y = baseY + 2 * radius + radius + radius * Math.sin(angle) + offset;
            componentPoints.push({ x, y });
          }
          endPoint = componentPoints[componentPoints.length - 1];
        }
        this.bezierPoints.push(componentPoints);
        this.endPoints.push(endPoint);
      }
    },
    numberToChineseCharacter(num) {
      const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
      if (num <= 10) {
        return chineseNumbers[num - 1];
      } else if (num < 20) {
        return '十' + (num % 10 === 0 ? '' : chineseNumbers[num % 10 - 1]);
      } else {
        return chineseNumbers[Math.floor(num / 10) - 1] + '十' + (num % 10 === 0 ? '' : chineseNumbers[num % 10 - 1]);
      }
    },
    drawSProgress() {
      const ctx = uni.createCanvasContext('sProgress', this);
      
      // Clear the canvas before redrawing
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      for (let i = 0; i < this.bezierPoints.length; i++) {
        const points = this.bezierPoints[i];
        ctx.beginPath();
        
        // Add rounded corners to the starting point
        ctx.lineCap = 'round';
        
        ctx.moveTo(points[0].x, points[0].y);
        for (let j = 1; j < points.length; j++) {
          ctx.lineTo(points[j].x, points[j].y);
        }
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#3B413B';
        ctx.stroke();
      }
    
      const completedComponents = Math.min(this.finishComponents + 1, this.bezierPoints.length);
      for (let i = 0; i < completedComponents; i++) {
        const points = this.bezierPoints[i];
        ctx.beginPath();
        
        // Add rounded corners to the starting point
        ctx.lineCap = 'round';
        
        ctx.moveTo(points[0].x, points[0].y);
        for (let j = 1; j < points.length; j++) {
          ctx.lineTo(points[j].x, points[j].y);
        }
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#EDFB8B';
        ctx.stroke();
      }

      for (let i = 0; i < this.endPoints.length; i++) {
        const endPoint = this.endPoints[i];
        
        ctx.beginPath();
        ctx.arc(endPoint.x, endPoint.y, 12, 0, 2 * Math.PI);
        
        if (i < completedComponents) {
          ctx.fillStyle = '#9EE44D';
        } else {
          ctx.fillStyle = '#ddd';
        }
        ctx.fill();

        ctx.lineWidth = 4;
        ctx.strokeStyle = 'white';
        ctx.stroke();

        const lineLength = 100;
		const lineLength1 = 32;
        ctx.beginPath();
        ctx.moveTo(endPoint.x, endPoint.y);
        if (i % 2 === 0) {
          ctx.lineTo(endPoint.x - lineLength1, endPoint.y);
        } else {
          ctx.lineTo(endPoint.x + lineLength1, endPoint.y);
        }
        ctx.lineWidth1 = 2;
        
        if (i <= this.finishComponents) {
          ctx.strokeStyle = '#9EE44D';
        } else {
          ctx.strokeStyle = 'rgba(221, 221, 221, 0.3)';
        }
        ctx.stroke();

        // Add image at the end of each line
        const imageSize = 160; // Adjust this value as needed
        const imageX = i % 2 === 0 ? endPoint.x - lineLength - imageSize/2 : endPoint.x + lineLength - imageSize/2;
        const imageY = endPoint.y - imageSize / 2;
        
        // You need to prepare different images for completed and uncompleted states
        const imagePath = i <= this.finishComponents ? '/static/333.png' : '/static/444.png';
        
        ctx.drawImage(imagePath, imageX, imageY, imageSize, imageSize);

        // Adjust container position to be closer to the image
        const containerWidth = 300; // Adjust as needed
        const containerHeight = 150; // Adjust as needed
        const containerX = i % 2 === 0 ? imageX - containerWidth + 80 : imageX + imageSize - 80;
        const containerY = endPoint.y - containerHeight / 2;

        // Draw container (optional, for debugging)
        // ctx.strokeStyle = '#000';
        // ctx.strokeRect(containerX, containerY, containerWidth, containerHeight);

        // Add level text with Chinese characters and pill-shaped background
        // 修改字体大小和相关参数
        ctx.font = '12px Arial'; // 将字体大小改为12px
        ctx.fillStyle = i <= this.finishComponents ? '#9EE44D' : '#ddd';
        ctx.textAlign = 'center';
        const textX = containerX + containerWidth / 2;
        const textY = containerY + 20; // 调整文本Y坐标，使其在更小的pill中居中

        const levelText = `关卡${this.numberToChineseCharacter(i + 1)}`;

        // 调整pill尺寸
        const textMetrics = ctx.measureText(levelText);
        const textWidth = textMetrics.width;
        const pillWidth = textWidth + 16; // 减小padding
        const pillHeight = 20; // 减小pill高度
        const pillX = textX - pillWidth / 2;
        const pillY = textY - 14; // 调整pill的Y坐标

        // 绘制更小的pill形状
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(pillX + pillHeight / 2, pillY);
        ctx.lineTo(pillX + pillWidth - pillHeight / 2, pillY);
        ctx.arc(pillX + pillWidth - pillHeight / 2, pillY + pillHeight / 2, pillHeight / 2, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(pillX + pillHeight / 2, pillY + pillHeight);
        ctx.arc(pillX + pillHeight / 2, pillY + pillHeight / 2, pillHeight / 2, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fill();

        // Add level text
        ctx.fillStyle = i <= this.finishComponents ? 'white' : '#ddd';
        ctx.fillText(levelText, textX, textY);

        // Add level name
        ctx.font = 'bolder 15px Arial';
        const levelName = this.levelNames[i] || `Level ${i + 1}`;
        ctx.fillText(levelName, textX, textY + 40);

        // Add star ratings
        const starSize = 50;
        const starSpacing = -20;
        const starContainerWidth = (starSize * 3) + (starSpacing * 2);
        const starContainerX = containerX + (containerWidth - starContainerWidth) / 2;
        const starContainerY = textY + 50;

        // Draw stars
        for (let j = 0; j < 3; j++) {
          const starX = starContainerX + (j * (starSize + starSpacing));
          const starY = starContainerY;
          const starPath = j < this.starRatings[i] ? '/static/dashboard2/star.jpg' : '/static/dashboard2/star.jpg';
          ctx.drawImage(starPath, starX, starY, starSize, starSize);
        }
      }
    
      ctx.draw();
    }
  },

  watch: {
    // Add watchers for props that should trigger a redraw
    finishComponents() {
      this.$nextTick(() => this.drawSProgress());
    },
    totalComponents() {
      this.$nextTick(() => this.drawSProgress());
    },
    // Add more watchers for other props if needed
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  /* height: 100vh; */
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  background-color: #f5f5f5;
}

.progress-canvas {
  width: 90%;
  height: 1200rpx;
  margin: 5rpx;
  
}
</style>
