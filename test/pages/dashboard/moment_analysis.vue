<template>
	<view style="background-color: #2f2f38;height: 100vh;width: 100vw;">
		<view v-if="isLoading == true" class="loading">
			<text>Loading</text>
		</view>
		<view v-else style="padding-top: 100rpx;padding-left: 40rpx;padding-right: 40rpx;">
			<view class="analysis-header">
				<image class="back" 
					src="../../static/dashboard/left-arrow.png"
					@click="goback"></image>
				<text class="title">Moment Analysis</text>
				<image style="width: 64rpx;height:64rpx" 
					src="../../static/dashboard/trash.png"
					@click="openModal"></image>
			</view>
			<scroll-view scroll-y="true" class="details">
				<ul class="detail-ul">
					<view class="detail-title" style="padding-left: 64rpx;">{{analysisResult.analysis.title.title}}</view>
					<view class="detail-summary" style="padding-left: 64rpx;">{{analysisResult.analysis.summary.summary}}</view>
					<view class="detail-summary" style="padding: 8rpx 0px 8rpx 64rpx;">You can:</view>
					<li class="detail-item" v-for="suggestion in analysisResult.analysis.suggestions">{{ suggestion.point }}</li>
				</ul>
			</scroll-view>
			<view class="chat-history">
				<text class="title">Chat History</text>
				<view class="chat-list">
					<scroll-view scroll-y="true" style="height: 594rpx">
						<view class="history-detail">
							<view v-for="(message, index) in analysisResult.chatHistory"
								:key="index"
								:class="['bubble', message.user == 'me' ? 'me' : 'other']">
								{{message.message}}
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			
			<!-- delete model -->
			<view v-if="isModelOpen" class="overlay">
				<view class="delete-model">
					<view v-if="isDeleteSuccess">
						<view class="model-title">Moment deleted</view>
						<view class="model-desc">Moment analysis and chat history have both been removed</view>
						<view class="button-container">
							<view class="button right" style="width: 446rpx" @click="goback">Back to Home</view>
						</view>
					</view>
					<view v-else>
						<view class="model-title">Delete this moment?</view>
						<view class="model-desc">Are you sure you want to delete this moment analysis?</view>
						<view class="button-container">
							<view class="button left" :class="{ 'is-loading': isLoading }" @click="cancelDelete">Cancel</view>
							<view class="button right" @click="deleteMoment">
								<text v-if="!isDeleting">Delete</text>
								<view v-else class="loader"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import apiService from '../../services/api-service';

	export default {
		data() {
			return {
				isLoading: false,
				isModelOpen: false,
				isDeleting: false,
				isDeleteSuccess: false,
				analysisResult: {
					id: 1,
					chatHistory: [
						{
							user: "",
							message: "",
						}
					],
					analysis: {
						title: {
							title: "title"
						},
						summary: {
							summary: "summary"
						},
						suggustions: [
							{
								point: ""
							}
						]
					}
				},
			}
		},
		onLoad(options) {
			const { analysisId } = options;
			this.analysisId = analysisId;
			uni.getStorage({
				key: `analysis-${analysisId}`,
				success: (res) => {
					this.analysisResult = res.data;
					console.log("analysis result", this.analysisResult);
					// uni.removeStorage({
					// 	key: `analysis-${analysisId}`,
					// 	success: () => {
					// 	    console.log('Storage data deleted successfully.');
					// 	},
					// })
					
				},
			})
		},
		methods: {
			goback() {
				uni.navigateBack({
					delta: 1
				})
			},
			openModal() {
				this.isModelOpen = true;
			},
			cancelDelete() {
				this.isModelOpen = false;
			},
			async deleteMoment() {
				try {
					if (this.isDeleting) return;
					this.isDeleting = true;
					await apiService.deleteMoment(this.analysisId);
					this.isDeleteSuccess = true;
				} catch(error) {
					return false;
				}finally {
					this.isDeleting = false;
				}
			},
		},
	}
</script>

<style scoped>
	.loading {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		background-color: #2f2f38;
		font-weight: 700;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.analysis-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 64rpx;
	}
	.back {
		width: 34.66rpx;
		height: 37.76rpx;
	}
	
	.loader {
	  border: 2px solid #1c1c1e; /* Match button background color */
	  border-top: 2px solid #ffffff;
	  border-radius: 50%;
	  width: 20px;
	  height: 20px;
	  animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
	  0% {
	    transform: rotate(0deg);
	  }
	  100% {
	    transform: rotate(360deg);
	  }
	}

	.title {
		font-weight: 600;
		font-size: 44rpx;
		line-height: 56rpx;
		color: #fff;
	}

	.details {
		width: 670rpx;
		height: 606rpx;
		background-color: #373742;
		margin-top: 30rpx;
		border-radius: 32rpx;
		overflow: hidden;
	}

	.chat-history {
		margin-top: 34rpx;
	}

	.chat-list {
		width: 670rpx;
		height: 594rpx;
		border-radius: 32rpx;
		border: 1px solid #67677a;
		margin-top: 16rpx;
	}

	.detail-title {
		font-size: 40rpx;
		font-weight: 700;
		color: #fff;
		line-height: 50rpx;
	}

	.detail-summary {
		font-size: 30rpx;
		font-weight: 400;
		color: #fff;
		line-height: 40rpx;
	}

	.detail-ul {
		width: 606rpx;
		padding: 32rpx;
		color: #fff;
		font-size: 26rpx;
		font-weight: 400;
		line-height: 36rpx;
		list-style-type: none;
		padding-left: 0;
	}

	.detail-item {
		position: relative;
		padding-left: 64rpx;
	}

	.detail-item::before {
		content: "·";
		font-weight: bold;
		position: absolute;
		left: 32rpx;
	}

	.history-detail {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		margin-top: 32rpx;
		padding-bottom: 32rpx;
	}

	.bubble {
		width: auto;
		max-width: 460rpx;
		height: auto;
		border-radius: 16rpx;
		padding: 8rpx 16rpx 8rpx 16rpx;

		font-weight: 400;
		font-size: 26rpx;
		line-height: 36rpx;
		color: #fff;
	}

	.me {
		background-color: #9ee44d4d;
		margin-left: auto;
		margin-right: 24rpx;
	}

	.other {
		background-color: #ffffff4d;
		margin-left: 24rpx;
		margin-right: auto;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #00000073;
		backdrop-filter: blur(40rpx);

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.delete-model {
		width: 542rpx;
		height: 356rpx;
		background-color: #2f2f38;
		border-radius: 32rpx;
		box-shadow: 0px 16rpx 72rpx 0px #00000029;
		padding-left: 48rpx;
	}

	.model-title {
		width: 542rpx;
		height: 96rpx;
		font-size: 38rpx;
		font-weight: 700;
		line-height: 48rpx;
		color: #ffffff;

		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.model-desc {
		width: 542rpx;
		height: 96rpx;
		font-size: 28rpx;
		font-weight: 400;
		line-height: 40rpx;
		color: #ffffff;

		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.button-container {
		display: flex;
		flex-direction: row;
		gap: 12px;
		margin-top: 24rpx;
	}

	.button {
		width: 211rpx;
		height: 84rpx;
		border-radius: 40rpx;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.left {
		border: 1px solid #67677a;
		background-color: #2f2f38;
		box-shadow: 0px 16rpx 72rpx 0px #00000029;
		color: #fff;
	}

	.right {
		background-color: #9ee44d;
		color: #000;
	}

</style>
