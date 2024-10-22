<template>
	<view class="container">
		<view v-if="showSplash" :class="{'splash-screen': true, 'splash-screen-hidden': splashHidden}">
			<image class="splash-image" src="/static/splashEN.png" mode="aspectFill"></image>
		</view>
		<!-- <view class="splashBackground"></view>
		<view v-if="showSplash" class="splash-screen">

			<view class="slogan">
				Anyone can become EQ Master
			</view>
			<image class="splashImage" src="/static/onboarding/IP.png" mode="widthFix"></image>
		</view> -->

		<!-- 添加背景图片 -->
		<image class="background-image" src="/static/landing B_EN.png" mode="widthFix"></image>

		<!-- 开始体验按钮 -->
		<view class="start-button">
			<view class="quizButton" @click="startQuiz">
				<text class="quizText">Start the experience</text>
			</view>
			<view class="loginButton" @click="login">
				<text class="login-text">Login</text>
			</view>
		</view>

		<!-- <view class="button button2" @click="startDialogue">
			<text class="button-text">开始对话</text>
		</view> -->

		<!-- <text class="login-text">登录已有账号</text> -->
	</view>
</template>


<script>
	export default {
		data() {
			return {
				showSplash: true,
				splashHidden: false, // 控制渐隐
				username: '' // 用于存储从上一页接收的用户名
			};
		},
		methods: {
			startQuiz() {
				// 生成随机用户名
				this.username = 'user_' + Math.floor(Math.random() * 10000); // 生成随机用户名
				// 跳转到问题页面并传递用户名
				uni.navigateTo({
					url: `/pages/landing/experience?username=${this.username}`
				});
			},
			goToLogin() {
				// 跳转到登录页面
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			startDialogue() {
				uni.navigateTo({
					url: '/pages/battlefield/battlefield-loading'
				});
			},
		},
		onLoad(options) {
			// 获取URL传递的参数
			if (options.username) {
				this.username = options.username; // 将传递过来的用户名存储起来
			}
		},
		mounted() { // 使用 mounted 钩子
			console.log('页面已挂载，showSplash:', this.showSplash);
			// 设置闪屏持续时间（例如 3 秒）
			setTimeout(() => {
				console.log('开始渐隐');
				this.splashHidden = true; // 开始渐隐动画

				// 再等待 0.5 秒（与 CSS transition 时间一致）后，彻底移除
				setTimeout(() => {
					console.log('隐藏闪屏');
					this.showSplash = false; // 完全隐藏
				}, 500); // 等同于 CSS 动画的持续时间
			}, 2000); // 闪屏持续时间
		}
	};
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		background-color: #252529;
		width: 100%;
		height: 100vh;
		z-index: -1;
	}

	/* 闪屏样式 */
	.splash-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
		opacity: 1;
		/* 初始完全显示 */
		transition: opacity 2s ease-out;
		/* 渐隐动画，2 秒 */

	}

	.splash-screen-hidden {
		opacity: 0;
		/* 隐藏时的透明度 */
	}

	.splash-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.background-image {
		margin-top: 5vh;
		width: 100%;
		z-index: 5;
	}

	/* .button {
		width: 654rpx;
		height: 80rpx;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		transition: transform 0.2s;
		border-color: #ffffff;
		background-color: #ffffff;
		z-index: 6;
	} */

	.start-button {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 68vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 6;
	}

	.quizButton {
		background-color: #9EE44D;
		width: 654rpx;
		height: 80rpx;
		border-radius: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
	}

	.button2 {
		background-color: #9EE44D;
		border-radius: 45rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 150rpx;
		transform: translateX(-50%);
	}

	.button3 {
		background-color: #fff;
	}

	.login-text {
		color: #9EE44D;
		font-weight: 400;
		font-size: 30rpx;
		line-height: 40rpx;
		font-family: Arial;
	}



	.quizText {
		color: #252529;
		font-size: 30rpx;
		line-height: 40rpx;
		font-weight: 400;
		font-family: Arial;
	}
</style>