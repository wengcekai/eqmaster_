<template>
	<view class="container">
		<image class="background-image" src="/static/bg1.png" mode="aspectFill" />
		<view class="banner-container">
			<image class="logo" src="/static/signa.png" mode="aspectFit" />
			<text class="room-text">{{ this.scenarioData.location }}</text>
		</view>
		<view class="text-box">
			<text class="text-content">{{ background }}</text>
			<view class="expand-icon" @tap="navigateToTest1">
				<image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				userId: '',
				username: '',
				gender: '',
				selectedOptions: [],
				birthday: null,
				scenarioData: null,
				background: '请点击下方箭头继续',
				jobId: ''
			};
		},
		onLoad(option) {
			console.log('Received options:', option);

			// 接收上一个页面传递的数据
			this.userId = option.userId || '';
			this.username = decodeURIComponent(option.username || '');
			this.gender = option.gender || '';

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

			console.log('Parsed data:', {
				userId: this.userId,
				username: this.username,
				gender: this.gender,
				selectedOptions: this.selectedOptions,
				birthday: this.birthday
			});
			

			// 发送数据到后端
			this.sendDataToBackend();
		},
		methods: {
			navigateToTest1() {
				const testPageUrl =
					`/pages/test/test1?firstScene=true&jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&background=${this.background}`;

				uni.navigateTo({
					url: testPageUrl
				});
			},
			sendDataToBackend() {
				uni.request({
					url: 'https://eqmaster.azurewebsites.net/create_profile', // 替换为您的后端服务地址
					method: 'POST',
					data: {
						name: this.username,
						job_level: this.jobLevel || '',
						gender: this.gender,
						concerns: this.selectedOptions,
					},
					success: (res) => {
						console.log('Backend response:', res.data);
						this.jobId = res.data.job_id; // 存储返回的 job_id

						// 获取 job_id 后立即调用 start_scenario
						this.getScenarioData();
					},
					fail: (err) => {
						console.error('Error sending data to backend:', err);
					}
				});
			},
			getScenarioData() {
				uni.request({
					url: `https://eqmaster.azurewebsites.net/start_scenario/${this.jobId}`, // 替换为您的后端服务地址
					method: 'POST',
					success: (res) => {
						try {
							const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
							console.log('Scenario data:', data);
							this.scenarioData = data.scenes || null;
							this.handleScenarioData();
						} catch (error) {
							console.error('Error parsing scenario data:', error);
							this.background = '获取场景数据时出错。';
						}
					},
					fail: (err) => {
						console.error('Error getting scenario data:', err);
						this.background = '无法获取场景数据。';
					}
				});
			},
			handleScenarioData() {
				if (this.scenarioData) {
					this.background = this.scenarioData.background || '请点击下方箭头继续';
				} else {
					this.background = '请点击下方箭头继续';
				}
			}
		}
	};
</script>



<style scoped>
@import url("/pages/test/common.css");

.text-box {
	position: absolute;
	bottom: 80rpx;
	left: 40rpx;
	right: 40rpx;
	background-color: rgba(55, 55, 66, 0.8);
	border-radius: 50rpx;
	padding: 50rpx;
	z-index: 1;
	min-height: 100rpx;
	max-height: 400rpx;
	overflow: auto;
	border: 6rpx solid #F2BC74;
}

.text-content {
	color: white;
	font-size: 28rpx;
	line-height: 1.4;
}

.options-container {
	position: absolute;
	top: 50vh;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
}

.text-box.selected {
	background-color: #F6ECC9;
}

.text-box.selected .text-content {
	color: #373742 !important;
}

	.text-box1 {
		width: 80%;
		background-color: rgba(55, 55, 66, 0.8);
		border-radius: 50px;
		padding: 15px 25px;
		min-height: 80rpx;
		max-height: 160rpx;
		transition: background-color 0.3s;
		display: flex;
		align-items: center;
	}

	.text-content1 {
		color: white;
		font-size: 14px;
		line-height: 1.4;
	}

	.text-box1.selected .text-content {
		color: #373742 !important;
	}

	.text-box1.selected {
		background-color: #F6ECC9;
	}
	
/* Add any additional styles you need */

.progress-container {
	position: absolute;
	top: 120rpx;
	left: 40rpx;
	right: 40rpx;
	display: flex;
	align-items: center;
}

.progress-bar {
	flex-grow: 1;
	height: 10rpx;
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 5rpx;
	overflow: hidden;
	width: 90%;
	margin-right: 20rpx;
}

.progress {
	height: 100%;
	background-color: #F2BC74;
	transition: width 0.3s ease;
}

.progress-text {
	color: #FFFFFF;
	font-size: 24rpx;
	min-width: 60rpx;
	text-align: right;
}

/* ... 其他样式保持不变 ... */
</style>
