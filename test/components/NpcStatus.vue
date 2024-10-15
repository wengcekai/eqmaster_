<template>
	<view class="character-container">
		<!-- 血条 -->
		<view class="blood-container">
			<view class="health-bar-container">
				<view class="health-bar-line"></view>
				<view class="health-bar-background">
					<view class="health-bar-foreground" :style="healthBarStyle">
					</view>
				</view>
			</view>
		</view>

		<view class="avatar-container">
			<image class="avatar" :src="avatar" mode="aspectFill"></image>
			<text class="character-name">{{characterName}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			health: {
				type: Number,
				default: 100 // 初始健康值
			},
			avatar: {
				type: String,
				default: '/static/battlefield/boss.png' // 默认头像路径
			},
			characterName: {
				type: String,
				default: '老板' // 默认角色名字
			}

		},
		computed: {
			healthBarStyle() {
				const color = this.health < 50 ? '#FF4D4F' : '#52C41A'; // 健康值小于50时为红色，大于50为绿色
				const width = `${this.health}%`; // 健康条宽度动态绑定
				return {
					width,
					backgroundColor: color,
					transition: 'width 0.5s ease, background-color 0.5s ease' // 动态变化的平滑效果
				};
			}
		}
	};
</script>

<style scoped>
	.character-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.blood-container {
		height: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.health-bar-container {
		width: 100px;
		height: 10px;
		margin-bottom: 10rpx;
		position: relative;
		overflow: visible;
	}

	.health-bar-background {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		position: relative;
		overflow: visible;
		z-index: 3;
	}

	.health-bar-foreground {
		height: 100%;
		border-radius: 5px;
		position: absolute;
		top: 0;
		left: 0;
		/* 添加只在上方显示阴影的代码 */
		overflow: visible;
		box-shadow: 0 -6px 6px -3px rgba(255, 255, 255, 0.3);
	}

	.health-bar-line {
		position: absolute;
		left: 50%;
		width: 2rpx;
		height: 10px;
		background-color: #ffffff;
		z-index: 3;
		/* 中间的白线 */
	}

	.avatar-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100px;
	}

	.avatar {
		width: 70px;
		height: 70px;
		border-radius: 35px;
		background-color: #fff;
		object-fit: cover;
		border: 2px solid rgba(0, 0, 0, 0.1);
	}

	.character-name {
		position: absolute;
		bottom: 8px;
		font-size: 16px;
		height: 22px;
		color: #fff;
		text-align: center;
		background-color: rgba(16, 16, 16, 0.8);
		padding: 2px 8px;
		border-radius: 10px;
	}
</style>