<template>
	<view class="card-container">
		<view class="avatar-container">
			<image class="avatar" :src="avatar" mode="aspectFill"></image>
		</view>
		<view class="description">
			<view class="name">{{ name }}</view>
			<view class="comment">{{ comment }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				required: true
			},
			avatar: {
				type: String,
				required: true
			},
			comment: {
				type: String,
				required: true
			}
		}
	}
</script>

<style scoped>
	.card-container {
		display: flex;
		align-items: flex-start;
		padding: 10px;
		border-radius: 10px;
		background-color: #454552;
		margin: 10px 0;

	}

	.avatar {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.avatar-container {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		border: solid 1px #F2Bc74;
		flex-shrink: 0;
	}

	.description {
		margin-left: 20px;
		color: #fff;
		display: flex;
		flex-direction: column;
	}

	.name {
		font-weight: bold;
		font-size: 16px;
	}

	.comment {
		font-size: 14px;
		font-weight: 400;
		margin-top: 5px;
	}
</style>