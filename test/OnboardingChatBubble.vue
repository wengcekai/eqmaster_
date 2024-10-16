<template>
	<view class="bubble-container">
		<view class="text-box">
			<view class="user-info">
				<image class="user-avatar" :src="avatar" mode="aspectFill" />
				<text class="user-name">{{userName}}</text>
				<image class="name-background" src="/static/rec-right.png" mode="aspectFill" />
			</view>
			<view class="text-content">{{ description }}</view>
			<view class="expand-icon">
				<image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			userName: {
				type: String,
				required: true
			},
			avatar: {
				type: String,
				required: true
			},
			description: {
				type: String,
				default: '这里是描述信息'
			}
		}
	};
</script>

<style>
	@import url("../pages/test/common.css");

	.bubble-container {
		position: absolute;
		bottom: 80rpx;
		left: 40rpx;
		right: 40rpx;
		padding-top: 50rpx;
		padding-bottom: 50rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
		overflow: visible;
	}

	.text-box {
		position: absolute;
		bottom: 60rpx;
		left: 40rpx;
		right: 40rpx;
		background-color: rgba(55, 55, 66, 0.8);
		border-radius: 50rpx;
		padding-top: 50rpx;
		padding-bottom: 50rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
		z-index: 1;
		overflow: visible;
		border: 6rpx solid #F2BC74;
		background-color: #000;
	}

	.text-content {
		color: white;
		font-size: 28rpx;
		line-height: 1.4;
	}

	.user-avatar {
		width: 60px;
		height: 60px;
		border-radius: 30px;
		margin-left: 5%;
		z-index: 3;
		border: solid 6rpx #F2BC74;
	}

	.name-background {
		width: 200rpx;
		height: 50rpx;
		position: absolute;
		left: 20%;
	}

	.user-name {
		position: absolute;
		left: 30%;
		color: #000;
		font-size: 16px;
		z-index: 4;
	}

	.user-info {
		position: absolute;
		top: -48px;
		left: 10px;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>