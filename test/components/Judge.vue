<template>
	<view class="judge-containers" :style="{ backgroundColor: bgColor }">
		<view class="judge-container-box">
			<text class="title" :style="{color: fontColor}">{{ title }}
			</text>
			<view class="speed-right" v-if="isCompleteTask">
				<view class="">
					{{ currentTask._title }}
				</view>
				<view class="">
					<view class="blood-container">
						<view class="health-bar-container">
							<view class="health-bar-line"></view>
							<view class="health-bar-background">
								<view class="health-bar-foreground" :style="healthBarStyle">
								</view>
							</view>
						</view>
						<view class="">
							{{ currentTask._completedRoundNum }}/{{ currentTask.totalRoundNum }}
						</view>
					</view>
				</view>
			</view>
			<text class="wording" :style="{color: fontColor}">
				<image class="wording-icon" src="/static/battlefield/commit_warning-fill.png" v-if="!goodJudge"></image>
				{{ wording }}
			</text>
			<view class="judge-button-container">
				<button class="judge-action-button" :style="{
					backgroundColor: buttonBgColor
				}" @tap.stop.prevent="onContinue" :disabled="isLoading">{{ buttonText }}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				required: true
			},
			wording: {
				type: String,
				required: true,
				fontColor: "#fff"
			},
			goodJudge: {
				type: Boolean,
				required: true
			},
			isCompleteTask: {
				type: Boolean,
				required: false
			},
			currentTask: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				isLoading: false,
			}
		},
		created() {
			console.log("created")
		},
		watch: {
			currentTask: {
			  handler() {
				this.isLoading = false;
			  },
			  deep: true
			},
		},
		methods: {
			onContinue() {
				// 按钮点击事件
				console.log("emitting event");
				this.isLoading = true;
				this.$emit('judge', this.goodJudge);
			}
		},
		computed: {
			healthBarStyle() {
				const percentage = this.currentTask ? (this.currentTask._completedRoundNum / this.currentTask.totalRoundNum) * 100 : 0;
				const color = percentage < 50 ? '#E8FFC4' : '#9EE44D';
				const width = `${percentage}%`;
				return {
					width,
					backgroundColor: color,
					transition: 'width 0.5s ease, background-color 0.5s ease'
				};
			},
			bgColor() {
				return this.goodJudge ? '#E8FFC4' : '#fff2b4';
			},
			fontColor() {
				return this.goodJudge ? '#315B00' : '#936A15';
			},
			buttonBgColor() {
				return this.goodJudge ? '#A9E55B' : '#FFD044';
			},
			buttonText() {
				return this.goodJudge ? '继续' : '再试试';
			}
		}
	}
</script>

<style scoped>
	.judge-containers {
		border-radius: 12px;
		width: 100%;
		height: auto;
		/* height: 20px; */
		position: absolute;
		display: flex;
		flex-direction: column;
		bottom: 0;
	}
	.judge-container-box {
		/* display: contents; */
		padding: 40rpx 48rpx 120rpx 40rpx;
	}

	.title {
		font-weight: 700;
		font-size: 17px;
		margin-top: 10px;
		margin-left: 10px;
	}

	.wording {
		display: block;
		font-size: 16px;
		color: #3E3E3E;
		margin-left: 10px;
		margin-top: 10px;
	}
	.wording-icon {
		width: 48rpx;
		height: 48rpx;
		margin-bottom: -10rpx;
	}

	.judge-button-container {
		display: flex;
		justify-content: center;
		width: 100%;
		/* position: absolute; */
		bottom: 50rpx;
		margin-top: 20rpx;
	}

	.judge-action-button {
		color: #3E3E3E;
		border-radius: 50px;
		font-size: 16px;
		height: 50px;
		width: 80%;
		line-height: 50px;
		text-align: center;
		border: none;
	}
	.judge-action-button[disabled] {
		opacity: 50%;
	}

	.speed-right {
		text-align: left;
		display: block;
		font-size: 34rpx;
		/* height: 138rpx; */
		background-color: #9EE44D33;
		padding: 32rpx;
		border-radius: 24rpx;
		color: #67677A;
		font-size: 30rpx;
		font-weight: 400;
		margin-top: 24rpx;
		margin-bottom: 20rpx;
	}

	.blood-container {
		height: 56rpx;
		/* padding: 20rpx 0; */
		display: flex;
		gap: 44rpx;
		/* flex-direction: column; */
		align-items: center;
	}
	
	.health-bar-container {
		width: 100%;
		height: 20rpx;
		/* margin-bottom: 10rpx; */
		position: relative;
		overflow: visible;
	}
	
	.health-bar-background {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		position: relative;
		overflow: visible;
		z-index: 3;
	}
	
	.health-bar-foreground {
		margin-top: 2rpx;
		height: 16rpx;
		border-radius: 5px;
		position: absolute;
		top: 0;
		left: 0;
		/* 添加只在上方显示阴影的代码 */
		overflow: visible;
		box-shadow: 0 -6px 6px -3px rgba(255, 255, 255, 0.3);
	}
	
	.health-bar-line {
		position: absolute;
		left: 50%;
		width: 2rpx;
		height: 10px;
		background-color: #ffffff;
		z-index: 3;
		/* 中间的白线 */
	}
</style>