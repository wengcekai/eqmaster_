<template>
	<view class="inner-container">
		<view class="bubble-container">
			<image class="avatar" :src="avatar" mode="aspectFill"></image>
			<view class="background-parent">
				<image class="character-background" src="/static/battlefield/character_background.png">
				</image>
				<view class="character">{{ character }}</view>
			</view>
			<text class="wording">{{ wording }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			avatar: {
				type: String,
				required: true
			},
			character: {
				type: String,
				required: true
			},
			wording: {
				type: String,
				required: true
			}
		}
	}
</script>

<style scoped>
	.inner-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 12px;
		position: absolute;
		top: 40vh;
		z-index: 11;
	}

	.avatar {
		width: 500rpx;
		height: 500rpx;
		position:  absolute;
		top: -500rpx;
		left: 100rpx;
	}

	.bubble-container {
		position: absolute;
		bottom: 1vh;
		width: 90%;
		background-color: #23232a;
		border-radius: 10px;
		padding: 12px;
		color: #FFFFFF;
		max-width: 80%;
		border: solid 2px #eeaf61;
		overflow: visible;
		z-index: 3;
	}

	.character-background {
		width: 200rpx;
		height: 50rpx;
		position: absolute;
		z-index: 2;
		left: 5%;
	}

	.background-parent {
		position: absolute;
		top: -48rpx;
		width: 200rpx;
	}

	.character {
		color: #000;
		z-index: 3;
		position: absolute;
		left: 20%;
	}

	.wording {
		font-size: 16px;
		text-align: left;
		color: #FFFFFF;
	}
</style>