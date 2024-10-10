<template>
	<view class="container">
		<view class="modal">
			<image class="quit" src="/static/battlefield/quit.png" @click="quit"></image>
			<view class="modal-header">
				<text class="title">选择锦囊卡片</text>
			</view>

			<view class="cards">
				<!-- 帮回卡 -->
				<view class="card" :class="{ selected: selectedCard === 'help' }" @click="selectCard('help')">
					<image class="card-background" src="/static/battlefield/tipping-left.png" mode="scaleToFill">
					</image>
					<view class="card-content">
						<text class="card-title">帮回卡</text>
						<text class="card-description">
							快速调整你的回答，提升质量，让对话更流畅。
						</text>
						<view class="card-cost">
							<image class="diamond" src="/static/battlefield/diamond.png"></image>
							<text>60</text>
						</view>
					</view>
				</view>

				<!-- 提示卡 -->
				<view class="card" :class="{ selected: selectedCard === 'hint' }" @click="selectCard('hint')">
					<image class="card-background" src="/static/battlefield/tipping-right.png" mode="scaleToFill">
					</image>
					<view class="card-content">
						<text class="card-title">提示卡</text>
						<text class="card-description">
							提供情绪引导或建议，帮助你更好地理解和回应。
						</text>
						<view class="card-cost">
							<image class="diamond" src="/static/battlefield/diamond.png"></image>
							<text>20</text>
						</view>
					</view>
				</view>
			</view>

			<view class="confirm-btn" :class="{ 'not-selected': !selectedCard }" @click="confirmSelection">
				<text class="confirm-text">确定兑换</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			quit: {
				type: Function,
				required: true,
			},
			help: {
				type: Function,
				required: true,
			},
			hint: {
				type: Function,
				required: true,
			}
		},
		data() {
			return {
				selectedCard: null,
			};
		},
		methods: {
			selectCard(card) {
				console.log("Selected card:", card);
				this.selectedCard = card;
			},
			confirmSelection() {
				if (this.selectedCard) {
					console.log('Selected card:', this.selectedCard);
					quit();
					if (this.selectedCard === "help") {
						help();
					} else {
						hint();
					}
				} else {
					uni.showToast({
						title: '请选择一张卡片',
						icon: 'none',
					});
				}
			}
		},
	};
</script>

<style>
	.quit {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		top: 40rpx;
		right: 40rpx;
		z-index: 2;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.modal {
		width: 80%;
		background-color: #FDEDC8;
		border-radius: 10px;
		padding: 20px;
		box-sizing: border-box;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.modal-header {
		text-align: center;
		margin-bottom: 20px;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.title {
		font-size: 20px;
		font-weight: bold;
		color: #8c5225;
	}

	.cards {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 20px;
		overflow: visible;
	}

	.card {
		width: 250rpx;
		height: 300rpx;
		position: relative;
		border-radius: 10px;
		background-color: #fff;
		overflow: hidden;
		cursor: pointer;
		box-shadow: 0px 0px 3px 0px #FED397;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* 使用 border 并确保不会导致内部元素移位 */
	.card.selected {
		box-shadow: 0 0 0 4px #F2BC74;
	}

	.card-background {
		position: absolute;
		top: 20%;
		left: 50%;
		width: 50%;
		height: 50%;
		opacity: 0.8;
		z-index: 1;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 1;
		box-sizing: border-box;
	}

	.card-title {
		font-size: 16px;
		font-weight: bold;
	}

	.card-description {
		font-size: 12px;
		color: #67677A;
		width: 90%;
		margin: 10px 0;
		padding: 2px;
	}

	.card-cost {
		font-size: 14px;
		color: #f90;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.confirm-btn {
		background-color: #F2BC74;
		color: #fff;
		text-align: center;
		padding: 10px;
		border-radius: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.not-selected {
		opacity: 0.5;
	}

	.diamond {
		width: 35rpx;
		height: 35rpx;
		margin-right: 8rpx;
	}

	.confirm-text {
		font-weight: 400;
	}
</style>