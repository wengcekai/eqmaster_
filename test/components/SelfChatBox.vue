<template>
	<view class="bubble-container">
		<text class="txt">{{ wording }}</text>
		<text class="commit" v-if="commit !== '' && isLastElement">
			<image class="commit-icon" src="/static/battlefield/commit_warning-fill.png"></image>
			{{ commit }}
		</text>
	</view>
</template>

<script>
	export default {
		props: {
			wording: {
				type: String,
				required: true
			},
			commit: {
				type: String,
				required: false,
				default: '',
			},
			isLastElement: {
				type: Boolean,
				default: false,
			}
		}
	}
</script>

<style scoped>
	.bubble-container {
		background-color: #D6fcf6;
		border-radius: 10px;
		padding: 12px;
		margin-top: 48rpx;
		/* width: 100%; */
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		line-height: 1.5;
	}

	.txt {
		margin: 5rpx 5rpx;
		font-size: 15px;
		font-weight: normal;
		color: #000;
	}
	.commit {
		display: block;
		margin-top: 16rpx;
		font-size: 13px;
		color: #872E13;
	}
	.commit-icon {
		width: 40rpx;
		height: 40rpx;
		margin-bottom: -10rpx;
	}
</style>