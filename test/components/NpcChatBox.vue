<template>
	<view class="bubble-container">
		<view class="background-parent">
			<view class="user-info">
				<view class="avatar-background">
					<image class="avatar" :src="avatar" mode="aspectFill"></image>
				</view>
				<view class="name">
					<image class="character-background" src="/static/battlefield/character_background1.png"
						mode="scaleToFill"></image>
					<view class="character">{{ name }}</view>
				</view>
			</view>
		</view>
		<text class="txt">{{ dialog }}</text>
	</view>
</template>


<script>
	export default {
		props: {
			avatar: {
				type: String,
				required: true
			},
			name: {
				type: String,
				required: true
			},
			dialog: {
				type: String,
				required: true
			}
		}
	};
</script>


<style scoped>
	.bubble-container {
		background-color: #2F2F38;
		border-radius: 10px;
		padding: 12px;
		margin-top: 100rpx;

		/* width: 100%; */
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		line-height: 1.5;
		position: relative;
	}

	.background-parent {
		position: absolute;
		top: -45rpx;
		width: 100%;
		left: 60rpx;
		/*Use height to cut the image*/
		height: 20px;
		overflow: visible;
		display: flex;
		flex-direction: row;
	}

	.character-background {
		width: 160rpx;
		height: 50rpx;
		position: absolute;
		left: 10%;
	}

	.character {
		color: #000;
		left: 15%;
		position: absolute;
	}

	.avatar-background {
		position: absolute;
		top: -30rpx;
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		overflow: hidden;
		border: solid;
		border-color: #90e0e7;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 4;
	}

	.avatar {
		width: 100%;
		height: 100%;
	}

	.txt {
		margin: 10rpx 20rpx;
		color: #fff;
	}

	.name {
		position: absolute;
		left: 10rpx;
		height: 42rpx;
		width: 100%;
	}
</style>