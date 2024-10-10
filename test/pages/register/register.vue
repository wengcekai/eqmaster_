<template>
  <view class="container">
    <view class="register-box">
      <text class="title">注册</text>
      <input class="input" v-model="username" placeholder="请输入账号" />
      <input class="input" v-model="password" placeholder="请输入密码" password />
      <input class="input" v-model="phone" placeholder="请输入手机号" />
      <button class="button" @click="register">确定</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      phone: ''
    };
  },
  methods: {
    register() {
      // 发送注册请求到 FastAPI 后端
      uni.request({
        url: 'http://localhost:8000/register', // 你的 FastAPI 后端的地址
        method: 'POST',
        data: {
          username: this.username,
          password: this.password,
          phone: this.phone
        },
        success: (res) => {
          if (res.statusCode === 200) {
            uni.showToast({
              title: res.data.message,
              icon: 'success'
            });
            // 注册成功后，跳转到问题页面，并将username作为URL参数传递
            uni.navigateTo({
              url: `/pages/quiz/welcome?username=${this.username}`
            });
          } else {
            uni.showToast({
              title: res.data.detail,
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.showToast({
            title: '请求失败',
            icon: 'none'
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.register-box {
  width: 80%;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.input {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  font-size: 16px;
}

.button {
  width: 100%;
  height: 40px;
  background-color: #007aff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
