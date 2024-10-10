<template>
	<view class="bubble-container">
		<text class="txt">{{ wording }}</text>
	</view>
</template>

<script>
	export default {
		props: {
			wording: {
				type: String,
				required: true
			}
		}
	}
</script>

<style scoped>
	.bubble-container {
		background-color: #F7E4BF;
		border-radius: 10px;
		padding: 12px;
		margin-top: 100rpx;
		width: 80%;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		line-height: 1.5;
	}

	.txt {
		margin: 5rpx 5rpx;
		font-size: 15px;
		font-weight: normal;
		color: #000;
	}
</style>