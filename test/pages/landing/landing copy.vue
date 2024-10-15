<template>
	<view class="container">
		<view v-if="showSplash" class="splash-screen">
			<image class="splash-image" src="/static/splash.png" mode="aspectFill"></image>
		</view>

		<!-- 添加背景图片 -->
		<image class="background-image" src="/static/landingB.png" mode="widthFix"></image>

		<!-- 开始体验按钮 -->
		<view class="button button1" @click="startQuiz">
			<text class="button-text">开始体验</text>
		</view>

		<text class="login-text">登录已有账号</text>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				showSplash: true, // 控制闪屏显示
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
			}
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
				console.log('隐藏闪屏');
				this.showSplash = false;
			}, 300);
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
		background-color: #ffffff;
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

	.button {
		width: 600rpx;
		height: 80rpx;
		border: none;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		transition: transform 0.2s;
		border-color: #ffffff;
		background-color: #ffffff;
	}

	.button1 {
		background-color: #9EE44D;
		border-radius: 45rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 265rpx;
		transform: translateX(-50%);
	}

	.login-text {
		color: #9EE44D;
		font-size: 32rpx;
		text-decoration: underline;
		position: absolute;
		bottom: 190rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.button-text {
		color: #252529;
		font-size: 32rpx;
		font-weight: bold;
	}
</style>