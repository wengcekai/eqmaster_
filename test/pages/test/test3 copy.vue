<template>
	<view class="container">
		<image class="background-image" src="/static/bg1.png" mode="aspectFill" />

		<view class="banner-container">
			<image class="logo" src="/static/signa.png" mode="aspectFit" />
			<text class="room-text">{{ this.scenarioData.location }}</text>
		</view>

		<view class="text-box">
			<text class="text-content">{{ background }}</text>
			<view class="expand-icon" @tap="navigateToTest1" style="margin-left: auto;">
				<image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfoStyle: {
					bottom: '180px',
					left: '50%',
					marginLeft: '-65px' // 替换 transform
				},
				userId: '',
				username: '',
				gender: '',
				selectedOptions: [],
				birthday: null,
				scenarioData: null,
				background: '',
				jobId: '',
				roundCount: 0,
				num: null,
				baseURL: 'https://eqmaster.azurewebsites.net' // 请替换为您的实际后端地址
			}
		},
		onLoad(option) {
			console.log('Received options:', option);

			// 接收上一个页面传递的数据
			this.userId = option.userId || '';
			this.username = decodeURIComponent(option.username || '');
			this.gender = option.gender || '';
			this.jobId = option.jobId || '';

			if (option.options) {
				try {
					this.selectedOptions = JSON.parse(decodeURIComponent(option.options));
				} catch (e) {
					console.error('Error parsing options:', e);
					this.selectedOptions = [];
				}
			}

			if (option.birthday) {
				try {
					this.birthday = JSON.parse(decodeURIComponent(option.birthday));
				} catch (e) {
					console.error('Error parsing birthday:', e);
					this.birthday = null;
				}
			}

			// 接收来自其他页面的新信息
			if (option.roundCount) {
				this.roundCount = parseInt(option.roundCount, 10);
			}
			if (option.num) {
				this.num = parseInt(option.num, 10);
			}

			console.log('Parsed data:', {
				userId: this.userId,
				username: this.username,
				gender: this.gender,
				selectedOptions: this.selectedOptions,
				birthday: this.birthday,
				roundCount: this.roundCount,
				num: this.num,
				jobId: this.jobId
			});

			// 获取场景数据
			this.getScenarioData();
		},
		methods: {
			navigateToTest1() {
				const testPageUrl =
					`/pages/test/test1?background=${this.background}&jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&roundCount=${this.roundCount}&num=${this.num}`;

				uni.navigateTo({
					url: testPageUrl
				});
			},
			getScenarioData() {
				uni.request({
					url: `${this.baseURL}/get_current_scenario/${this.jobId}`,
					method: 'POST',
					success: (res) => {
						console.log('Scenario data:', res.data);
						// 根据返回的数据结构调整
						this.scenarioData = res.data;
						this.handleScenarioData();
					},
					fail: (err) => {
						console.error('Error getting scenario data:', err);
					}
				});
			},
			handleScenarioData() {
				if (this.scenarioData) {
					// 假设 scenarioData 包含一个 background 字段
					this.background = this.scenarioData.scenes.background || '请点击下方箭头继续';
					// ... 处理其他数据
				} else {
					this.background = '请点击下方箭头继续';
				}
			},
		}
	}
</script>


<style scoped>
	@import url("common.css");

	.text-box {
		position: absolute;
		bottom: 80rpx;
		left: 40rpx;
		right: 40rpx;
		background-color: rgba(55, 55, 66, 0.8);
		border-radius: 50rpx;
		padding-top: 50rpx;
		padding-bottom: 50rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
		z-index: 1;
		min-height: 100rpx;
		max-height: 400rpx;
		overflow: auto;
		border: 6rpx solid #F2BC74;
		/* 示例边框颜色 */
	}

	.text-content {
		color: white;
		font-size: 28rpx;
		line-height: 1.4;
	}

	.expand-icon {
		text-align: center;
		color: white;
		font-size: 24rpx;
		margin-top: 10rpx;

	}

	.icon-image {
		width: 20px;
		/* 使图片适应容器宽度 */
		height: 20px;
		/* 使图片适应容器高度 */
	}

	.debug-info {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		padding: 10rpx;
		font-size: 20rpx;
		z-index: 100;
		max-height: 50vh;
		overflow-y: auto;
	}

	.debug-info text {
		display: block;
		margin-bottom: 4rpx;
	}
</style>