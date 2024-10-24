<template>
	<view class="container">
		<scroll-view scroll-y style="height: 100%;">
			<view class="content">
				<!-- <view class="debug-info"> -->
				<!-- 如需调试信息，可取消注释以下行 -->
				<!-- <text>homepageData: {{ JSON.stringify(homepageData) }}</text> -->
				<!-- </view> -->
				<view class="header">
					<image class="header-icon" src="/static/back.png"></image>
					<text class="score-title-head">My career personality type</text>
					<image class="header-icon" src="/static/battlefield/share.png"></image>
				</view>
				<view class="background-curve">
					<view class="animal-box">
						<view class="animal-name" :style="{ backgroundImage: `url(${illustrationSrc.animal_name_bg})` }">
							{{ illustrationSrc.animal_name }}
						</view>
						<image class="animal-icon" :src="illustrationSrc.animal_icon"></image>
						<view class="animal-score">
							<view class="animal-score-title">
								EQ points
							</view>
							<view class="animal-score-desc" :style="{ backgroundImage: `url(/static/resulten/animal-name-3.png)` }">
								{{homepageData.response.eq_scores.score}}/100
							</view>
						</view>
						<view class="animal-desc" :style="{ backgroundImage: 'url(/static/resulten/quote.png)' }">
							<view class="card-text-container">
								<!-- <text class="card-title">{{ homepageData.response.eq_scores.summary }}</text>
								<text class="card-description">{{ homepageData.response.eq_scores.overall_suggestion }}</text> -->
								<text class="card-title">{{ illustrationSrc.weakness }}</text>
								<text class="card-description">{{ illustrationSrc.characteristics }}</text>
							</view>
						</view>
					</view>
				</view>

				<view class="overview-container">
					<view class="overview">
						<view class="overview-title">Overview</view>
						<view class="overview-content">
							<image class="overview-content-icon" src="/static/resulten/pattern.svg"></image>
							<view class="overview-content-item">
								<view class="overview-content-title">
									{{ homepageData.response.eq_scores.detail_summary }}
								</view>
								<view class="overview-content-detail">
									{{ homepageData.response.eq_scores.detail }}
								</view>
							</view>
							<view class="speed-right">
								<view class="speed-title">
									self awareness
								</view>
								<view class="">
									<view class="blood-container">
										<view class="health-bar-container">
											<view class="health-bar-line"></view>
											<view class="health-bar-background">
												<view class="health-bar-foreground" :style="progressWidth(homepageData.response.eq_scores.dimension1_score, 1)">
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>

							<view class="speed-right">
								<view class="speed-title">
									self regulation
								</view>
								<view class="">
									<view class="blood-container">
										<view class="health-bar-container">
											<view class="health-bar-line"></view>
											<view class="health-bar-background">
												<view class="health-bar-foreground" :style="progressWidth(homepageData.response.eq_scores.dimension2_score)">
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>

							<view class="speed-right">
								<view class="speed-title">
									social skill
								</view>
								<view class="">
									<view class="blood-container">
										<view class="health-bar-container">
											<view class="health-bar-line"></view>
											<view class="health-bar-background">
												<view class="health-bar-foreground" :style="progressWidth(homepageData.response.eq_scores.dimension3_score)">
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>

							<view class="speed-right">
								<view class="speed-title">
									empathy
								</view>
								<view class="">
									<view class="blood-container">
										<view class="health-bar-container">
											<view class="health-bar-line"></view>
											<view class="health-bar-background">
												<view class="health-bar-foreground" :style="progressWidth(homepageData.response.eq_scores.dimension4_score)">
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>

							<view class="speed-right">
								<view class="speed-title">
									motivation
								</view>
								<view class="">
									<view class="blood-container">
										<view class="health-bar-container">
											<view class="health-bar-line"></view>
											<view class="health-bar-background">
												<view class="health-bar-foreground" :style="progressWidth(homepageData.response.eq_scores.dimension5_score)">
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="improved-container">
					<view class="improved">
						<view class="improved-title">To be improved:</view>
						<view class="improved-content">
							<view class="improved-content-item">
								<view class="improved-content-title">
									<image class="improved-show-icon" src="/static/resulten/awareness1.svg"></image>
									{{ homepageData.response.eq_scores.summary }}
								</view>
								<view class="improved-content-description">
									{{ homepageData.response.eq_scores.overall_suggestion }}
								</view>
							</view>
						</view>
						<view class="improved-title key-strength-title">key strength:</view>
						<view class="improved-content key-strength-content">
							<image class="key-strength-nice" src="/static/resulten/nice.png"></image>
							<view class="improved-content-item">
								<view class="improved-content-title key-strength-content-title">
									<image class="improved-show-icon" src="/static/resulten/awareness0.svg"></image>
									Self perception
								</view>
								<view class="improved-content-description">
									{{ homepageData.response.eq_scores.dimension1_detail }}
								</view>
							</view>
						</view>
						<view class="improved-content key-strength-content">
							<image class="key-strength-nice" src="/static/resulten/nice.png"></image>
							<view class="improved-content-item">
								<view class="improved-content-title key-strength-content-title">
									<image class="improved-show-icon" src="/static/resulten/regulation0.svg"></image>
									Self regulation
								</view>
								<view class="improved-content-description">
									{{ homepageData.response.eq_scores.dimension2_detail }}
								</view>
							</view>
						</view>
						<view class="improved-content key-strength-content">
							<image class="key-strength-nice" src="/static/resulten/nice.png"></image>
							<view class="improved-content-item">
								<view class="improved-content-title key-strength-content-title">
									<image class="improved-show-icon" src="/static/resulten/empathy0.svg"></image>
									Empathy
								</view>
								<view class="improved-content-description">
									{{ homepageData.response.eq_scores.dimension3_detail }}
								</view>
							</view>
						</view>
						<view class="improved-content key-strength-content">
							<image class="key-strength-nice" src="/static/resulten/nice.png"></image>
							<view class="improved-content-item">
								<view class="improved-content-title key-strength-content-title">
									<image class="improved-show-icon" src="/static/resulten/socialskill0.svg"></image>
									Social Skill
								</view>
								<view class="improved-content-description">
									{{ homepageData.response.eq_scores.dimension4_detail }}
								</view>
							</view>
						</view>
						<view class="improved-content key-strength-content">
							<image class="key-strength-nice" src="/static/resulten/nice.png"></image>
							<view class="improved-content-item">
								<view class="improved-content-title key-strength-content-title">
									<image class="improved-show-icon" src="/static/resulten/motivation0.svg"></image>
									Motivation
								</view>
								<view class="improved-content-description">
									{{ homepageData.response.eq_scores.dimension5_detail }}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="guide-button-container">
					<button class="guide-button" @click="navigateToGuide">My customized courses</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		drawRadar
	} from '../../scripts/draw_radar';
	export default {
		data() {
			return {
				score: 28, // 示例分数，可根据需要动态更改
				maxScore: 100, // 假设最大分数为100
				userId: '',
				username: '',
				gender: '',
				birthday: null,
				homepageData: {
					response: {
						personal_info: {
							name: '',
							tag: '',
							tag_description: '',
							job_id: ''
						},
						eq_scores: {
							score: 0,
							dimension1_score: 0,
							dimension1_detail: '',
							dimension2_score: 0,
							dimension2_detail: '',
							dimension3_score: 0,
							dimension3_detail: '',
							dimension4_score: 0,
							dimension4_detail: '',
							dimension5_score: 0,
							dimension5_detail: '',
							summary: '',
							detail: '',
							overall_suggestion: '',
							detail_summary: ''
						},
						contacts: []
					}
				},
				progress: 0,
				imageWidth: 2000,
				isExpanded: false, // 默认收起状态
			};
		},
		computed: {
			formattedBirthday() {
				if (this.birthday) {
					const date = new Date(this.birthday.year, this.birthday.month - 1, this.birthday.day);
					return date.toLocaleDateString();
				}
				return '未设置';
			},
			illustrationSrc() {
				const scores = this.homepageData.response.eq_scores;
				const minScore = Math.min(scores.dimension1_score, scores.dimension2_score, scores.dimension3_score, scores
					.dimension4_score, scores.dimension5_score);
				
				let returnObj = {
					animal_name: 'Capypara',
					animal_icon: '/static/resulten/monkey.png',
					animal_name_bg: '/static/resulten/animal-name-1.png',
					weakness: 'Weakness',
					characteristics: '',
				}

				// 根据最低分选择图片
				if (minScore === scores.dimension1_score) { //Capypara 水豚
					console.log("illustration src:", '1')
					returnObj = {
						animal_name: 'Capypara',
						animal_icon: '/static/resulten/capybara.png',
						animal_name_bg: '/static/resulten/animal-name-1.png',
						weakness: 'Motivation',
						characteristics: 'The capybara reflects a laid-back nature, symbolizing challenges in motivation.',
					}
					// return '/static/aniimals/kapibala.png';
				} else if (minScore === scores.dimension2_score) {//hedgehog 刺猬
					console.log("illustration src:", '2')
					returnObj = {
						animal_name: 'hedgehog',
						animal_icon: '/static/resulten/hedgehog.png',
						animal_name_bg: '/static/resulten/animal-name-1.png',
						weakness: 'Empathy',
						characteristics: 'The hedgehog represents self-protection, symbolizing difficulty perceiving emotions.',
					}
				} else if (minScore === scores.dimension3_score) {//Coyote 狼
					console.log("illustration src:", '3')
					returnObj = {
						animal_name: 'Coyote',
						animal_icon: '/static/resulten/coyote.png',
						animal_name_bg: '/static/resulten/animal-name-1.png',
						weakness: 'Social Skill',
						characteristics: 'The coyote reflects independence, symbolizing challenges in social connections.',
					}
				} else if (minScore === scores.dimension4_score) {//Ostrich 鸵鸟
					console.log("illustration src:", '4')
					returnObj = {
						animal_name: 'Ostrich',
						animal_icon: '/static/resulten/ostrich.png',
						animal_name_bg: '/static/resulten/animal-name-1.png',
						weakness: 'Perception',
						characteristics: 'The ostrich reflects avoidance, symbolizing difficulty recognizing emotions.',
					}
				} else if (minScore === scores.dimension5_score) {//Monkey 猴子
					console.log("illustration src:", '5')
					returnObj = {
						animal_name: 'Monkey',
						animal_icon: '/static/resulten/monkey.png',
						animal_name_bg: '/static/resulten/animal-name-1.png',
						weakness: 'Self-regulation',
						characteristics: 'The monkey represents impulsiveness, symbolizing difficulty controlling emotions.',
					}
				}
				return returnObj;
			},
		},
		onLoad(option) {
			console.log('option', option);
			// 接收上一个页面传递的数据
			this.userId = option.userId || '';
			this.username = decodeURIComponent(option.username || '');
			try {
				uni.getStorage({
					key: 'response',
					success: (res) => {
						console.log('########successfully retrieved data', res);
						this.homepageData = res.data;
						console.log('begin to draw radar');
						this.drawRadar();
					}
				});
			} catch (e) {
				console.log('something error happened', e)
			}
			// 确保数据已经准备好
			if (!this.username) {
				uni.getStorage({
					key: 'username',
					success: (res) => {
						this.username = res.data;
						console.log('Username from storage:', this.username);
					},
					fail: () => {
						console.error('Failed to get username from storage');
					}
				});
			}
		},
		onUnload() {
		},
		onReady(option) {
			console.log('option', option);
		},
		methods: {
			progressWidth(value, isOne) {
				console.log(value);
				const percentage = value;
				const color = isOne ? '#EA833D' : '#23A06B';
				const width = `${percentage}%`;
				return {
					width,
					backgroundColor: color,
					transition: 'width 0.5s ease, background-color 0.5s ease'
				};
			},
			circleLeftPosition(value) {
				// 获取进度条实际宽度
				const percentage1 = (value / this.maxScore) * 100;
				const progressBarWidth = uni.getSystemInfoSync().windowWidth * 0.8; // 80%的屏幕宽度作为进度条的实际宽度
				console.log(percentage1)
				return (percentage1 / 100) * progressBarWidth;
			},

			drawRadar() {
				console.log('======begin to draw radar chart, data:', this.homepageData.response);
				const data = [{
						subject: '维度1',
						A: this.homepageData.response.eq_scores.dimension1_score || 0,
						fullMark: 100
					},
					{
						subject: '维度2',
						A: this.homepageData.response.eq_scores.dimension2_score || 0,
						fullMark: 100
					},
					{
						subject: '维度3',
						A: this.homepageData.response.eq_scores.dimension3_score || 0,
						fullMark: 100
					},
					{
						subject: '维度4',
						A: this.homepageData.response.eq_scores.dimension4_score || 0,
						fullMark: 100
					},
					{
						subject: '维度5',
						A: this.homepageData.response.eq_scores.dimension5_score || 0,
						fullMark: 100
					}
				];
				console.log("Draw radar started");
				drawRadar('radarCanvas', data);
				console.log("Draw radar stopped");
			},
			navigateToGuide() {
				console.log('Navigating to guide with data:', {
					userId: this.userId,
					username: this.username,
					jobId: this.homepageData.response.personal_info.job_id
				});
				uni.navigateTo({
					url: `/pages/dashboard/dashboard_en?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData.response.personal_info.job_id}`
				});
			},
			expand() {
				this.isExpanded = true; // 只展开，不再收起
			},
		},
	};
</script>

<style scoped>
	@font-face {
	font-family: 'Poppins Italic';
	src: url('/static/fonts/Poppins-Italic.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
	}
	.container {
		/* position: absolute; */
		/* position: fixed; */
		background-color: #2F2F38;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* padding-top: 88rpx; */
		width: 100%;
		height: 100vh;
		overflow: hidden;
		left: 0;
		/* -webkit-overflow-scrolling: touch; */
	}

	.header {
		position: absolute;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		z-index: 6;
		width: 95%;
		height: 104rpx;
		padding-top: 88rpx;
	}

	.header-icon {
		width: 50rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	
	.content {
		display: flex;
		/* 避免 flex 布局干扰 */
		flex-direction: column;
		align-items: center;
		padding-bottom: 106px;
		/* margin-left: 20px;
		margin-right: 20px; */
	}

	.background-curve {
		width: 100%;
		height: 848rpx;
		position: relative;
		z-index: 5;
		display: flex;
		overflow: hidden; /* Changed from visible to hidden */
		/* justify-content: center;
		align-items: center; */
		background-image: url("/static/resulten/header-bg.png");
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.animal-box {
		display: flex;
	}
	.animal-name {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 125.57px;
		height: 31px;
		top: 258rpx;
		left: 32rpx;
		background-image: none;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		font-family: 'Poppins Italic', sans-serif;
		font-size: 40rpx;
		color: #FDEDC8;
		font-weight: 600;
	}
	.animal-icon {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 220rpx;
		left: 400rpx;
		width: 296rpx;
		height: 300rpx;
	}
	.animal-score {
		display: block;
		position: absolute;
		top: 404rpx;
		left: 32rpx;
	}
	.animal-score-title {
		font-size: 26rpx;
		font-weight: 400;
		color: #D7D8E0;
		margin-left: 20rpx;
		margin-bottom: 14rpx;
	}
	.animal-score-desc {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 173.14rpx;
		height: 60rpx;

		background-image: none;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		font-family: 'Poppins';
		font-size: 36rpx;
		font-family: 'Poppins Italic', sans-serif;
		color: #FDEDC8;
		font-weight: 600;
	}
	.animal-desc {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 686rpx;
		height: 236rpx;
		top: 580rpx;
		left: 32rpx;
		background-image: none;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		font-family: 'Poppins';
		font-size: 40rpx;
		color: #FFA1FC;
		font-weight: 600;
	}

	.card-text-container {
		display: flex;
		height: 100%;
		flex-direction: column;
		padding: 8rpx 32rpx;
		justify-content: center;
		margin-top: 25rpx;
		/* align-items: center; */
	}

	.score-title-head {
		font-size: 40rpx;
		font-weight: bold;
		color: #FFFFFF;
		z-index: 6;
	}


	.card-title {
		font-size: 34rpx;
		color: #E8FFC4;
	}

	.card-description {
		font-size: 28rpx;
		font-weight: 400;
		color: #FFFFFF;
		margin-top: 16rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.overview-container {
		display: flex;
		position: relative;
		background-color: #1B5A50;
		width: 686rpx;
		height: auto;
		margin-top: 32rpx;
		border-radius: 32rpx;
	}
	.overview {
		/* width: 100%; */
		padding: 16rpx;
	}
	.overview-title {
		font-size: 40rpx;
		font-weight: 600;
		color: #E8FFC4;
		margin-left: 16rpx;
	}
	.overview-content {
		position: relative;
		display: block;
		width: 654rpx;
		height: auto;
		background-color: #C6DBB8;
		border-radius: 32rpx;
		margin-top: 44rpx;
		/* padding-left: 32rpx;
		padding-left: 32rpx; */
	}
	.overview-content-icon {
		position: absolute;
		top: -20rpx;
		left: 64rpx;
		width: 526rpx;
		height: 50rpx;
	}
	.overview-content-item {
		padding: 60rpx 32rpx 32rpx 32rpx;
		display: block;
	}
	.overview-content-title {
		font-size: 34rpx;
		color: #2F2F38;
		font-weight: 600;
	}
	.overview-content-detail {
		margin-top: 16rpx;
		font-size: 30rpx;
		color: #373742;
		font-weight: 400;
	}

	.speed-right {
		text-align: left;
		display: block;
		font-size: 34rpx;
		/* height: 138rpx; */
		/* background-color: #9EE44D33; */
		padding: 0 32rpx;
		border-radius: 24rpx;
		color: #67677A;
		font-size: 30rpx;
		font-weight: 400;
		/* margin-top: 24rpx; */
		margin-bottom: 20rpx;
	}
	.speed-title {
		color: #373742;
	}

	.blood-container {
		height: 56rpx;
		/* padding: 20rpx 0; */
		display: flex;
		gap: 44rpx;
		/* flex-direction: column; */
		align-items: center;
	}
	
	.health-bar-container {
		width: 100%;
		height: 16rpx;
		/* margin-bottom: 10rpx; */
		position: relative;
		overflow: visible;
	}
	
	.health-bar-background {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		position: relative;
		overflow: visible;
		z-index: 3;
	}
	
	.health-bar-foreground {
		/* margin-top: 2rpx; */
		height: 100%;
		border-radius: 5px;
		position: absolute;
		top: 0;
		left: 0;
		/* 添加只在上方显示阴影的代码 */
		overflow: visible;
		box-shadow: 0 -6px 6px -3px rgba(255, 255, 255, 0.3);
	}
	
	.health-bar-line {
		position: absolute;
		left: 50%;
		width: 2rpx;
		height: 10px;
		background-color: #ffffff;
		z-index: 3;
		/* 中间的白线 */
	}

	.improved-container {
		display: flex;
		position: relative;
		background: linear-gradient(359.63deg, #2F2F38 8.92%, #3A3A45 100.62%);
		width: 686rpx;
		height: auto;
		margin-top: 32rpx;
		border-radius: 32rpx;
	}
	.improved {
		width: 100%;
		padding: 16rpx;
	}
	.improved-title {
		height: 88rpx;
		font-size: 40rpx;
		font-weight: 600;
		color: #FFFFFF;
		margin-left: 16rpx;
	}
	.improved-content {
		width: 100%;
		/* height: 184px; */
		gap: 0px;
		border-radius: 24rpx;
		opacity: 0px;
		background: linear-gradient(90deg, #2C6E5F 0.52%, #50856E 99.36%);
	}
	.improved-content-item {
		padding: 60rpx 32rpx 60rpx 32rpx;
	}
	.improved-content-title {
		display: flex;
		align-items: center;
		gap: 12rpx;
		font-size: 30rpx;
		color: #FCDDB2;
		font-weight: 600;
	}
	.improved-show-icon {
		width: 40rpx;
		height: 32rpx;
	}
	.improved-content-description {
		font-size: 30rpx;
		font-weight: 400;
		color: #D7D8E0;
		margin-top: 18rpx;
	}

	.key-strength-title {
		height: 88rpx;
		display: flex;
		align-items: center;
		margin-top: 14rpx;
		font-weight: 600;
	}

	.key-strength-content {
		position: relative;
		background: #373742CC;
		border: 1px solid #67677A66;
		margin-bottom: 32rpx;
	}
	.key-strength-content-title {
		display: flex;
		align-items: center;
		color: #E8FFC4;
		gap: 12rpx;
	}
	.key-strength-nice {
		position: absolute;
		width: 184rpx;
		height: 184rpx;
		right: 16rpx;
		bottom: 0;
	}
	.guide-button-container {
		z-index: 1000;
		/* 确保按钮悬浮在其他内容之上 */
		position: fixed;
		/* 固定定位 */
		bottom: 0;
		transform: translateX(-50%);
		/* 调整水平位置以居中 */
		left: 50%;
		/* 水平居中 */
		width: 100%;
		height: 180rpx;
		background: #2F2F38;
		border-top: 1px solid #454552;
		padding-top: 24rpx;
	}
	.guide-button {
		width: 80%;
		height: 88rpx;
		background: linear-gradient(101.13deg, #EDFB8B 13.84%, #9EE44D 84.78%);
		color: #252529;
		font-size: 36rpx;
		border-radius: 50rpx;
		text-align: center;
		/* line-height: 100rpx; */
		display: flex;
		justify-content: center;
		align-items: center;
		/* margin-bottom: 30rpx; */
	}
</style>