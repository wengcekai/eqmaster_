<template>
  <view class="container-sprogress">
    <canvas :id="canvasId" :canvas-id="canvasId" class="progress-canvas" @tap="handleCanvasTap"></canvas>
  </view>
</template>


<script>
export default {
  props: {
    finishComponents: {
      type: Number,
      default: 2
    },
    totalComponents: {
      type: Number,
      default: 6
    },
    circleRadius: {
      type: Number,
      default: 90
    },
    circleDistance: {
      type: Number,
      default: 130
    },
    verticalOffset: {
      type: Number,
      default: 5
    },
    userId: {
      type: [String, Number],
      required: true
    },
    username: {
      type: String,
      required: true
    },
    homepageData: {
      type: Object,
      default: () => ({})
    },
    starRatings: {
      type: Array,
      default: () => [2, 2, 1, 0, 0]
    },
    levelNames: {
      type: Array,
      default: () => ['老板肚子里的蛔虫', '被老板刁难', '遇到无礼同事', '高级试炼场', '精英赛场']
    }
  },
  data() {
    return {
      canvasId: 'sProgress' + Math.random().toString(36).substr(2, 9),
      bezierPoints: [],
      endPoints: [],
      hexagons: [],
      canvasWidth: 0,
      canvasHeight: 0,
      yOffset: 10, // 新增：Y轴偏移量
    };
  },
  mounted() {
    uni.getSystemInfo({
      success: (res) => {
        this.canvasWidth = res.windowWidth; // 将Canvas宽度设置为窗口宽度
        this.canvasHeight = (this.circleRadius * 4 * (this.totalComponents + 1)) + this.verticalOffset * 2;
        this.calculateBezierPoints();
        this.drawSProgress();
      },
    });
  },
  updated() {
    this.drawSProgress();
  },
  methods: {
    calculateBezierPoints() {
      const width = this.canvasWidth;
      const radius = this.circleRadius;
      const offset = this.verticalOffset;
      const steps = 100;

      this.bezierPoints = [];
      this.endPoints = [];

      // 初始化计算逻辑
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
      const ctx = uni.createCanvasContext(this.canvasId, this);
      const width = this.canvasWidth;
      const height = this.canvasHeight;
      const yOffset = this.yOffset;

      ctx.clearRect(0, 0, width, height);
      ctx.save(); // Save the current state
      // 调整绘制偏移，使图形居中
      ctx.translate(0, 0);

      // 绘制所有路径
      for (let i = 0; i < this.totalComponents; i++) {
        const points = this.bezierPoints[i];
        ctx.beginPath();
        ctx.lineCap = 'round'; // 设置线条端点为圆形

        // 调整起始点和结束点，使其略微缩短，以显示圆角效果
        const startPoint = points[0];
        const endPoint = points[points.length - 1];

        ctx.moveTo(startPoint.x, startPoint.y + yOffset);

        // 使用二次贝塞尔曲线来平滑连接点
        for (let j = 1; j < points.length - 1; j++) {
          const currentPoint = points[j];
          const nextPoint = points[j + 1];
          const midX = (currentPoint.x + nextPoint.x) / 2;
          const midY = (currentPoint.y + nextPoint.y) / 2;
          ctx.quadraticCurveTo(currentPoint.x, currentPoint.y + yOffset, midX, midY + yOffset);
        }

        ctx.lineTo(endPoint.x, endPoint.y + yOffset);

        ctx.lineWidth = 12;
        ctx.strokeStyle = i < this.finishComponents ? '#EDFB8B' : '#3B413B';
        ctx.stroke();

        // 在初始线的右边添加绿色线段
        if (i === 0) {
          const lineStartX = points[0].x - 20; // 文字右侧起始点
          const lineY = points[0].y + yOffset;

          // 绘制 "LEVEL 1" 文字
          ctx.font = 'bold 20px Arial';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText('LEVEL 1', lineStartX - 10, lineY);

          // 绘制绿色线段
          ctx.beginPath();
          ctx.moveTo(lineStartX - 120, lineY);
          ctx.lineTo(lineStartX - 2600, lineY);
          ctx.lineWidth = 12;
          ctx.strokeStyle = '#EDFB8B'; // 绿色
          ctx.stroke();
        }
      }

      // 定义完成和未完成的图片路径数组
      const completedImages = [
        '/static/level1completed.png',
        '/static/level2completed.png',
        '/static/level3completed.png',
        '/static/level4completed.png',
        '/static/level5completed.png'
      ];
      const incompleteImages = [
        '/static/level1incomplete.png',
        '/static/level2incomplete.png',
        '/static/level3incomplete.png',
        '/static/level4incomplete.png',
        '/static/level5incomplete.png'
      ];

      // 绘制所有端点、线段和图片
      for (let i = 0; i < this.totalComponents; i++) {
        const endPoint = this.endPoints[i];
        const isCompleted = i < this.finishComponents;

        // 绘制端点圆圈
        ctx.beginPath();
        ctx.arc(endPoint.x, endPoint.y + yOffset, 12, 0, 2 * Math.PI);
        ctx.fillStyle = isCompleted ? 'rgba(158, 228, 77, 1)' : 'rgba(158, 228, 77, 0.2)';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = isCompleted ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();

        // 绘制短线段
        const lineLength1 = 32;
        ctx.beginPath();
        ctx.moveTo(endPoint.x, endPoint.y + yOffset);
        if (i % 2 === 0) {
          ctx.moveTo(endPoint.x - 0.3*lineLength1, endPoint.y + yOffset);
        } else {
          ctx.moveTo(endPoint.x + 0.3*lineLength1, endPoint.y + yOffset);
        }

        if (i % 2 === 0) {
          ctx.lineTo(endPoint.x - lineLength1, endPoint.y + yOffset);
        } else {
          ctx.lineTo(endPoint.x + lineLength1, endPoint.y + yOffset);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = isCompleted ? '#9EE44D' : 'rgba(221, 221, 221, 0.3)';
        ctx.stroke();

        // 选择适当的图片路径
        const imagePath = isCompleted 
          ? (completedImages[i] || '/static/default_completed.png')
          : (incompleteImages[i] || '/static/default_incomplete.png');

        const imageSize = 160;
        const lineLength = 100;
        const imageX = i % 2 === 0 ? endPoint.x - lineLength - imageSize/2 : endPoint.x + lineLength - imageSize/2;
        const imageY = endPoint.y - imageSize / 2 + yOffset;

        try {
          ctx.drawImage(imagePath, imageX, imageY, imageSize, imageSize);

          // 只在激活（已完成）的关卡上添加红色实体六边形
          if (isCompleted) {
            // 存储六边形的中心点和大小，用于后续的点击检测
            this.hexagons[i] = {
              centerX: imageX + imageSize / 2,
              centerY: imageY + imageSize / 2,
              size: imageSize / 2
            };

            // 绘制红色实体六边形
            // ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // 半透明红色
            // ctx.strokeStyle = 'rgba(255, 0, 0, 1)'; // 实线红色边框
            // ctx.lineWidth = 2;
            // this.drawHexagon(ctx, imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2, Math.PI / 6);
            // ctx.fill(); // 填充六边形
            // ctx.stroke(); // 绘制边框
          }
        } catch (error) {
          console.error(`Error drawing image for level ${i + 1}:`, error);
        }

        // 计算文本容器的宽度和位置
        const textContainerWidth = 120; // 调整此值以适应您的需求
        const textContainerX = i % 2 === 0 
          ? imageX + imageSize / 2 - textContainerWidth - 80 
          : imageX + imageSize / 2 + 80;
        const textContainerY = imageY + imageSize / 2.5;

        // 添加关卡文本背景
        ctx.save(); // 保存当前的绘图状态

        const padding = 10; // 文本周围的内边距
        const cornerRadius = 10; // 圆角半径

        // 计算背景的尺寸
        const textMetrics = ctx.measureText(`关卡${this.numberToChineseCharacter(i + 1)}`);
        const bgWidth = textMetrics.width + padding * 2;
        const bgHeight = 24; // 根据需要调整高度

        // 计算背景的位置
        const bgX = textContainerX + textContainerWidth / 2 - bgWidth / 2;
        const bgY = textContainerY - 15 - bgHeight / 2;

        // 绘制圆角矩形背景
        ctx.beginPath();
        ctx.moveTo(bgX + cornerRadius, bgY);
        ctx.lineTo(bgX + bgWidth - cornerRadius, bgY);
        ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + cornerRadius);
        ctx.lineTo(bgX + bgWidth, bgY + bgHeight - cornerRadius);
        ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - cornerRadius, bgY + bgHeight);
        ctx.lineTo(bgX + cornerRadius, bgY + bgHeight);
        ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - cornerRadius);
        ctx.lineTo(bgX, bgY + cornerRadius);
        ctx.quadraticCurveTo(bgX, bgY, bgX + cornerRadius, bgY);
        ctx.closePath();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // 半透明黑色
        ctx.fill();

        // 添加关卡文本
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; // 确保文本垂直居中
        const levelText = `关卡${this.numberToChineseCharacter(i + 1)}`;
        ctx.fillText(levelText, textContainerX + textContainerWidth / 2, textContainerY - 15);

        ctx.restore(); // 恢复之前保存的绘图状态

        // 添加关卡名称
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'white'; // 或者您想要的其他颜色
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const levelName = this.levelNames[i] || `Level ${i + 1}`;
        ctx.fillText(levelName, textContainerX + textContainerWidth / 2, textContainerY + 15);

        // 添加星级评分（只为已完成的关卡显示）
        if (isCompleted) {
          const starSize = 30;
          const starSpacing = 5;
          const starContainerWidth = (starSize * 3) + (starSpacing * 2);
          const starContainerX = textContainerX + (textContainerWidth - starContainerWidth) / 2;
          const starContainerY = textContainerY + 35; // 调整这个值来控制星星与关卡名称的距离

          for (let j = 0; j < 3; j++) {
            const starX = starContainerX + (j * (starSize + starSpacing));
            const starY = starContainerY;
            const starPath = j < this.starRatings[i] ? '/static/dashboard2/star.png' : '/static/dashboard2/star-end.png';
            ctx.drawImage(starPath, starX, starY, starSize, starSize);
          }
        }
      }

      ctx.restore(); // Restore the original state
      ctx.draw(false, () => {
        console.log('Canvas drawing completed');
      });
    },
    navigateToBattlefieldIntro() {
      const jobId = this.homepageData?.response?.personal_info?.job_id;
      console.log('okok');
      uni.navigateTo({
        url: `/pages/battlefield/battlefield-intro`
      });
    },
    // 新增方法：绘制六边形
    drawHexagon(ctx, centerX, centerY, size, rotationAngle = 0) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = rotationAngle + (i * Math.PI) / 3;
        const x = centerX + size * Math.cos(angle);
        const y = centerY + size * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    },
    handleCanvasTap(event) {
      const { x, y } = event.detail;

      uni.createSelectorQuery()
        .in(this)
        .select('#' + this.canvasId)
        .boundingClientRect((rect) => {
          // 调整点击坐标，考虑Canvas的位置和缩放
          const canvasX = x - rect.left;
          const canvasY = y - rect.top;

          // 考虑绘制时的平移（这里没有移）
          const adjustedX = canvasX; // 如果有ctx.translate，需要减去对应的值
          const adjustedY = canvasY; // 如果有ctx.translate，需要减去对应的值

          for (let i = 0; i < this.hexagons.length; i++) {
            const hexagon = this.hexagons[i];
            if (this.isPointInHexagon(adjustedX, adjustedY, hexagon.centerX, hexagon.centerY, hexagon.size)) {
              this.navigateToBattlefieldIntro();
              break;
            }
          }
        })
        .exec();
    },
    isPointInHexagon(x, y, centerX, centerY, size) {
      // 将坐标转换为相对于六边形中心的坐标
      const dx = x - centerX;
      const dy = y - centerY;
      // 计算六边形的外接圆半径
      const radius = size;
      // 判断点是否在六边形的外接圆内
      if (Math.sqrt(dx * dx + dy * dy) > radius) {
        return false;
      }
      // 进一步判断点是否在六边形内
      const angle = Math.atan2(dy, dx);
      const sector = Math.floor((angle + Math.PI) / (Math.PI / 3));
      const distance = Math.abs(dx * Math.sin(sector * Math.PI / 3) - dy * Math.cos(sector * Math.PI / 3));
      return distance < radius * Math.sqrt(3) / 2;
    },
  }
};
</script>



<style scoped>
.container-sprogress {
  width: 100%;
  overflow-x: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  background-color: #f5f5f5;
  margin-right: 3rpx;
}

.progress-canvas {
  width: 100%; /* 将宽度设置为100% */
  height: 2000rpx;
  margin: 45rpx;
  /* 移除transform属性 */
}
</style>





