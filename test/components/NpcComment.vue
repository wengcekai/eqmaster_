<template>
	<view class="card-container">
		<view class="avatar-container">
			<image class="avatar" :src="avatar" mode="aspectFill"></image>
		</view>
		<view class="description">
			<view class="name-icon-container" style="display: flex; flex-direction: row; align-items: center;">
				<view class="name">{{ name }}</view>
				<!-- 根据 npcHealth 显示不同的 SVG 图标 -->
				<!-- <image v-if="npcHealth !== 10" :src="npcHealth > 10 ? greenIcon : redIcon" class="health-icon"></image> -->
			</view>
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
			},
			npcHealth: Number
		},
		data() {
			return {
				greenIcon: '/static/battlefield/prime_sort-up-fill.svg', // 假设绿色的SVG图标路径
				redIcon: '/static/battlefield/prime_sort-down-fill.svg' // 假设红色的SVG图标路径
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

	.health-icon {
		width: 16px;
		height: 16px;
		margin-left: 5px;
	}

	.comment {
		font-size: 14px;
		font-weight: 400;
		margin-top: 5px;
	}
</style>