<template>
	<view class="container-box">
		<text class="content">
			<view class="card-header">
				<view class="title">
					本关任务
					<image class="card-close-image" src="/static/battlefield/material-symbols_close.png" mode="" @click="closeCardBox"></image>
				</view>
			</view>
			<view class="list">
				<view class="item" v-for="(item,index) in listData">
					<view class="left">
						<image class="radiocheck-image" src="/static/battlefield/radiocheck-disabled.png" mode=""></image>
					</view>
					<view class="right">
						<view class="top">
							得到领导的夸赞
						</view>
						<view class="bottom">
							<view class="blood-container">
								<view class="health-bar-container">
									<view class="health-bar-line"></view>
									<view class="health-bar-background">
										<view class="health-bar-foreground" :style="healthBarStyle">
										</view>
									</view>
								</view>
								<view class="">
									1/2
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</text>
	</view>
</template>

<script>
	export default {
		props: {
			listData: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			closeCardBox() {
				// 按钮点击事件
				this.$emit('closeMissionCard');
			}
		},
		computed: {
			healthBarStyle() {
				const color = this.health < 50 ? '#F2BC74' : '#F2BC74'; // 健康值小于50时为红色，大于50为绿色
				const width = `${this.health}%`; // 健康条宽度动态绑定
				return {
					width,
					backgroundColor: color,
					transition: 'width 0.5s ease, background-color 0.5s ease' // 动态变化的平滑效果
				};
			}
		}
	}
</script>

<style scoped>
	.container-box {
		width: 100%;
		border-top-left-radius: 32rpx;
		border-top-right-radius: 32rpx;
		z-index: 3;
		position: absolute;
		height: 732rpx;
		bottom: 0px;
		background-color: #FDEDC8;
		display: flex;
		flex-direction: column;
	}

	.content {
		/* display: flex; */
		padding: 40rpx 36rpx 96rpx 32rpx;
	}
	.card-header {
		display: block;
	}
	.title {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 48rpx;
		font-weight: 700;
		color: #8C5225;
	}
	.card-close-image {
		position: absolute;
		right: 0;
		width: 48rpx;
		height: 48rpx;
	}
	.list {
		display: block;
		text-align: center;
		width: 686rpx;
		height: 500rpx;
		gap: 16rpx;
		opacity: 0px;
		margin-top: 40rpx;
		color: #8C5225;
	}
	.item {
		display: flex;
/* 				height: 156rpx; */
		align-items: center;
		background-color: #FFFFFF;
		margin-bottom: 16rpx;
		padding: 24rpx 32rpx;
		border-radius: 24rpx;
		gap: 32rpx;
	}
	.left {
		.radiocheck-image {
			width: 53.34rpx;
			height: 53.34rpx;
		}
	}
	.right {
		text-align: left;
		display: block;
		font-size: 34rpx;
		.bottom {
			
		}
	}

	.blood-container {
		height: 56rpx;
		/* padding: 20rpx 0; */
		display: flex;
		gap: 44rpx;
		/* flex-direction: column; */
		align-items: center;
	}
	
	.health-bar-container {
		width: 436rpx;
		height: 20rpx;
		/* margin-bottom: 10rpx; */
		position: relative;
		overflow: visible;
	}
	
	.health-bar-background {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		position: relative;
		overflow: visible;
		z-index: 3;
	}
	
	.health-bar-foreground {
		margin-top: 2rpx;
		height: 16rpx;
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
</style>