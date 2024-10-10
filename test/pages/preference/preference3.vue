<template>
	<view class="container">
		<view class="text-content">
			<text class="question">{{ scenarioText || '让我们看看你现在适合什么情商段位' }}</text>
			<!-- <text class="question1">个性化偏好</text> -->
		</view>


		<view class="card">
			<image class="card-image" src="/static/Group 3.png" mode="aspectFit" />
			<button class="start-button" @click="startTest"><text class="arrow">开始测试 ↗</text></button>
		</view>
	</view>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';

	export default defineComponent({
		data() {
			return {
				scenarioText: '',
				userId: '',
				username: '',
				gender: '',
				// 显式指定 `birthday` 的类型
				birthday: null as { month : string; day : number; year : number } | null,
				// 显式指定 `selectedOptions` 为字符串数组
				selectedOptions: [] as string[]
			};
		},
		onLoad(options : any) {
			console.log('Raw options received in preference3:', options);

			this.userId = options.userId || '';
			this.username = decodeURIComponent(options.username || '');
			this.gender = options.gender || '';

			console.log('Parsed basic data in preference3:', {
				userId: this.userId,
				username: this.username,
				gender: this.gender
			});

			// 解析 birthday
			try {
				this.birthday = options.birthday ? JSON.parse(decodeURIComponent(options.birthday)) : null;
				console.log('Parsed birthday in preference3:', this.birthday);
			} catch (e) {
				console.error('Error parsing birthday in preference3:', e);
				console.log('Raw birthday data in preference3:', options.birthday);
				this.birthday = null;
			}

			// 解析 selectedOptions
			try {
				const parsedOptions = options.options ? JSON.parse(decodeURIComponent(options.options)) : [];
				console.log('Parsed options:', parsedOptions);

				// 使用显式类型赋值，避免类型错误
				this.selectedOptions = Array.isArray(parsedOptions) ? parsedOptions : [];

				console.log('Assigned selectedOptions:', this.selectedOptions);
				console.log('selectedOptions length:', this.selectedOptions.length);
				console.log('selectedOptions contents:', JSON.stringify(this.selectedOptions));
			} catch (e) {
				console.error('Error parsing selectedOptions in preference3:', e);
				console.log('Raw options data in preference3:', options.options);
				this.selectedOptions = [];
			}

			// 打印最终的数据状态
			// console.log('Final data state in preference3:', {
			//   userId: this.userId,
			//   username: this.username,
			//   gender: this.gender,
			//   birthday: this.birthday,
			//   selectedOptions: this.selectedOptions
			// });

			if (!this.userId || !this.username || !this.gender || !this.birthday || this.selectedOptions.length === 0) {
				console.error('Some required data is missing or invalid in preference3');
			}
		},
		methods: {
			startTest() {
				console.log('Start test button clicked');
				this.navigateToNextPage();
			},
			navigateToNextPage() {
				const testPageUrl = `/pages/test/test?userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}`;

				console.log('Navigating to:', testPageUrl);

				uni.navigateTo({
					url: testPageUrl,
					success: () => {
						console.log('Navigation to test page successful');
					},
					fail: (err) => {
						console.error('Navigation to test page failed:', err);
						uni.showToast({
							title: '页面跳转失败',
							icon: 'none'
						});
					}
				});
			}
		}
	});
</script>

<style scoped>
	@import url("common.css");

	.container {
		display: flex;
		flex-direction: column;
		background-color: #1c1c1e;
		padding: 40px 20px;
	}

	/* 文本内容设置 */
	.text-content {
	  display: flex;
	  flex-direction: column;
	  align-items: flex-start;
	  margin-top: 0px;
	  margin-bottom: 0px;
	}

	.question {
		font-size: 20px;
		color: #ffffff;
		margin-bottom: 8px;
		font-weight: bold;
	}

	.subtitle {
		font-size: 14px;
		color: #8e8e93;
	}

	.card {
		background-color: #1c1c1e;
		border-radius: 20px;
		overflow: hidden;
		margin-top: 10vh;
	}

	.card-image {
		width: 100%;
		height: 280px;
	}

	.start-button {
		position: relative;
		left: 0;
		bottom: 120rpx;
		background-color: #1c1c1e;
		border: none;
		border-radius: 20px;
		font-size: 14px;
		width: 40%;
		height: 4vh;
		color: #ffffff;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
		
	}

	.arrow {
		margin-left: 2px;
	}

	.welcome {
		font-size: 18px;
		color: #ffffff;
		margin-bottom: 8px;
	}

	/* 添加调试信息样式 */
	.debug-info {
		margin-top: 20px;
		padding: 10px;
		background-color: #2c2c2e;
		border-radius: 10px;
	}
</style>