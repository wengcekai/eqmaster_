<template>
  <view class="quiz-container">
    <view class="header">
      <text class="title">Hi, {{ username }}</text>
      <view class="icon"><image src="/static/phone_icon.png" /></view>
    </view>

    <!-- 问题展示 -->
    <view class="question-container">
      <text class="question-text">你的问题内容在这里？</text>
    </view>

    <!-- 选项展示 -->
    <view class="options-container">
      <radio-group>
        <label v-for="(option, index) in options" :key="index" class="option-label">
          <radio :value="option.value" />
          <text>{{ option.text }}</text>
        </label>
      </radio-group>
    </view>

    <!-- 分页导航 -->
    <view class="pagination-container">
      <button class="nav-button" @click="prevQuestion">last</button>
      <text class="page-indicator">{{ currentQuestionIndex + 1 }}/8</text>
      <button class="nav-button" @click="nextQuestion">NEXT</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentQuestionIndex: 0,
      username: '',  // 用于存储从URL参数中获取的用户名
      options: [
        { text: '选项1', value: 'A' },
        { text: '选项2', value: 'B' },
        { text: '选项3', value: 'C' }
      ]
    };
  },
  methods: {
    async fetchUsername(username) {
      try {
        const response = await fetch(`http://localhost:8000/get-username?username=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        this.username = data.username;  // 假设API返回的JSON中有一个'username'字段
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < 7) {
        this.currentQuestionIndex++;
      }
    }
  },
  onLoad(options) {
    // 获取URL传递的参数
    if (options.username) {
      this.username = options.username;
      this.fetchUsername(this.username); // 在组件创建时调用
    }
  }
};
</script>

<style scoped>
.quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  padding: 20px;
  background-color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.icon image {
  width: 40px;
  height: 40px;
}

.question-container {
  margin: 20px 0;
  text-align: center;
}

.question-text {
  font-size: 18px;
  color: #333;
}

.options-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
}

.option-label {
  margin: 10px 0;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav-button {
  padding: 10px 20px;
  background-color: #8e7cc3;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.nav-button:hover {
  background-color: #7a5cb3;
}

.page-indicator {
  font-size: 16px;
}
</style>
