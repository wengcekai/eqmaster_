<template>
	<view class="judge-container" :style="{ backgroundColor: bgColor }">
		<text class="title" :style="{color: fontColor}">{{ title }}
		</text>
		<text class="wording" :style="{color: fontColor}">
			<image class="wording-icon" src="/static/battlefield/commit_warning-fill.png" v-if="!goodJudge"></image>
			{{ wording }}
		</text>
		<view class="judge-button-container">
			<button class="judge-action-button" :style="{
				backgroundColor: buttonBgColor
			}" @tap="onContinue">{{ buttonText }}</button>
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
			}
		},
		methods: {
			onContinue() {
				// 按钮点击事件
				console.log("emitting event");
				this.$emit('judge', this.goodJudge);
			}
		},
		computed: {
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
	.judge-container {
		border-radius: 12px;
		width: 100%;
		/* height: 20px; */
		position: absolute;
		display: flex;
		flex-direction: column;
		bottom: 0;
	}

	.title {
		font-weight: 700;
		font-size: 17px;
		margin-top: 10px;
		margin-left: 10px;
	}

	.wording {
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
		position: absolute;
		bottom: 50rpx;
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
</style>