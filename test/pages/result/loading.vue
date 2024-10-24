<template>
	<view class="container">
		<view class="splash-screen">
			<text class="splash-text">接下来，\n一起来看看你的职场人格类型吧！</text>

			<image class="splash-image" src="/static/cta-new.png" mode="widthFix"
				:style="{ left: splashImageLeft1 + 'rpx' }"></image>
			<image class="splash-image" src="/static/cta-new.png" mode="widthFix"
				:style="{ left: splashImageLeft2 + 'rpx' }"></image>

			<view class="progress-container">
				<text class="splash-progress-text">{{ progress }}%</text>
				<view class="splash-progress-bar">
					<view class="splash-progress-fill" :style="{ width: progress + '%' }"></view>
				</view>
				<text class="status-text">你的动物人格报告合成中</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				score: 28, // 示例分数，可根据需要动态更改
				maxScore: 100, // 假设最大分数为100
				userId: '',
				username: '',
				gender: '',
				birthday: null,
				selectedOptions: [],
				jobId: null,
				num: null,
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
				intervalId: null,
				progress: 0,
				progressInterval: null,
				// 新增的闪屏相关数据
				splashImageLeft1: 0,
				splashImageLeft2: 2030,
				imageWidth: 2000,
				interval: null,
				isExpanded: false, // 默认收起状态
				timeoutInterval: null,
			};
		},
		computed: {
			formattedBirthday() {
				if (this.birthday) {
					const date = new Date(this.birthday.year, this.birthday.month - 1, this.birthday.day);
					return date.toLocaleDateString();
				}
				return '未设置';
			}
		},
		onLoad(option) {
			// 接收上一个页面传递的数据
			try {
				this.userId = option.userId || '';
				this.username = decodeURIComponent(option.username || '');
				this.gender = option.gender || '';
				this.jobId = option.jobId || '';
				this.num = option.num || '';

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
					jobId: this.jobId,
					num: this.num,
				});
			} catch (e) {
				console.log("something error happened", e);
			}

			this.getHomepageData();
		},
		onUnload() {
			// 页面卸载时清除定时器
			if (this.intervalId) {
				clearInterval(this.intervalId);
			}
			if (this.progressInterval) {
				clearInterval(this.progressInterval);
			}
			if (this.interval) {
				clearInterval(this.interval);
			}
		},
		methods: {
			progressWidth(value) {
				// 计算进度条宽度百分比
				const percentage = (value / this.maxScore) * 100;
				return `${percentage}%`;
			},
			circleLeftPosition(value) {
				// 获取进度条实际宽度
				const percentage1 = (value / this.maxScore) * 100;
				const progressBarWidth = uni.getSystemInfoSync().windowWidth * 0.8; // 80%的屏幕宽度作为进度条的实际宽度
				console.log(percentage1)
				return (percentage1 / 100) * progressBarWidth;
			},
			getHomepageData() {
				// 不再需要 const that = this;
				uni.request({
					url: `https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/get_homepage/${this.userId}`,
					method: 'POST',
					success: (response) => {
						let result = {}
						if (response.statusCode === 200) {
							result = response.data;
							console.log('Homepage data received:', result);
						} else {
							let mock = {
								"response": {
									"personal_info": {
										"name": "John Doe",
										"tag": "Engineer",
										"tag_description": "A detail-oriented engineer with a passion for problem-solving.",
										"job_id": "12345"
									},
									"eq_scores": {
										"score": 46,
										"dimension1_score": 54,
										"dimension1_detail": "Shows excellent emotional regulation in stressful situations.",
										"dimension2_score": 26,
										"dimension2_detail": "Displays strong empathy towards others' feelings.",
										"dimension3_score": 42,
										"dimension3_detail": "Able to make decisions without letting emotions interfere.",
										"dimension4_score": 50,
										"dimension4_detail": "Communicates emotions clearly and effectively.",
										"dimension5_score": 44,
										"dimension5_detail": "Manages interpersonal relationships with ease.",
										"summary": "Overall, emotionally intelligent and adaptive.",
										"detail": "John demonstrates balanced emotional intelligence across all areas.",
										"overall_suggestion": "Continue to enhance emotional regulation and interpersonal communication.",
										"detail_summary": "A well-rounded emotional intelligence profile with strong interpersonal skills."
									},
								}
							};
							result = response.data;

							console.error('Failed to fetch homepage data:', response.statusCode);
						}

						if (this.interval) {
							clearInterval(this.interval);
							this.interval = null;
						}
						if (this.progressInterval) {
							clearInterval(this.progressInterval);
							this.progressInterval = null; // 修正了这里的错误
						}
						if (this.timeoutInterval) {
							clearInterval(this.timeoutInterval);
							this.timeoutInterval = null;
						}

						// 在构建 nextPageUrl 之前添加日志
						console.log('Preparing to navigate with data:', {
							jobId: this.jobId,
							userId: this.userId,
							username: this.username,
							gender: this.gender,
							birthday: this.birthday,
							selectedOptions: this.selectedOptions,
							num: this.num
						});

						const nextPageUrl =
							`/pages/result/result_en?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`;

						// 在构建 URL 后再添加一个日志
						console.log('Navigating to URL:', nextPageUrl);

						uni.setStorage({
							key: 'response',
							data: result
						});

						console.log("begin to navigate");
						uni.navigateTo({
							url: nextPageUrl,
							success: () => {
								console.log('Navigation initiated successfully');
							},
							fail: (err) => {
								console.error('Navigation failed:', err);
								uni.showToast({
									title: '页面跳转失败',
									icon: 'none'
								});
							}
						});
					},
					fail: (error) => {
						console.error('Error fetching homepage data:', error);
					},
				});
			},
			startProgress() {
				const totalDuration = 30000; // 30秒
				const intervalDuration = totalDuration / 100; // 每次更新的间隔时间

				this.progressInterval = setInterval(() => {
					if (this.progress < 100) {
						this.progress += 1;
					} else {
						clearInterval(this.progressInterval);
					}
				}, intervalDuration);
			},
			animateImage() {
				this.interval = setInterval(() => {
					// 更新两张图片的位置
					this.splashImageLeft1 -= 10; // 每次移动10rpx
					this.splashImageLeft2 -= 10;

					// 如果第一张图片完全离开屏幕，则将它的位置重置到第二张图片的后面
					if (this.splashImageLeft1 <= -this.imageWidth) {
						this.splashImageLeft1 = this.splashImageLeft2 + this.imageWidth;
					}

					// 如果第二张图片完全离开屏幕，则将它的位置重置到第一张图片的后面
					if (this.splashImageLeft2 <= -this.imageWidth) {
						this.splashImageLeft2 = this.splashImageLeft1 + this.imageWidth;
					}
				}, 30); // 每30毫秒更新一次位置
			},
			expand() {
				this.isExpanded = true; // 只展开，不再收起
			},
		},
		mounted() {
			this.startProgress(); // 开始进度条
			this.animateImage(); // 开始图片动画

			// 在设定的持续时间后隐藏闪屏（例如，30秒）
			this.timeoutInterval = setTimeout(() => {
				if (this.interval) {
					console.log("cancel splash by timeout.")
					clearInterval(this.interval);
				}
			}, 30000);
		},
		beforeDestroy() {
			// 页面销毁前清除定时器
			if (this.intervalId) {
				clearInterval(this.intervalId);
				this.intervalId = null;
			}
			if (this.progressInterval) {
				clearInterval(this.progressInterval);
				this.progressInterval = null;
			}
			if (this.interval) {
				clearInterval(this.interval);
				this.interval = null;
			}
		},
	}
</script>

<style scoped>
	.container {
		position: relative;
		background-color: #2F2F38;
		flex-direction: column;
		align-items: center;
		padding-top: 100rpx;
		width: 100%;
		height: 100vh;
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
		line-height: 60rpx;
		/* 调整高以提高可读性 */
		white-space: pre-wrap;
		/* 确保文本正确换行 */
		font-weight: bold;
	}

	.progress-container {
		position: absolute;
		top: 70vh;
		width: 70%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.splash-progress-text {
		font-size: 40rpx;
		color: #9EE44D;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.splash-progress-bar {
		width: 100%;
		height: 20rpx;
		background-color: #3d3d3d;
		border-radius: 15rpx;
		overflow: hidden;
	}

	.splash-progress-fill {
		height: 100%;
		background-color: #9EE44D;
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

	.status-text {
		position: relative;
		font-size: 40rpx;
		color: #9EE44D;
	}
</style>