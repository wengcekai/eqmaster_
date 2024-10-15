<template>
	<view class="container">
		<image class="background-image" src="/static/bg1.png" mode="aspectFill" />
		
		<view class="progress-container">
			<view class="progress-bar">
				<view class="progress" :style="{ width: `${progress}%` }"></view>
			</view>
			<text class="progress-text">{{ currentScene }}/{{ totalScenes }}</text>
		</view>

		<!-- Test page content -->
		<template v-if="currentPage === 'test'">
			
			<view class="banner-container">
				<image class="logo" src="/static/signa.png" mode="aspectFit" />
				<text class="room-text">{{ scenarioData.location }}</text>
			</view>
			<view class="text-box">
				<text class="text-content">{{ background }}</text>
				<view class="expand-icon" @tap="navigateToTest1">
					<image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
				</view>
			</view>
		</template>

		<!-- Test1 page content -->
		<template v-else-if="currentPage === 'test1'">
			<onboarding-chat-bubble 
				:userName="npcName" 
				:avatar="npcAvatar" 
				:dismiss="navigateToTest2"
				:description="description">
			</onboarding-chat-bubble>
		</template>

		<!-- Test2 page content -->
		<template v-else-if="currentPage === 'test2'">
			<view class="options-container">
				<view v-for="(option, index) in scenarioData && scenarioData.options ? scenarioData.options : []"
					:key="index" 
					:class="['text-box1', { 'selected': selectedOptionIndex === index }]"
					@click="selectOption(index)">
					<text class="text-content1" :style="{ color: option.textColor || 'white' }">{{ option.text }}</text>
				</view>
			</view>
<!-- 			<view class="button-container">
				<view class="continue-button" @click="nextPage">
					<text class="arrow">→</text>
				</view>
			</view> -->
			<view class="button-container">
				<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @click="nextPage"></image>
			</view>
		</template>

	</view>
</template>

<script>
import { findLastName, getAvatar } from '../../scripts/locate_name';
import OnboardingChatBubble from '/components/OnboardingChatBubble.vue';
import apiService from '/services/api-service.js';

export default {
	components: {
		OnboardingChatBubble,
	},
	data() {
		return {
			currentPage: 'test',
			userId: '',
			username: '',
			gender: '',
			selectedOptions: [],
			birthday: null,
			scenarioData: null,
			background: '请点击下方箭头继续',
			jobId: '',
			npcName: '',
			npcAvatar: '',
			description: '',
			firstScene: false,
			selectedOptionIndex: null,
			num: null,
			baseURL: apiService.API_ENDPOINT,
			progress: 0,
			currentScene: 1,
			totalScenes: 5,
		};
	},
	onLoad(option) {
		console.log('Received options:', option);
		this.initializeData(option);
		this.sendDataToBackend();
	},
	methods: {
		initializeData(option) {
			this.userId = option.userId || '';
			this.username = decodeURIComponent(option.username || '');
			this.gender = option.gender || '';
			this.jobId = option.jobId || '';
			this.background = option.background || '';

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
				birthday: this.birthday,
				jobId: this.jobId
			});
		},
		sendDataToBackend() {
			apiService.createProfile({
				name: this.username,
				job_level: this.jobLevel || '',
				gender: this.gender,
				concerns: this.selectedOptions,
			})
				.then((res) => {
					console.log('Backend response:', res);
					this.jobId = res.job_id;
					this.getScenarioData();
				})
				.catch((err) => {
					console.error('Error sending data to backend:', err);
				});
		},
		getScenarioData() {
			const requestMethod = this.currentPage === 'test1' && this.firstScene
				? apiService.startScenario(this.jobId)
				: apiService.getCurrentScenario(this.jobId);

			requestMethod
				.then((res) => {
					console.log('Scenario data:', res);
					this.scenarioData = res.scenes || res;
					this.handleScenarioData();
					// 更新进度
					this.updateProgress();
				})
				.catch((err) => {
					console.error('Error getting scenario data:', err);
				});
		},
		handleScenarioData() {
			if (this.scenarioData) {
				this.description = this.scenarioData.description || '无法获取背景信息';
				this.background = this.scenarioData.background || '请点击下方箭头继续';
			} else {
				console.warn('Background information not found in scenario data');
				this.description = '无法获取背景信息';
				this.background = '请点击下方箭头继续';
			}
		},
		navigateToTest1() {
			this.currentPage = 'test1';
			this.analyzeBackground();
			this.getScenarioData();
		},
		navigateToTest2() {
			this.currentPage = 'test2';
			this.getScenarioData();
		},
		analyzeBackground() {
			if (this.background) {
				this.npcName = findLastName(this.background);
				this.npcAvatar = getAvatar(this.npcName);
			}
		},
		selectOption(index) {
			this.selectedOptionIndex = index;
			this.num = index + 1;
			console.log('Selected option:', this.num, this.scenarioData.options[index].text);

			this.scenarioData.options.forEach((option, i) => {
				option.textColor = (i === index) ? 'black' : 'white';
			});
		},
		nextPage() {
			if (this.num === null) {
				uni.showToast({
					title: '请选择一个选项',
					icon: 'none'
				});
				return;
			}

			console.log('Sending data to backend:', {
				choice: this.num,
				job_id: this.jobId
			});

			apiService.chooseScenario(this.num, this.jobId)
				.then((result) => {
					console.log('Response data:', result);

					let nextPageUrl;
					if (result.message === "Final choice made. Processing data in background.") {
						nextPageUrl = `/pages/result/loading`;
					} else {
						nextPageUrl = `/pages/test/test3`;
					}

					console.log('Navigating to:', nextPageUrl);

					uni.navigateTo({
						url: `${nextPageUrl}?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`,
						fail: (err) => {
							console.error('Navigation failed:', err);
							uni.showToast({
								title: '页面跳转失败',
								icon: 'none'
							});
						}
					});
				})
				.catch((error) => {
					console.error('Detailed error:', error);
					uni.showToast({
						title: `发生错误：${error.message}`,
						icon: 'none'
					});
				});
		},
		// 新增更新进度的方法
		updateProgress() {
			this.currentScene = this.scenarioData.sceneNumber || 1;
			this.totalScenes = 5; // 假设总共有5个场景，您可能需要根据实际情况调整
			this.progress = (this.currentScene / this.totalScenes) * 100;
		},
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
