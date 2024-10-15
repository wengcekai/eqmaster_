<template>
	<view class="container">
		<view class="overlay"></view>
		<view class="navbar">
			<image class="back-button" src="/static/battlefield/back-iconpng.png"></image>
			<view class="progress-bar">
				<progress-bar :isActive="true"></progress-bar>
				<progress-bar :isActive="false"></progress-bar>
			</view>
		</view>

		<!-- Content -->
		<view class="content">
			<text class="title content-item">第一关</text>
			<text class="subtitle content-item">老板肚子里的蛔虫</text>
			<text class="time-info content-item">3-4分钟</text>
			<text class="description content-item">
				在一个精致的会所包厢里，你与一位高层领导和两名同事共进晚餐。看似轻松的聚会，实际上领导在暗中观察你们，准备决定谁将参与重要项目。你必须讨好领导，同时平衡同事关系，因为一个小小的失误可能改变你的未来。
			</text>
		</view>
		<view class="continue-button-container">
			<button class="continue-btn" @click="navigateToNextPage">继续</button>
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
					url: '/pages/battlefield/battlefield-task' // Replace this with the actual path to your next page
				});
			}
		}
	}
</script>

<style scoped>
	@import "./common.css";

	.navbar {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 20rpx;
		position: relative;
		z-index: 3;
		margin-top: 5vh;
		margin-left: 20rpx;
		/* 确保导航栏在叠加层之上 */
	}

	.back-button {
		width: 24px;
		height: 24px;
	}

	.progress-bar {
		flex: 1;
		width: 100%;
		height: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.content {
		padding: 20px;
		text-align: center;
		z-index: 3;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 200rpx;
		/* 确保页面内容在叠加层之上 */
	}

	.title {
		font-size: 24px;
		font-weight: 700;
		color: #fff;
		/* 具体设置白色 */
	}

	.subtitle {
		font-size: 34px;
		font-weight: 700;
		margin: 10px 0;
		color: #fff;
		/* 具体设置白色 */
	}

	.time-info {
		font-size: 16px;
		color: #bbb;
		margin-bottom: 20px;
	}

	.description {
		font-size: 17px;
		font-weight: 350;
		align-items: center;
		line-height: 25.5px;
		color: #fff;
		/* 具体设置白色 */
	}

	.content-item {
		margin-top: 30rpx;
	}
</style>