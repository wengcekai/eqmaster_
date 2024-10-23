<template>
	<view class="background-image loading-container">
		<image class="background-image" src="/static/battlefield/background1.png" mode="aspectFill" />
		<!-- Content -->
		<view class="loading-text-container">
			<text class="loading-text">Meeting Room</text>
		</view>
	</view>
</template>

<script>
	import {
		startField
	} from '../../scripts/battlefield-chat'
	export default {
		async mounted() {
			const result = await startField(2, "2");
			console.log("result from start field:", result);
			uni.setStorage({
				key: 'chats',
				data: result.dialog
			})

			uni.navigateTo({
				url: '/pages/battlefield/battlefield-playground'
			})
		}
	}
</script>

<style scoped>
	@import "./common.css";

	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loading-text-container {
		width: 30%;
		background-color: rgba(16, 16, 16, 0.4);
		height: 40px;
		border-radius: 40rpx;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loading-text {
		color: #fff;
		font-size: 25rpx;
	}
</style>