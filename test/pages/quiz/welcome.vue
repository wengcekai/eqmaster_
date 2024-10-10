<template>
  <view class="container">
    <view class="welcome-box">
      <!-- 只保留按钮 -->
      <button class="button" @click="startQuiz"></button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: ''  // 用于存储从上一页接收的用户名
    };
  },
  methods: {
    startQuiz() {
      // 跳转到问题页面并传递用户名
      uni.navigateTo({
        url: `/pages/quiz/quiz0?username=${this.username}`
      });
    }
  },
  onLoad(options) {
    // 获取URL传递的参数
    if (options.username) {
      this.username = options.username;  // 将传递过来的用户名存储起来
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw; /* 宽度设置为视口宽度 */
  height: 100vh; /* 高度设置为视口高度 */
  overflow: hidden; /* 隐藏超出部分 */
}

.welcome-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* 宽度占满容器 */
  height: 100%; /* 高度占满容器 */
  background-image: url('/static/首页.png'); /* 设置背景图片 */
  background-size: cover; /* 让背景图片覆盖整个容器 */
  background-position: center; /* 让背景图片居中 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
  position: relative; /* 使子元素可以使用绝对定位 */
}

.button {
  width: 165px; /* 调整按钮的宽度 */
  height: 66px; /* 调整按钮的高度 */
  border: none;
  background-image: url('/static/Button.png'); /* 设置按钮背景图像 */
  background-size: contain; /* 使用contain来调整背景图像尺寸 */
  background-position: center; /* 背景图像居中 */
  background-repeat: no-repeat; /* 防止背景图像重复 */
  cursor: pointer; /* 鼠标悬停时显示手型光标 */
  position: absolute; /* 绝对定位 */
  bottom: 20px; /* 距离底部20px */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 修正偏移，使按钮完全居中 */
}
</style>
