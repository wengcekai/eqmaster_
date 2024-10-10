<template>
	<view class="container">
		<image class="background-image" src="/static/bg1.png" mode="aspectFill" />


		<view class="options-container">
			<view v-for="(option, index) in scenarioData && scenarioData.options ? scenarioData.options : []"
				:key="index" :class="['text-box', { 'selected': selectedOptionIndex === index }]"
				@click="selectOption(index)">
				<text class="text-content" :style="{ color: option.textColor || 'white' }">{{ option.text }}</text>
			</view>
		</view>

		<view class="button-container">
			<view class="continue-button" @click="nextPage">
				<text class="arrow">→</text>
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
				npcName: '小李',
				npcAvatar: '/static/npc1.png',
				userId: '',
				username: '',
				gender: '',
				selectedOptions: [],
				birthday: null,
				scenarioData: null,
				description: '',
				selectedOptionIndex: null,
				num: null,
				jobId: null,
				background: '',
				baseURL: 'https://eqmaster.azurewebsites.net' // 请替换为您的实际后端地址
			}
		},
		onLoad(option) {
			this.userId = option.userId || '';
			this.username = decodeURIComponent(option.username || '');
			this.gender = option.gender || '';
			this.jobId = option.jobId || ''

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

			// 发送数据到后端
			this.getScenarioData();
		},
		methods: {
			updateUserInfoPosition(x, y) {
				this.userInfoStyle.left = `${x}px`;
				this.userInfoStyle.bottom = `${y}px`;
				this.userInfoStyle.marginLeft = '0px'; // 移除居中效果
			},
			selectOption(index) {
				this.selectedOptionIndex = index;
				this.num = index + 1; // 设置 num 为选项的索引 + 1
				console.log('Selected option:', this.num, this.scenarioData.options[index].text);

				// 更新选项文本颜色为黑色
				this.scenarioData.options.forEach((option, i) => {
					option.textColor = (i === index) ? 'black' : 'white'; // 设置选中的文本颜色为黑色
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

				uni.request({
					url: `${this.baseURL}/choose_scenario`,
					method: 'POST',
					data: {
						choice: this.num,
						job_id: this.jobId
					},
					success: (response) => {
						console.log('Full response:', response);

						if (response.statusCode === 200) {
							const result = response.data;
							console.log('Response data:', result);

							let nextPageUrl;
							if (result.message === "Final choice made. Processing data in background.") {
								nextPageUrl =
									`/pages/result/loading?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`;
							} else {
								nextPageUrl =
									`/pages/test/test3?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`;
							}

							console.log('Navigating to:', nextPageUrl);

							uni.navigateTo({
								url: nextPageUrl,
								fail: (err) => {
									console.error('Navigation failed:', err);
									uni.showToast({
										title: '页面跳转失败',
										icon: 'none'
									});
								}
							});
						} else {
							uni.showToast({
								title: `请求失败，状态码：${response.statusCode}`,
								icon: 'none'
							});
						}
					},
					fail: (error) => {
						console.error('Detailed error:', error);
						uni.showToast({
							title: `发生错误：${error.errMsg}`,
							icon: 'none'
						});
					}
				});
			},
			getScenarioData() {
				uni.request({
					url: `${this.baseURL}/get_current_scenario/${this.jobId}`,
					method: 'POST',
					success: (res) => {
						console.log('Scenario data:', res.data);
						// 根据返回的数据结构调整
						this.scenarioData = res.data.scenes || res.data;
						this.handleScenarioData();
					},
					fail: (err) => {
						console.error('Error getting scenario data:', err);
					}
				});
			},
			handleScenarioData() {
				if (this.scenarioData) {
					this.description = this.scenarioData.description || '无法获取背景信息';
				} else {
					console.warn('Background information not found in scenario data');
					this.description = '无法获取背景信息';
				}
			}
		}
	}
</script>

<style scoped>
	@import url("/pages/test/common.css");

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

	.text-box {
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

	.text-content {
		color: white;
		font-size: 14px;
		line-height: 1.4;
	}

	.text-box.selected .text-content {
		color: #373742 !important;
	}

	.text-box.selected {
		background-color: #F6ECC9;
	}
</style>