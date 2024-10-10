<template>
	<view class="container">
		<image class="background-image" :src="backgroundImage" mode="widthFix"></image>

		<view class="text-content">
			<text class="question">你的性别是？</text>
			<!-- <text class="question1">完善个人信息</text> -->
		</view>
		

		<view class="gender-options">
			<view class="gender-option">
				<image class="gender-icon" :src="femaleIcon" @click="selectGender('female')"></image>
				<text class="gender-label">女生</text>
			</view>
			<view class="gender-option">
				<image class="gender-icon" :src="maleIcon" @click="selectGender('male')"></image>
				<text class="gender-label">男生</text>
			</view>
			<view class="gender-option">
				<image class="gender-icon" :src="otherIcon" @click="selectGender('other')"></image>
				<text class="gender-label">开放性别</text>
			</view>
		</view>

	</view>


	<view class="button-container">
		<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @tap="nextStep"></image>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				selectedGender: null,
				userId: '',
				username: '',
				backgroundImage: '/static/picture1.png', // 确保背景图片路径正确
				genderIcons: {
					female: {
						default: '/static/2.png',
						selected: '/static/2-selected.png'
					},
					male: {
						default: '/static/3.png',
						selected: '/static/3-selected.png'
					},
					other: {
						default: '/static/4.png',
						selected: '/static/4-selected.png'
					}
				}
			};
		},
		onLoad(options) {
			// 从路由参数中获取 userId 和 username
			this.userId = options.userId;
			this.username = decodeURIComponent(options.username);
			console.log('User ID:', this.userId);
			console.log('Username:', this.username);
		},
		methods: {
			selectGender(gender) {
				this.selectedGender = gender;
			},
			nextStep() {
				if (this.selectedGender) {
					// 保存性别信息
					uni.setStorageSync('gender', this.selectedGender);
					// 导航到下一页，并传递所有参数
					uni.navigateTo({
						url: `/pages/preference/preference1?userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.selectedGender}`
					});
				} else {
					uni.showToast({
						title: '请选择性别',
						icon: 'none'
					});
				}
			},
		},
		computed: {
			femaleIcon() {
				return this.selectedGender === 'female' ? this.genderIcons.female.selected : this.genderIcons.female.default;
			},
			maleIcon() {
				return this.selectedGender === 'male' ? this.genderIcons.male.selected : this.genderIcons.male.default;
			},
			otherIcon() {
				return this.selectedGender === 'other' ? this.genderIcons.other.selected : this.genderIcons.other.default;
			}
		}
	};
</script>

<style scoped>
	@import url("common.css");
	/* 容器设置 */
	.container {
		display: flex;
		flex-direction: column;
		background-color: #1c1c1e;
		padding: 40px 20px;
	}

	/* 背景图片 */
	.background-image {
		position: absolute;
		top: 40px;
		right: 0px;
		width: 30%;
		height: 100vh;
		/* 确保背景图片覆盖整个视窗 */
		z-index: 1;
		/* 确保背景图片位于内容之下 */
	}

	/* 文本内容设置 */
	.text-content {
	  display: flex;
	  flex-direction: column;
	  align-items: flex-start;
	  margin-top: 0px;
	  margin-bottom: 170px;
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

	/* 性别选项设置 */
	.gender-options {
		display: flex;
		justify-content: space-around;
		margin-top: 40px;
	}

	.gender-option {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.gender-icon {
		width: 80px;
		height: 80px;
		margin-bottom: 10px;
	}

	.gender-label {
		font-size: 14px;
		color: #ffffff;
		margin-bottom: 500px;
	}
</style>