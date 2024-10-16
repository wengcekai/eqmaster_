<template>
	<view class="gem-container">
		<!-- <image class="gem-icon" src="/static/battlefield/diamond.png" mode="aspectFit"></image> -->
		<view v-for="n in 3" :key="n" class="gem">
			<!-- 根据 gemCount 的值，亮起相应数量的绿色星星 -->
			<image class="gem-icon"
				:src="n <= gemCount ? '/static/battlefield/mingcute_star-fill.svg' : '/static/battlefield/mingcute_star-grey.svg'"
				:style="{ width: gemIconWidth, height: gemIconHeight }" mode="aspectFit">
			</image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			gemCount: {
				type: Number,
				default: 0
			},
			gemIconWidth: {
				type: String,
				default: '28px' // 默认宽度
			},
			gemIconHeight: {
				type: String,
				default: '28px' // 默认高度
			}
		}
	}
</script>

<style scoped>
	.gem-container {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		width: 250rpx;
		background-color: rgba(16, 16, 16, 0.4);
		/* 半透明背景 */
		border-radius: 50rpx;
		/* 圆角背景 */
		padding: 10px 20px;
		/* 内边距 */
	}

	.gem {
		display: flex;
		align-items: center;
		/* margin-right: 10rpx; */
	}

	.gem-icon {
		/* 	width: 28px;
		height: 28px; */
	}

	.gem-count {
		color: #ffcc66;
		/* 数	字颜色 */
		font-size: 24px;
		/* 字体大小 */
		font-weight: bold;
		/* 字体加粗 */
	}
</style>