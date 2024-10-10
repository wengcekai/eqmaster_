<template>
	<view class="container">
		<scroll-view scroll-y style="height: 100%;">
			<view class="content">
				<view class="card-o">
					<view class="card">
						<image class="illustration3" src="/static/diamond.png" mode="widthFix"></image>
						<text class="score-value-large-y">{{ Math.round(120) }}</text>
					</view>
					
					<view class="card">
						<image class="illustration3" src="/static/dashboard2/star.jpg" mode="widthFix"></image>
						<text class="score-value-large-g">{{ Math.round(5) }}</text>
					</view>
				</view>	
				<image class="illustration31" src="/static/dashboard2/1.jpg" mode="widthFix"></image>
				
				<view class="card1-container">
					<view class="card1">
						<text class="score-value-large1">情绪刹车术{{ }}</text>
						<view class="level-badge">
							<text class="score-title1">Lv1小试牛刀</text>
						</view>
						<view class="progress-container">
							<text class="score-title2">情绪掌控力</text>
							
							<view class="progress-bar1">
								<view class="progress"
									:style="{ width: progressWidth(homepageData.response.eq_scores.dimension3_score) }">
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<image class="xiuluochang-image" src="/static/dashboard2/xiuluochang.jpg" mode="aspectFill" />
				<image class="illustration35" src="/static/dashboard2/plgon9.jpg" mode="widthFix" @click="navigateToBattlefieldIntro"></image>
				
				<!-- <image class="illustration31" src="/static/dashboard2/1.jpg" mode="widthFix"></image> -->
				
				
				
				<view class="card3">
					<image class="illustration36" src="/static/dashboard2/icon2.jpg" mode="widthFix" @click="navigateToDashboard"></image>
					<image class="illustration37" src="/static/dashboard2/icon1.jpg" mode="widthFix" ></image>
					<image class="illustration38" src="/static/Frame3.png" mode="widthFix"></image>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				score: 28, // 示例分数，可根据需要动态改
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
				showSplash: false, // 默认不显示闪屏
				progress: 0,
				progressInterval: null,
				isExpanded: false, // 默认收起状态
				showPopup: false, // 将初始值设为 false，使弹窗在页面加载时不显示
				selectedOption: 'subordinate', // 默认选择"同事"
				// 添加同类型的标签表
				colleagueTags: ['摸鱼高手', '时间管理大师', '潜力股', '马屁精', '靠谱伙伴'],
				bossSubordinateTags: ['完美主义者', 'PUA大', '加班狂魔', '甩锅侠', '独裁者'],
				selectedTags: [],
				isProfileComplete: false, // New data property to track profile completion
				profileName: '', // New data property for profile name
				roleCards: [
					{ title: '角色卡1' },
					{ title: '角色卡2' },
					{ title: '角色卡3' },
					{ title: '角色卡4' },
					{ title: '角色卡5' },
					// 可以根据需要添加更多卡片
				],
				showNewPopup: false,
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
			currentMonth() {
				const options = { month: 'long' }; // 'long' for full month name
				return new Intl.DateTimeFormat('zh-CN', options).format(new Date());
			},
			currentDate() {
				return new Date().getDate(); // Get only the day of the month
			},
			currentTags() {
				if (this.selectedOption === 'subordinate') {
					return this.colleagueTags;
				} else if (this.selectedOption === 'supervisor' || this.selectedOption === '下属') {
					return this.bossSubordinateTags;
				} else {
					return [];
				}
			},
			canNavigateToProfile() {
				return this.profileName.trim() !== '' && this.selectedTags.length > 0;
			},
			userCard() {
				const scores = this.homepageData.response.eq_scores;
				console.log('jobid:', this.jobId);
				console.log('results for backgrounds:', scores);
				const minScore = Math.min(scores.dimension1_score, scores.dimension2_score, scores.dimension3_score, scores.dimension4_score, scores.dimension5_score);

				// 根据最低分选择图片
				if (minScore === scores.dimension1_score) {
					console.log("usercard src:", '水豚')
					return '/static/dashboard/shuitu.png';
				} else if (minScore === scores.dimension2_score) {
					console.log("usercard src:", '猴子')
					return '/static/dashboard/houzi.png';
				} else if (minScore === scores.dimension3_score) {
					console.log("usercard src:", '刺猬')
					return '/static/dashboard/ciwei.png';
				} else if (minScore === scores.dimension4_score) {
					console.log("usercard src:", '鸵鸟')
					return '/static/dashboard/tuoniao.png';
				} else if (minScore === scores.dimension5_score) {
					console.log("usercard src:", '狼')
					return '/static/dashboard/lang.png';
				}
			}
		},
		onLoad(option) {
			console.log('Received options:', option);

			// 接收上一个页面传递的数据
			this.userId = option.userId || '';
			this.username = decodeURIComponent(option.username || '');
			this.jobId = option.jobId || '';

			console.log('Parsed data:', {
				userId: this.userId,
				username: this.username,
				jobId: this.jobId
			});

			// 立即调用一次
			this.getHomepageData();

			// 设置定时调用
			this.intervalId = setInterval(() => {
				this.getHomepageData();
			}, 50000); // 每50秒调用一次
		},
		onUnload() {
			// 页面卸载时清除定时器
			if (this.intervalId) {
				clearInterval(this.intervalId);
			}
			if (this.progressInterval) {
				clearInterval(this.progressInterval);
			}
		},
		methods: {
			progressWidth(value) {
				// 算进度条宽度百分比
				const percentage = (value / this.maxScore) * 100;
				// console.log('${percentage}%：', `${percentage}%`)
				return `${percentage}%`;
			},
			circleLeftPosition(value) {
				// 获取进度条实际宽度
				const percentage1 = (value / this.maxScore) * 100;
				const progressBarWidth = uni.getSystemInfoSync().windowWidth * 0.8; // 80%的屏幕宽度作为进度条的际宽度
				console.log(percentage1)
				return (percentage1 / 100) * progressBarWidth;
			},
			navigateToGuide() {
				uni.navigateTo({
					url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.jobId}` // 添加查询参数
				});
			},
			getHomepageData() {
				const that = this;
				console.log('Fetching homepage data with jobId:', this.jobId);
				uni.request({
					url: `https://eqmaster.azurewebsites.net/get_homepage/${this.jobId}`,
					method: 'POST',
					success(response) {
						if (response.statusCode === 200) {
							that.homepageData = response.data;
							console.log('Homepage data received:', that.homepageData);
							that.$nextTick(() => {
								that.drawRadar();
							});
						} else {
							console.error('Failed to fetch homepage data:', response.statusCode);
						}
					},
					fail(error) {
						console.error('Error fetching homepage data:', error);
					}
				});
			},
			expand() {
				this.isExpanded = true; // 只展开，不再收起
			},
			openPopup() {
				this.showPopup = true;
			},
			closePopup() {
				this.showPopup = false;
			},
			selectOption(option) {
				this.selectedOption = option;
				this.selectedTags = []; // 切换选项时重置已选择的标签
			},
			toggleTag(tag) {
				const index = this.selectedTags.indexOf(tag);
				if (index > -1) {
					this.selectedTags.splice(index, 1);
				} else {
					this.selectedTags.push(tag);
				}
			},
			createProfile() {
				console.log('创建档案', {
					name: this.profileName,
					option: this.selectedOption,
					tags: this.selectedTags
				});
				this.closePopup();
			},
			toProfilePage() {
				if (this.canNavigateToProfile) {
					// 准备要发送的数据
					const requestData = {
						personal_name: this.username,
						name: this.profileName,
						tag: this.selectedTags.join(','),
						contact_relationship: this.selectedOption
					};

					// 在发送请求之前打印数据
					console.log('Sending data to create contact profile:', requestData);

					// 发送请求创建联系人档案
					uni.request({
						url: 'https://eqmaster.azurewebsites.net/create_contact_profile',
						method: 'POST',
						data: requestData,
						success: (res) => {
							if (res.statusCode === 200) {
								console.log('Contact profile created successfully:', res.data);
								// 创建成功后，导航到档案页面
								uni.navigateTo({
									url: `/pages/profile/profile?personal_name=${encodeURIComponent(this.username)}&name=${encodeURIComponent(this.profileName)}&jobId=${this.jobId}&relation=${encodeURIComponent(this.selectedOption)}&tags=${encodeURIComponent(JSON.stringify(this.selectedTags))}&contactId=${res.data.contact_id}`
								});
							} else {
								console.error('Failed to create contact profile:', res.statusCode, res.data);
								uni.showToast({
									title: `创建档案失败: ${res.statusCode}`,
									icon: 'none'
								});
							}
						},
						fail: (err) => {
							console.error('Error creating contact profile:', err);
							uni.showToast({
								title: '网络错误，请稍后重试',
								icon: 'none'
							});
						}
					});
				}
			},
			navigateToResult() {
				uni.navigateTo({
					url: `/pages/result/loading?jobId=${this.jobId}`
				});
			},
			openNewPopup() {
				this.showNewPopup = true;
			},

			closeNewPopup() {
				this.showNewPopup = false;
			},
			// navigateToDashboard() {
			// 	uni.navigateTo({
			// 		url: '/pages/dashboard/dashboard'
			// 	});
			// },
			navigateToDashboard() {
				console.log('Navigating to guide with data:', {
					userId: this.userId,
					username: this.username,
					jobId: this.homepageData.response.personal_info.job_id
				});
				uni.navigateTo({
					url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData.response.personal_info.job_id}`
				});
			},
			navigateToBattlefieldIntro() {
				uni.navigateTo({
					url: `/pages/battlefield/battlefield-intro?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData.response.personal_info.job_id}`

				});
			},
		},
	};
</script>

<style scoped>
.container {
	position: relative;
	background-color: #2F2F38;
	flex-direction: column;
	align-items: center;
	padding-top: 50rpx;
	width: 100%;
	height: 100%;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

.content {
	display: block;
	flex-direction: column;
	align-items: center;
	padding: 10rpx;
}

.illustration3 {
	width: 100rpx;
	height: auto;
	position: relative;
	top: 0rpx;
	left: 0rpx;
}

.illustration31 {
	width: 150rpx;
	height: auto;
	position: absolute;
	top: 40rpx;
	right: 0rpx;
}

.illustration36, .illustration37, .illustration38 {
	width: 60rpx;
	height: auto;
	position: absolute;
	top: 30rpx;
}

.illustration39 {
	width: 60rpx;
	height: auto;
	position: absolute;
	top: 30rpx;
	left: 100rpx;
}

.illustration36 { left: 100rpx; }
.illustration37 { left: 340rpx; }
.illustration38 { left: 570rpx; }

.card-o {
	width: 420px;
	position: relative;
	text-align: left;
	display: flex;
	flex-direction: row;
	align-items: left;
	margin-bottom: 20rpx;
}

.card {
	width: 150px;
	position: relative;
	text-align: left;
	display: flex;
	flex-direction: column;
	align-items: left;
	padding: 40rpx 20rpx 0rpx 20rpx;
}

.card1-container {
	padding: 20 20rpx; /* 添加左右内边距 */
	width: 100%;
	box-sizing: border-box;
}

.card1 {
	width: calc(100% - 80rpx); /* 屏幕宽度减去左右各20rpx */
	left: 5px;
	background-color: #373742;
	border-radius: 50rpx;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 20;
	text-align: left;
	display: flex;
	flex-direction: column;
	align-items: left;
	padding: 20rpx 30rpx 20rpx 30rpx;
}

.card2 {
	width: 360px;
	height: auto;
	background-color: #373742;
	border-radius: 50rpx;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 20;
	text-align: left;
	display: flex;
	flex-direction: column;
	align-items: left;
	padding: 20rpx 30rpx 20rpx 30rpx;
	/* margin-bottom: 30rpx; */
}


.progress-container {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 10px;
}

.card3 {
	width: 100%;
	height: 150rpx;
	background-color: #252529;
	color: #252529;
	font-size: 36rpx;
	text-align: center;
	line-height: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	position: fixed;
	bottom: 0px;
	transform: translateX(-50%);
	left: 50%;
}

.score-title1 {
	font-size: 28rpx;
	color: #010101;
}

.score-title2 {
	font-size: 30rpx;
	color: #FFFFFF;
	left: 300px;
	top: -23px;
	font-weight: bold;
}

.score-value-large-y {
	font-size: 50rpx;
	font-weight: bold;
	color: #fe9a52;
	margin-left: 60rpx;
	left: 30px;
	top: 30px;
	position: absolute;
}
.score-value-large-g {
	font-size: 50rpx;
	font-weight: bold;
	color: #aeed50;
	margin-left: 60rpx;
	left: 30px;
	top: 30px;
	position: absolute;
}
.score-value-large1 {
	font-size: 50rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin: 10px;
	position: relative;
}
.progress-bar {
	width: 95%;
	height: 10rpx;
	background-color: rgba(125, 123, 126, 0.5);
	border-radius: 25rpx;
	overflow: hidden;
	margin-top: 5rpx;
	margin-bottom: 15rpx;
}

.progress-bar1 {
	width: 70%;
	height: 15rpx;
	background-color: #000000;
	border-radius: 15rpx;
	overflow: hidden;
	margin-top: 15rpx;
	margin-bottom: 15rpx;
	margin-left:15rpx ;
}

.progress {
	height: 100%;
	background-color: #ffdc6f;
}

.background-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
	/* 背景图片在最底层 */
}

.level-badge {
	position: absolute;
	right: 40rpx;
	top: 40rpx;
	background-color: #ffdc6f;
	border-radius: 20rpx;
	padding: 5rpx 15rpx;
}

.xiuluochang-image {
  width: 100%; /* 设置宽度为100%，占满容器宽度 */
  height: 1100rpx; /* 设置固定高度，可以根据需要调整 */
  object-fit: cover; /* 确保图片填满容器，可能会裁剪部分内容 */
  margin: 20rpx 0; /* 添加上下边距 */
}

.xiuluochang-image1 {
	position: absolute;
  width: 100%; /* 设置宽度为100%，占满容器宽度 */
  height: 200rpx; /* 设置固定高度，可以根据需要调整 */
  margin: 20rpx 0; /* 添加上下边距 */
  z-index: 30;
}

.illustration35 {
	width: 300rpx;
	height: auto;
	position: absolute;
	top: 470rpx;
	left: 335rpx;
	margin-bottom: 10px;
	z-index: 40;
}

</style>