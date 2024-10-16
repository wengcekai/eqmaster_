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
					<text class="score-title-head">我的检测结果</text>
					<image class="header-icon" src="/static/battlefield/share.png"></image>
				</view>
				<view class="background-curve"></view>
				<image class="illustration1" :src="illustrationSrc" mode="widthFix"></image>

				<view class="card">
					<view class="average-score-container">
						<text class="score-title">情商得分: {{homepageData.response.eq_scores.score}}</text>
					</view>

					<canvas id="radarCanvas" canvas-id="radarCanvas" class="radar-canvas" width="400"
						height="400"></canvas>
					<view class="emotion-detection-box1">
						<text class="emotion-detection-title">情绪侦查力</text>
					</view>
					<view class="emotion-detection-box2">
						<text class="emotion-detection-title">社交得体度</text>
					</view>
					<view class="emotion-detection-box3">
						<text class="emotion-detection-title">沟通表达力</text>
					</view>
					<view class="emotion-detection-box4">
						<text class="emotion-detection-title">情绪掌控力</text>
					</view>
					<view class="emotion-detection-box5">
						<text class="emotion-detection-title">人际平衡力</text>
					</view>

					<view class="subtitle-container">
						<text class="subtitle">问题诊断</text>
						<image class="title-sub-line" src="/static/green.png" mode="scaleToFill"></image>
					</view>

					<view class="card-text-container">
						<text class="card-title">{{ homepageData.response.eq_scores.summary }}</text>
						<text class="card-description">{{ homepageData.response.eq_scores.overall_suggestion }}</text>
					</view>

				</view>

				<view class="card">
					<view class="subtitle-container">
						<text class="subtitle">提升指南</text>
						<image class="title-sub-line" src="/static/green.png" mode="scaleToFill"></image>
					</view>
					<image class="illustration4" src="/static/star.png" mode="widthFix"></image>
					<image class="illustration5" src="/static/up.png" mode="widthFix"></image>
					<image class="illustration6" src="/static/up3.png" mode="widthFix"></image>

					<view class="card-text-container">
						<text class="card-title">{{ homepageData.response.eq_scores.detail_summary }}</text>
						<text class="card-description">{{ homepageData.response.eq_scores.detail }}</text>

					</view>
				</view>

				<!-- 添加白色卡片2 -->
				<view class="card">
					<view class="subtitle-container">
						<text class="subtitle">详细报告</text>
						<image class="title-sub-line" src="/static/green.png" mode="scaleToFill"></image>
					</view>
					<!-- 维度一 -->
					<view class="score-container1">
						<text class="score-title1">情绪侦查力</text>
						<view class="progress-container">
							<view class="progress-bar1">
								<view class="progress"
									:style="{ width: progressWidth(homepageData.response.eq_scores.dimension1_score) }">
								</view>
							</view>
							<text class="score-title2">{{ homepageData.response.eq_scores.dimension1_score }}%</text>
						</view>
						<text class="card-description">{{ homepageData.response.eq_scores.dimension1_detail }}</text>
					</view>

					<!-- 维度二 -->
					<view class="score-container1">
						<text class="score-title1">社交得体度</text>
						<!-- 进度条 -->
						<view class="progress-container">
							<view class="progress-bar1">
								<view class="progress"
									:style="{ width: progressWidth(homepageData.response.eq_scores.dimension2_score) }">
								</view>
							</view>
							<text class="score-title2">{{ homepageData.response.eq_scores.dimension2_score }}%</text>
						</view>
						<text class="card-description">{{ homepageData.response.eq_scores.dimension2_detail }}</text>
					</view>
					<image v-if="!isExpanded" @click="expand" src="/static/expand.png" class="expand-image">
					</image>

					<view v-if="!isExpanded" class="bottom">
						<text class="bottom-text">-到底啦-</text>
					</view>

					<template v-if="isExpanded">
						<view class="score-container1">
							<text class="score-title1">情绪掌控力</text>
							<!-- 进度条 -->
							<view class="progress-container">
								<view class="progress-bar1">
									<view class="progress"
										:style="{ width: progressWidth(homepageData.response.eq_scores.dimension3_score) }">
									</view>
								</view>
								<text
									class="score-title2">{{ homepageData.response.eq_scores.dimension3_score }}%</text>
							</view>
							<text
								class="card-description">{{ homepageData.response.eq_scores.dimension3_detail }}</text>
						</view>

						<view class="score-container1">
							<text class="score-title1">沟通表达力</text>
							<!-- 进度条 -->
							<view class="progress-container">
								<view class="progress-bar1">
									<view class="progress"
										:style="{ width: progressWidth(homepageData.response.eq_scores.dimension4_score) }">
									</view>
								</view>
								<text
									class="score-title2">{{ homepageData.response.eq_scores.dimension4_score }}%</text>
							</view>
							<text
								class="card-description">{{ homepageData.response.eq_scores.dimension4_detail }}</text>
						</view>

						<view class="score-container1">
							<text class="score-title1">人际平衡力</text>
							<!-- 进度条 -->
							<view class="progress-container">
								<view class="progress-bar1">
									<view class="progress"
										:style="{ width: progressWidth(homepageData.response.eq_scores.dimension5_score) }">
									</view>
								</view>
								<text
									class="score-title2">{{ homepageData.response.eq_scores.dimension5_score }}%</text>
							</view>
							<text
								class="card-description">{{ homepageData.response.eq_scores.dimension5_detail }}</text>
						</view>
						<vew class="place-holder"></vew>
					</template>
				</view>
				<button class="guide-button" @click="navigateToGuide">开启高情商之旅</button>

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
				console.log('results for backgrounds:', scores);
				const minScore = Math.min(scores.dimension1_score, scores.dimension2_score, scores.dimension3_score, scores
					.dimension4_score, scores.dimension5_score);

				// 根据最低分选择图片
				if (minScore === scores.dimension1_score) {
					console.log("illustration src:", '1')
					return '/static/aniimals/kapibala.png';
				} else if (minScore === scores.dimension2_score) {
					console.log("illustration src:", '2')
					return '/static/aniimals/houzi.png';
				} else if (minScore === scores.dimension3_score) {
					console.log("illustration src:", '3')
					return '/static/aniimals/ciwei.png';
				} else if (minScore === scores.dimension4_score) {
					console.log("illustration src:", '4')
					return '/static/aniimals/tuoniao.png';
				} else if (minScore === scores.dimension5_score) {
					console.log("illustration src:", '5')
					return '/static/aniimals/lang.png';
				}
			}
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
					}
				});
			} catch (e) {
				console.log('something error happened', e)
			}
		},
		onUnload() {
		},
		onReady() {
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
			this.drawRadar();
		},
		methods: {
			progressWidth(value) {
				// 计算进度条宽度百分比
				const percentage = (value / this.maxScore) * 100;
				// console.log('${percentage}%：', `${percentage}%`)
				return `${percentage}%`;
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
					url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData.response.personal_info.job_id}`
				});
			},
			expand() {
				this.isExpanded = true; // 只展开，不再收起
			},
		},
	};
</script>

<style scoped>
	.container {
		position: relative;
		background-color: #2F2F38;
		/* display: flex; */
		flex-direction: column;
		align-items: center;
		padding-top: 100rpx;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		z-index: 6;
		width: 90%;
		margin-top: 0.5vh;
	}

	.header-icon {
		width: 50rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Splash screen styles */
	.splash-screen {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #000000;
		/* 黑色背景 */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		/* 确保splash screen在最上层 */
	}

	.splash-text {
		color: #FFFFFF;
		font-size: 40rpx;
		text-align: left;
		top: 20%;
		position: absolute;
		margin-bottom: 20rpx;
		/* 添加文本和图像之间的空间 */
		line-height: 40rpx;
		/* 调整高以提高可读性 */
		white-space: pre-wrap;
		/* 确保文本正确换行 */
		font-weight: bold;
	}

	.splash-progress-text {
		position: absolute;
		top: 70vh;
		font-size: 40rpx;
		color: #9EE44D;
		font-weight: bold;
		margin-top: 100rpx;
	}

	.splash-progress-bar {
		width: 20%;
		position: absolute;
		height: 20rpx;
		top: 78vh;
		background-color: #3d3d3d;
		/* 背景颜色 */
		border-radius: 15rpx;
		margin: 20rpx 0;
		overflow: hidden;
	}

	.splash-progress-fill {
		height: 100%;
		background-color: #9EE44D;
		/* 进度条颜色 */
		border-radius: 15rpx;
	}

	.splash-image {
		width: 2000rpx;
		/* 放大图片的宽度 */
		height: auto;
		/* 保持纵横比 */
		margin-top: 20rpx;
		/* 在图像上方添加一些空间 */
		position: absolute;
		/* 绝对定位以便移动 */
	}


	.content {
		display: flex;
		/* 避免 flex 布局干扰 */
		flex-direction: column;
		align-items: center;
		margin-left: 20px;
		margin-right: 20px;
	}

	.background-curve {
		width: 200%;
		height: 500rpx;
		background-color: #2F2F38;
		border-radius: 70%;
		position: absolute;
		top: -100rpx;
		left: -300rpx;
		transform: rotate(35deg);
		z-index: 5;
	}

	.illustration1 {
		width: 800rpx;
		height: auto;
		position: relative;
		z-index: 10;
		top: -5px;
		left: 0px;
		margin-top: 80rpx;
		margin-bottom: 0rpx;
	}

	.illustration4 {
		width: 70rpx;
		position: absolute;
		top: 10px;
		right: 33%;
	}

	.illustration5 {
		width: 200rpx;
		height: auto;
		top: 0;
		position: absolute;
		opacity: 0.7;
		right: 20rpx;
	}

	.illustration6 {
		width: 400rpx;
		height: 200rpx;
		height: auto;
		position: absolute;
		opacity: 0.5;
		bottom: 20rpx;
		right: 50rpx;
	}

	.card {
		width: 90%;
		background-color: #373742;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 6;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60rpx 30rpx 0rpx 30rpx;
		margin-bottom: 30rpx;
	}

	.score-title-head {
		font-size: 40rpx;
		font-weight: bold;
		color: #FFFFFF;
		z-index: 6;
	}

	.score-title {
		font-size: 45rpx;
		font-weight: bold;
		color: #fff;
	}

	.score-title1 {
		font-size: 36rpx;
		color: #FFFFFF;
		margin-bottom: 5rpx;
	}

	.score-title2 {
		font-size: 30rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin-left: 5px;
	}

	.score-container1 {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: 80rpx;
	}

	.score-details {
		display: flex;
		align-items: baseline;
		margin-bottom: 20rpx;
		margin-top: 20rpx;
		width: 100%;
	}

	.score-value-large {
		font-size: 80rpx;
		font-weight: bold;
		color: #9EE44D;
		margin-right: 5rpx;
	}

	.score-value-small {
		font-size: 40rpx;
		font-weight: normal;
		color: #9EE44D;
		position: absolute;
		top: 40rpx;
		left: 120rpx;
	}

	.progress-bar {
		width: 100%;
		height: 25rpx;
		background-color: rgba(125, 123, 126, 0.5);
		/* 设置透明度为50% */
		border-radius: 25rpx;
		overflow: hidden;
		margin-top: 5rpx;
	}

	.status-text {
		position: absolute;
		top: 71vh;
		font-size: 40rpx;
		color: #9EE44D;
		margin-top: 20rpx;
	}

	.progress-bar1 {
		width: 85%;
		height: 15rpx;
		background-color: #7d7b7e;
		border-radius: 15rpx;
		overflow: hidden;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
	}

	.progress {
		height: 100%;
		background-color: #9EE44D;
	}

	.radar-canvas {
		width: 300px;
		height: 300px;
	}

	.card-content {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 40rpx;
	}

	.emoji {
		width: 60rpx;
		height: auto;
		margin-right: 10rpx;
	}

	.card-text-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: 30px;
	}

	.icon-text-box {
		display: flex;
		align-items: center;
	}

	.text-box,
	.text-box1 {
		display: inline-flex;
		align-items: center;
		border: 1rpx solid #373742;
		padding: 5rpx 10rpx;
		border-radius: 10rpx;
		background-color: #373742;
		box-shadow: 0 0 12rpx 0rpx rgba(0, 0, 0, 0.3);
		/* margin: 10rpx; */
	}

	.text-box1 {
		padding: 10rpx;
		box-shadow: none;
		margin: 0rpx 10rpx 10rpx 10rpx;
	}

	.card-title {
		font-size: 28rpx;
		background-color: #EDFB8B;
		margin-bottom: 10rpx;
		padding: 20rpx;
		text-align: left;
		max-width: 80%;
		border-radius: 20rpx 20rpx 20rpx 0rpx;
	}


	.card-title2 {
		font-size: 28rpx;
		/* color: #252529; */
		background-color: #9EE44D;
		margin-bottom: 10rpx;
		margin-top: 20rpx;
		padding: 10px;
		border-radius: 20rpx 20rpx 20rpx 0rpx;
		/* 左上角方角，其他三个角为圆角 */
	}

	.card-title1 {
		font-size: 32rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin: 3vh;
	}

	.logo {
		width: 300rpx;
		height: 300rpx;
		position: absolute;
		top: 11%;
		left: 50%;
		transform: translate(-50%, -50%);
		/* 同时水平和垂直居中 */
	}

	.card-description {
		font-size: 32rpx;
		color: #FFFFFF;
		line-height: 1.5;
		margin-top: 10rpx;
		text-align: left;
		z-index: 10;
	}

	.guide-button {
		width: 80%;
		height: 100rpx;
		background-color: #9EE44D;
		color: #252529;
		font-size: 36rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		/* margin-bottom: 30rpx; */
		z-index: 1000;
		/* 确保按钮悬浮在其他内容之上 */
		position: fixed;
		/* 固定定位 */
		bottom: 40px;
		transform: translateX(-50%);
		/* 调整水平位置以居中 */
		left: 50%;
		/* 水平居中 */
	}



	.debug-info {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		padding: 5px;
		font-size: 10px;
		z-index: 100;
		max-height: 50vh;
		overflow-y: auto;
	}

	.debug-info text {
		display: block;
		margin-bottom: 2px;
	}

	.emotion-detection-box1,
	.emotion-detection-box2,
	.emotion-detection-box3,
	.emotion-detection-box4,
	.emotion-detection-box5 {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
	}

	.emotion-detection-box1 {
		top: 115px;
	}

	.emotion-detection-box2 {
		top: 210px;
		left: 38%;
	}

	.emotion-detection-box3 {
		top: 360px;
		right: 30%;
	}

	.emotion-detection-box4 {
		top: 360px;
		left: 30%;
	}

	.emotion-detection-box5 {
		top: 210px;
		right: 38%;
	}

	.emotion-detection-title {
		font-size: 22rpx;
		color: #FFFFFF;
		font-weight: bold;
		background-color: #4A4A57;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
	}

	.green-circle {
		position: absolute;
		width: 45rpx;
		height: 45rpx;
		background-color: #9EE44D;
		border-radius: 50px;
		top: 95px;
		z-index: 30;
		border: 3rpx solid #FFFFFF;
		/* 添加白色边框 */

	}

	.green-circle1 {
		position: absolute;
		width: 22rpx;
		height: 22rpx;
		background-color: #b3bec1;
		border-radius: 50px;
		top: 102px;
		/* z-index: 3; */
	}

	.expand-button {
		color: #9EE44D;
		/* 按钮文字颜色 */
		border: none;
		/* 去掉边框 */
		padding: 0;
		/* 去掉内边距 */
		text-align: center;
		/* 文字居中 */
		text-decoration: underline;
		/* 添加下划线以突出显示 */
		display: inline;
		/* 使按钮为行内元素 */
		font-size: 16px;
		/* 字体大小 */
		margin: 0;
		/* 掉外边距 */
		cursor: pointer;
		/* 鼠标悬停时显示手型 */
		background-color: #373742;
	}

	.expand-button:hover {
		color: #9EE44D;
		/* 悬停时的文字颜色 */
		text-decoration: underline;
		/* 悬停时保持下划线 */
	}

	.expand-image {
		width: 150rpx;
		/* Adjust the width to your desired size */
		height: 60rpx;
		/* Adjust the height to your desired size */
		cursor: pointer;
		/* Make it clickable */
		margin: 0 auto;
		/* Center it */
		bottom: 30px;
	}

	.average-score-container {
		width: 90%;
		height: 100rpx;
		display: flex;
		overflow: visible;
		justify-content: center;
		align-items: center;
		background-image: url("/static/eq_score_bg.png");
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.title-sub-line {
		width: 100%;
		height: 5px;
		position: absolute;
		bottom: 5rpx;
		z-index: 6;
		opacity: 0.8;
		overflow: visible;
	}

	.subtitle-container {
		overflow: visible;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 2vh;
		z-index: 6;
		position: relative;
		/* 添加这个 */
	}

	.subtitle {
		font-weight: bold;
		font-size: 35rpx;
		color: #fff;
		z-index: 7;
	}

	.progress-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.bottom {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 4vh;
		margin-bottom: 4vh;
	}

	.bottom-text {
		color: #67677A;
		font-weight: 400;
		font-size: 14px;
	}

	.place-holder {
		width: 100%;
		height: 5vh;
	}
</style>