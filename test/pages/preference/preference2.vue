<template>
	<view class="container">
		<view class="text-content">
			<text class="question">🤔 In which situations would you like to enhance your EQ?</text>
			<!-- <text class="question1">个性化偏好</text> -->
		</view>


		<view class="options-container">
			<view class="option-group">
				<view class="group-icon">
					<image class="icon" src="/static/onboarding/career.png" mode="widthFix" />
					<text class="iconDescribe">Career</text>
				</view>
				<view class="option-buttons">
					<button v-for="(option, index) in jobOptions" :key="index"
						:class="['option-button', `button-${index + 1}`, { active: selectedOptions.includes(option) }]"
						@click="toggleOption(option)">
						{{ option }}
					</button>
				</view>
			</view>

			<view class="option-group">
				<view class="group-icon">
					<image class="icon" src="/static/onboarding/dating.png" mode="widthFix" />
					<text class="iconDescribe">Dating</text>
				</view>
				<view class="option-buttons">
					<button v-for="(option, index) in relationshipOptions" :key="index"
						:class="['option-button', `button-${index + 1}`, { active: selectedOptions.includes(option) }]"
						@click="toggleOption(option)">
						{{ option }}
					</button>
				</view>
			</view>
		</view>

	</view>

	<view class="button-container">
		<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @click="goToNextPage()"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				jobOptions: ['Fitting in', 'Upward Management', 'Networking', 'Write better emails',
					'awkward team bonding activities'
				],
				relationshipOptions: ['Maintaining healthy relationships', 'The plateau phase', 'Lovesick crush',
					'Handling Heartbreak'
				],
				selectedOptions: [],
				userId: '',
				username: '',
				gender: '',
				birthday: null,
			};
		},
		onLoad(options) {
			// 接收上一页传递的参数
			this.userId = options.userId;
			this.username = decodeURIComponent(options.username);
			this.gender = options.gender;
			const defaultBirthday = {
				year: 2000,
				month: 1,
				day: 1
			}; // 设置默认值
			if (options.birthday) {
				try {
					this.birthday = JSON.parse(decodeURIComponent(options.birthday));
				} catch (e) {
					console.error('JSON 解析错误:', e);
					this.birthday = defaultBirthday; // 解析错误时使用默认生日
				}
			} else {
				this.birthday = defaultBirthday; // 如果 birthday 为空，设置默认值
			}
			console.log('Received data:', {
				userId: this.userId,
				username: this.username,
				gender: this.gender,
				birthday: this.birthday
			});
		},
		methods: {
			toggleOption(option) {
				const index = this.selectedOptions.indexOf(option);
				if (index > -1) {
					this.selectedOptions.splice(index, 1);
				} else {
					this.selectedOptions.push(option);
				}
				console.log('Selected options:', this.selectedOptions);
			},
			goToNextPage() {
				if (this.selectedOptions.length > 0) {
					// 构建包含所有信息的URL
					const url =
						`/pages/preference/preference3?userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}`;

					console.log('Navigating to:', url);
					uni.navigateTo({
						url: url,
						fail: (err) => {
							console.error('Navigation failed:', err);
							uni.showToast({
								title: '页面跳转失败',
								icon: 'none'
							});
						}
					});
				} else {
					console.log('No options selected');
					uni.showToast({
						title: '请至少选择一个选项',
						icon: 'none'
					});
				}
			}
		}
	};
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
		margin-bottom: 40px;
	}

	.icon {
		width: 38rpx;
		height: auto;
	}

	.iconDescribe {
		color: #fff;
		font-weight: bold;
		font-size: 34rpx;
		line-height: 44rpx;
		margin-left: 16rpx;
		font-family: Arial;
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

	.options-container {
		margin-left: 5px;
		margin-top: 30rpx;
		width: 100%;
		margin-bottom: 20px;
	}

	.option-group {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 30rpx;
		margin-bottom: 30rpx;
	}

	.group-icon {
		/* width: 100%; */
		/* height: 65rpx; */
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.option-buttons {
		width: 80%;
		height: 25vh;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-start;
		align-content: flex-start;
		/* align-content: flex-start; */
		gap: 20rpx;
		row-gap: 30rpx;
	}

	.option-button {
		background-color: #2c2c2e;
		color: #ffffff;
		border-radius: 25px;
		padding-left: 20rpx;
		font-size: 30rpx;
		font-family: Arial;
		font-weight: 500;
		margin: 0;
		line-height: 70rpx;
	}

	.option-button.active {
		background-color: #8BC34A;
	}
</style>