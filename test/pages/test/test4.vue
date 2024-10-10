<template>
	<view class="container">
		<image class="background-image" src="/static/bg1.png" mode="aspectFill" />

		<onboarding-chat-bubble userName="this.scenarioData.role" :avatar="'/static/npc1.png'" :dismiss="navigateToTest1"
			:description="description">
		</onboarding-chat-bubble>
	</view>
</template>

<script>
	import OnboardingChatBubble from '/components/OnboardingChatBubble.vue';

	export default {
		components: {
			OnboardingChatBubble, // 注册组件
		},
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
				description: '',
				jobId: '',
				baseURL: 'https://eqmaster.azurewebsites.net' // 请替换为您的实际后端地址
			}
		},
		onLoad(option) {
			console.log('Received options:', option);

			// 接收上一个页面传递的数据
			this.userId = option.userId || '';
			this.username = decodeURIComponent(option.username || '');
			this.gender = option.gender || '';
			this.jobId = option.jobId || ''; // 添加默认值

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
			this.getScenarioData();
		},
		methods: {
			updateUserInfoPosition(x, y) {
				this.userInfoStyle.left = `${x}px`;
				this.userInfoStyle.bottom = `${y}px`;
				this.userInfoStyle.marginLeft = '0px'; // 移除居中效果
			},
			navigateToTest1() {
				const testPageUrl =
					`/pages/test/test5?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}`;

				uni.navigateTo({
					url: testPageUrl
				});
			},
			getScenarioData() {
				uni.request({
					url: `${this.baseURL}/get_current_scenario/${this.jobId}`,
					method: 'POST',
					success: (res) => {
						console.log('Scenario data:', res?.data || {});
						this.scenarioData = res.data; // 修改为直接获取 res.data
						this.handleScenarioData();
					},
					fail: (err) => {
						console.error('Error getting scenario data:', err);
					}
				});
			},
			handleScenarioData() {
				if (this.scenarioData) {
					// 假设 scenarioData 包含一个 description 字段
					this.description = this.scenarioData?.scenes?.description || '无法获想无法获想无法获想无法获想无法获想无法获想无法获想无法获想无法获想';
				} else {
					console.warn('Background information not found in scenario data');
					this.description = '无法获取背景信息';
				}
			}
		}
	}
</script>

<style scoped>
	@import url("common.css");
</style>