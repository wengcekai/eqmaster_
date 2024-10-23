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
				<text class="main-title">A Cross-Department Meeting</text>
				<text class="sub-title">Tasks</text>
			</view>

			<!-- 任务列表 -->
			<view class="task-list">
				<view class="task-item">
					<view class="index-circle">
						<text class="index-word">
							1
						</text>
					</view>
					<text class="task-word">Cheer up Sam while avoiding further infuriating Jason.</text>
					<!-- <text class="task-word">得到领导的夸赞× 2</text> -->
				</view>
				<view class="task-item">
					<view class="index-circle">
						<text class="index-word">
							2
						</text>
					</view>
					<text class="task-word">Facilitate team input and ensure at least one colleague supports your approach.</text>
				</view>
			</view>
		</view>
		<view class="continue-button-container">
			<button class="continue-btn" @click="navigateToNextPage">Got it</button>
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
		text-align: center;
	}

	.task-word {
		color: #fff;
		font-size: 34rpx;
		font-weight: 350;
		line-height: 51rpx;
		width: 80%;
		text-align: start;
		margin-left: 24rpx;
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
		margin-top: 64rpx;
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
		margin-left: 48rpx;
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
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		background-color: #90E0E7;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.index-word {
		color: #000;
		font-size: 40rpx;
	}
</style>