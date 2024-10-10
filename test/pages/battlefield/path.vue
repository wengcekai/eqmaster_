<template>
	<view class="container">
		<view class="header">
			<view class="icon-container">
				<image mode="aspectFill" class="header-img h1" src="/static/course-diamond.png"></image>
			</view>
			<view class="icon-container">
				<image mode="aspectFill" class="header-img h2" src="/static/course-star.png"></image>
			</view>
			<view class="icon-container">
				<image mode="aspectFill" class="header-img h3" src="/static/course-hill.png"></image>
			</view>
		</view>
		<view class="dimension">
			<view class="dimension-header">
				<view class="dimension-title"><text>情绪刹车术</text></view>
				<view class="level"><text>Lv1 小试牛刀</text></view>
			</view>

			<view class="progress">
				<text>情绪掌控力</text>
				<view class="progress-bar"></view>
			</view>
		</view>
		<view class="path">
			<image class="img" mode="aspectFill" src="/static/course-background.png"></image>
		</view>
	</view>
</template>

<script>
</script>

<style>
	.container {
		background-color: #23232a;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100vh;
		touch-action: none;
	}

	.icon-container {
		width: 100rpx;
		overflow: visible;
		height: 80rpx;
	}

	.header-img {
		overflow: visible;
		margin-top: 100px;
		height: 100%;
		width: 100%;
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	}

	.dimension {
		background-color: #373742;
		width: 80%;
		height: 12vh;
		margin-top: 15vh;
		border-radius: 20px;
	}

	.h1 {
		width: 200rpx;
	}

	.h2 {
		width: 150rpx;
	}

	.h3{
		width: 130rpx;
		padding-right: 10px;
	}
	
	.path {
		width: 100%;
	}

	.img {
		width: 100%;
	}
</style>