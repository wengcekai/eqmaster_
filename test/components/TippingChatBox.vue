<template>
	<view class="tip-container">
		<image class="tip-background" src="/static/battlefield/question-mark.png" mode="widthFix"></image>
		<view class="tip-content">
			<image class="tip-mark" src="/static/battlefield/tip-yellow.png">
			</image>
			<text class="tip-text">{{ tip }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			tip: {
				type: String,
				required: true
			}
		}
	};
</script>

<style>
	.tip-container {
		position: relative;
		width: 80%;
		background-color: #FDEDC8;
		border-radius: 10px;
		padding: 20rpx;
		box-sizing: border-box;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.tip-background {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 40%;
		height: auto;
		opacity: 0.8;
	}
	
	.tip-mark{
		width: 30px;
		height: 30px;
		margin-left: 3px;
		z-index: 2;
	}

	.tip-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: start;
		overflow: visible;
		width: 90%;
	}

	.tip-text {
		font-size: 15px;
		color: #333;
		line-height: 1.5;
	}
</style>