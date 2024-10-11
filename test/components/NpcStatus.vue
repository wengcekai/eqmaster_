<template>
	<view class="character-container">
		<!-- 血条 -->
		<view class="blood-container">
			<view class="health-bar-container">
				<view class="health-bar-line"></view>
				<view class="health-bar-background">
					<view class="health-bar-foreground" :style="healthBarStyle">
						<!-- 血条终点的指示器 -->
						<view v-if="showIndicator" class="health-bar-indicator" :style="indicatorStyle"></view>
					</view>
				</view>
			</view>
		</view>

		<view class="avatar-container">
			<image class="avatar" :src="avatar" mode="aspectFill"></image>
			<text class="character-name">{{ characterName }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'NpcStatus',
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
		data() {
			return {
				prevHealth: this.health, // 保存之前的健康值
				showIndicator: false, // 控制指示器的显示
				indicatorColor: '#EDFB8B', // 指示器颜色（默认绿色）
				indicatorTimeout: null // 定时器引用
			};
		},
		computed: {
			healthBarStyle() {
				const color = this.health < 33 ? '#FF6262' : '#9EE44D'; // 健康值小于33时为红色，大于等于33为绿色
				const width = `${this.health}%`; // 健康条宽度动态绑定
				return {
					width,
					backgroundColor: color,
					transition: 'width 0.5s ease, background-color 0.5s ease' // 动态变化的平滑效果
				};
			},
			indicatorStyle() {
				return {
					position: 'absolute',
					top: '50%', // 垂直居中
					transform: 'translateY(-50%)',
					left: '80%', // 放置在背景条的末端
					marginLeft: '-18rpx', // 调整圆圈与血条末端的间距
					width: '20px',
					height: '20px',
					borderRadius: '50%',
					border: `2px solid ${this.indicatorColor}`, // 空心圈的边框颜色
					backgroundColor: 'transparent', // 背景透明
					boxShadow: `0 0 8px ${this.indicatorColor}`, // 发光效果
					animation: 'fadeOutScale 2s forwards' // 使用新的动画效果
				};
			}
		},
		watch: {
			health(newVal, oldVal) {
				if (newVal > oldVal) {
					this.indicatorColor = '#EDFB8B'; // 绿色表示健康值上升
				} else if (newVal < oldVal) {
					this.indicatorColor = '#FE8C8C'; // 红色表示健康值下降
				} else {
					return; // 健康值未变化，不显示指示器
				}

				this.showIndicator = true;
				console.log("show the circle");

				// 清除之前的定时器
				if (this.indicatorTimeout) {
					clearTimeout(this.indicatorTimeout);
				}

				// 2秒后隐藏指示器
				this.indicatorTimeout = setTimeout(() => {
					this.showIndicator = false;
					this.indicatorTimeout = null;
				}, 2000);
				console.log("hide the circle");

				// 更新 prevHealth
				this.prevHealth = newVal;
			}
		},
		beforeUnmount() {
			// 组件销毁前清除定时器，防止内存泄漏
			if (this.indicatorTimeout) {
				clearTimeout(this.indicatorTimeout);
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
		/* 只在上方显示阴影 */
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
		border-radius: 50%;
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

	/* 指示器样式 */
	.health-bar-indicator {
		/* 样式由内联样式控制 */
	}

	/* 动画效果 */
	@keyframes fadeOutScale {
		0% {
			opacity: 1;
			transform: scale(1);
		}

		100% {
			opacity: 0;
			transform: scale(1.5);
		}
	}
</style>