<template>
	<view class="container">
		<image class="background-image" src="/static/bg1.png" mode="aspectFill" />

		<!-- <view class="banner-container"> -->
			<!-- <image class="logo" src="/static/signa.png" mode="aspectFit" /> -->
			<!-- <text class="room-text">三楼电梯间</text> -->
		<!-- </view> -->

		<onboarding-chat-bubble :userName="npcName" :avatar="npcAvatar" :dismiss="navigateToTest1"
			:description="description">
		</onboarding-chat-bubble>
	</view>
</template>
<script>
	import {
		findLastName,
		getAvatar
	} from '../../scripts/locate_name';
	import OnboardingChatBubble from '/components/OnboardingChatBubble.vue';
	export default {
		components: {
			OnboardingChatBubble, // 注册组件
		},
		data() {
			return {
				userId: '',
				username: '',
				gender: '',
				selectedOptions: [],
				npcName: '',
				npcAvatar: '',
				birthday: null,
				scenarioData: null,
				background: '',
				description: '',
				jobId: '',
				firstScene: false,
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
			this.background = option.background || '';
			this.firstScene = option.firstScene || false;

			console.log('first scene?', option.firstScene || false);

			if (option.background) {
				console.log("analysing background:");
				this.npcName = findLastName(option.background);
				this.npcAvatar = getAvatar(this.npcName);
			} else {
				console.error('not passing background');
			}

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

			this.getScenarioData();
		},
		methods: {
			navigateToTest1() {
				console.log("clicked dismiss");
				const testPageUrl =
					`/pages/test/test2?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}`;

				uni.navigateTo({
					url: testPageUrl
				});
			},
			getScenarioData() {
				const requestUrl = this.firstScene ? `${this.baseURL}/start_scenario/${this.jobId}` :
					`${this.baseURL}/get_current_scenario/${this.jobId}`;

				uni.request({
					url: requestUrl,
					method: 'POST',
					success: (res) => {
						console.log('Scenario data:', res.data);
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
					this.description = this.scenarioData.scenes.description || '无法获取背景信息';
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