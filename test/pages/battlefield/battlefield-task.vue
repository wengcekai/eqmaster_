<template>
	<view class="container">
		<view class="overlay"></view>
		<view class="navbar">
			<image @click="goback" class="back-button" src="/static/battlefield/back-iconpng.png"></image>
			<view class="progress-bar">
				<progress-bar :isActive="true"></progress-bar>
				<progress-bar :isActive="true"></progress-bar>
			</view>
		</view>
		<view class="content">
			<view class="task-header">
				<text class="main-title">老板肚子里的蛔虫</text>
				<text class="sub-title">本关任务</text>
			</view>

			<!-- 任务列表 -->
			<view class="task-list">
				<view class="task-item">
					<view class="index-circle">
						<text class="index-word">
							1
						</text>
					</view>
					<text class="task-word">一句话让同事们赞不绝口：用一句话让每位同事心情绪愉悦。</text>
				</view>
				<!-- 				<view class="task-item">
					<view class="index-circle">
						<text class="index-word">
							2
						</text>
					</view>
					<text class="task-word">情绪过山车：让同事B对你不满，随后安抚他</text>
				</view> -->
			</view>
		</view>
		<view class="continue-button-container">
			<button class="continue-btn" @click="navigateToNextPage">我知道了</button>
		</view>
	</view>
</template>

<script>
	import ProgressBar from '/components/ProgressBar.vue'; // 引入组件
	export default {
		components: {
			ProgressBar, // 注册组件
		},
		methods: {
			navigateToNextPage() {
				uni.navigateTo({
					url: '/pages/battlefield/battlefield-loading'
				});
			},
			goback() {
				uni.navigateTo({
					url: '/pages/battlefield/battlefield-intro'
				});
			}
		}
	}
</script>

<style scoped>
	@import "./common.css";

	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.task-word {
		color: #fff;
		width: 100%;
		text-align: start;
	}

	.task-header {
		margin-top: 30rpx;
		text-align: center;
		color: #fff;
	}

	.main-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
	}

	.sub-title {
		font-size: 34px;
		margin-top: 30rpx;
		font-weight: 700;
		color: #fff;
	}

	.task-list {
		width: 100%;
		margin-top: 100rpx;
		display: flex;
		min-height: 40rpx;
		flex-direction: row;
		justify-content: flex-start;
	}

	.task-item {
		display: flex;
		flex-direction: row;
		gap: 12rpx;
		justify-content: flex-start;
		align-items: center;
		font-size: 28rpx;
		margin-bottom: 20rpx;
		width: 100%;
		margin-top: 30rpx;
		margin-left: 50rpx;
	}

	/* 确保内容区域占满屏幕高度 */
	.task-header,
	.task-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.index-circle {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		background-color: rgba(255, 255, 255, 0.3);
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		border: solid;
		border-color: #fff;
		border-width: 1rpx;
	}

	.index-word {
		color: #fff;
		font-size: 25rpx;
	}
</style>