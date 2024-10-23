<template>
	<view class="container">
		<scroll-view scroll-y style="height: 100%;">
			<view v-if="currentView === 'dashboard'" class="content">

				<!-- 添加错误处理和加载状态 -->
				<view v-if="isLoading">loading...</view>
				<view v-else-if="error">{{ error }}</view>
				<view v-else>
					<!-- 使用可选链操作符和默认值 -->
					<text class="score-title-head">hi, {{homepageData?.response?.personal_info?.name || 'user'}}！</text>
					<!-- 添加插图 -->

                    <view class="character-view" @click="navigateToResult">
						<view style="display: flex;flex-direction: column;width: 308rpx;">
							<view :class="['animal-tag', animal]">
								<text>{{ animal }}</text>
							</view>
							<view style="margin-left: 32rpx;margin-top: 32rpx;display: flex;flex-direction: column;">
								<text style="font-size:24rpx;font-weight: 400;line-height: 32rpx;color: #ffffff;">									Needs to improve
								</text>
								<text style="font-size:34rpx;font-weight: 600;line-height: 44rpx;color: #ffffff;margin-top: 12rpx;">
									{{homepageData?.response?.personal_info?.tag}}
								</text>
								<text class="detail-summary">{{homepageData?.response?.eq_scores?.detail_summary}}</text>
							</view>
						</view>
						<image class="character-image" :src="userCard" />
                    </view>
					
					<view style="margin-top: 24rpx;">
						<text class="card-title1">Daily Tip</text>
						<view class="calendar">
							<view class="left-calendar">
								<text style="font-size: 24rpx;font-weight: 700;">{{ currentMonth }}</text>
								<text style="font-size: 48rpx;font-weight: 600;">{{ currentDate }}</text>
							</view>
							<view class="right-calendar">
								<text style="font-size: 24rpx;font-weight: 400;color: #ffffff;width: 418rpx;height: 128rpx;">
									The <text style="font-weight: bold;">FFC Praise Method</text> involves expressing your genuine feelings, providing specific facts,
								and making comparisons to highlight influence.
								</text>
							</view>
						</view>
					</view>

					<view class="network-title-container">
						<text class="card-title1">Moments</text>
						<text class="card-title15">Upload your chats, receive personalized soft skill insights.</text>
					</view>
					
					<view class="history-list">
						<view>
							<image class="import-button" 
								src="../../static/dashboard/import-button.png" 
								mode="widthFix"
								@click="chooseImage"
								>
							</image>
							<view class="left-history-container">
								<ChatHistory v-for="(item, index) in leftList" 
									:key="index" 
									:title="item.analysis.title"
									:details="item.analysis.details"
									@click="navigateToAnalysis(item)">
								</ChatHistory>
							</view>
						</view>
						<view class="right-history-container">
							<ChatHistory v-for="(item, index) in rightList"
								:key="index"
								:title="item.analysis.title"
								:details="item.analysis.details"
								@click="navigateToAnalysis(item)">
							</ChatHistory>
						</view>
					</view>

					<!--TODO: change to English  -->
					<!-- 添加蓝色按钮 -->
					<view class="card3">
						<image class="illustration36" src="/static/Frame1.png" mode="widthFix"></image>
						<image class="illustration37" src="/static/Frame22.png" mode="widthFix"
							@click="navigateToDashboard2"></image>
						<image class="illustration38" src="/static/Frame3.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<!-- chat battlefield homepage -->
			<view v-else-if="currentView === 'dashboard2'" class="dashboard2-content">
				<!-- Integrated dashboard2.vue content -->
				<view class="dashboard2-card-o">
					<view class="dashboard2-card">
						<image class="dashboard2-illustration3" src="/static/diamond.png" mode="widthFix"></image>
						<text
							class="dashboard2-score-value-large-y">{{ Math.round(homepageData?.response?.eq_scores?.score || 0) }}</text>
					</view>
					<view class="dashboard2-card">
						<image class="dashboard2-illustration3" src="/static/dashboard2/star.jpg" mode="widthFix">
						</image>
						<text class="dashboard2-score-value-large-g">{{ Math.round(5) }}</text>
					</view>
				</view>
				<image class="dashboard2-illustration31" src="/static/dashboard2/1.jpg" mode="widthFix"></image>

				<view class="dashboard2-card1">
					<text class="dashboard2-score-value-large1">{{ homepageData.response.personal_info.tag }}</text>
					<!-- <text class="dashboard2-score-value-large1">{{homepageData }}</text> -->
					<view class="dashboard2-level-badge">
						<text class="dashboard2-score-title1">Lv1小试牛刀</text>
						<!-- <text class="dashboard2-score-title1">{{courseData }}</text> -->
					</view>
					<view class="dashboard2-progress-container">
						<!-- <text class="dashboard2-score-title2">情绪掌控力</text> -->
						<text class="dashboard2-score-title2">情绪掌控力</text>
						<view class="dashboard2-progress-bar1">
							<view class="dashboard2-progress"
								:style="{ width: progressWidth(homepageData?.response?.eq_scores?.dimension3_score || 0) }">
							</view>
						</view>
					</view>
				</view>
				
				<!-- <view class="dashboard2-card1-container">
					
				</view> -->

				<view class="dashboard2-card-o">
					<!-- 调用进度条组件 -->
					
					<SProgressBar 
					  v-if="courseData && courseData.courses"
					  :finishComponents="courseData.courses.length"
					  :starRatings="courseData.courses.map(course => course.result)"
					  :totalComponents="6"
					/>
				</view>



				<!-- <image class="dashboard2-illustration35" src="/static/dashboard2/plgon9.jpg" mode="widthFix" @click="navigateToBattlefieldIntro"></image> -->
				<view class="dashboard2-card3">
					<image class="dashboard2-illustration36" src="/static/dashboard2/icon2.jpg" mode="widthFix"
						@click="switchView('dashboard')"></image>
					<image class="dashboard2-illustration37" src="/static/dashboard2/icon1.jpg" mode="widthFix"></image>
					<image class="dashboard2-illustration38" src="/static/Frame3.png" mode="widthFix"></image>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import SProgressBar from '@/components/SProgressBar.vue'; // 根据实际路径调整
	import apiService from '../../services/api-service';
	import ChatHistory from '@/components/ChatHistory.vue';


	export default {

		data() {
			return {
				currentView: 'dashboard2',
				score: 28, // 示例分数，可根据需要动态改
				maxScore: 100, // 假设最大分数为100
				userId: '',
				username: '',
				gender: '',
				birthday: null,
				selectedOptions: [],
				jobId: null,
				num: null,
				finishComponents: 2,
				totalComponents: 5,
				isLoading: true,
				error: null,
				homepageData: {
					response: {
						personal_info: {
							name: ''
						},
						eq_scores: {
							score: 0,
							overall_suggestion: ''
						},
						contacts: []
					}
				},
				analysisList: [
					{
						id: 1,
						chat_history: {
							messages: [
								{
									user: "Ophelia",
									message: "hello a",
								},
								{
									user: "me",
									message: "niaklskndf",
								},
								{
									user: "Hamlet",
									message: "wa haha",
								}
							]
						},
						analysis: {
							title: "1Trying to respond more sdfa fliasdf   xxxxxx xxxx",
							details: [
								"1Import chat history to figure out what she shaid ajshdfkahdf"
							]
						}
					},
					{
						id: 2,
						chat_history: {
							messages: [
								{
									user: "",
									message: "",
								}
							]
						},
						analysis: {
							title: "2Trying to respond more sdfa fliasdf   xxxxxx xxxx",
							details: [
								"1Import chat history to figure out what she shaid ajshdfkahdf"
							]
						}
					}
				],
				animal: '',
				courseData:null,
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
				roleCards: [{
						title: '角色卡1'
					},
					{
						title: '角色卡2'
					},
					{
						title: '角色卡3'
					},
					{
						title: '角色卡4'
					},
					{
						title: '角色卡5'
					},
					// 可以根需要添加更多卡片
				],
				showNewPopup: false,
				tipImageSrc: '/static/tip.png', // Initial image source
				currentDate: new Date(),
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
				const options = {
					month: 'short'
				}; // 'long' for full month name
				const monthFormatter = new Intl.DateTimeFormat('en-US', options);
				return monthFormatter.format(this.currentDate).toUpperCase();
			},
			currentDate() {
				const dayFormatter = new Intl.DateTimeFormat('en-US', { day: '2-digit' });
				return dayFormatter.format(this.currentDate);
			},
			leftList() {
				return this.analysisList.filter((item, index) => index % 2 == 1);
			},
			rightList() {
				return this.analysisList.filter((item, index) => index % 2 == 0)
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
				const scores = this.homepageData?.response?.eq_scores;
				console.log('jobid:', this.jobId);
				console.log('results for backgrounds:', scores);
				const minScore = Math.min(scores?.dimension1_score || 0, scores?.dimension2_score || 0, scores
					?.dimension3_score || 0, scores?.dimension4_score || 0, scores?.dimension5_score || 0);

				// 根据最低分选择图片
				if (minScore === scores?.dimension1_score) {
					console.log("usercard src:", '水豚')
					this.animal = "capybara";
					return '/static/dashboard/en/capybara.png';
				} else if (minScore === scores?.dimension2_score) {
					console.log("usercard src:", '刺猬')
					this.animal = "hedgehog";
					return '/static/dashboard/en/hedgehog.png';
				} else if (minScore === scores?.dimension3_score) {
					console.log("usercard src:", '狼')
					this.animal = "coyote";
					return '/static/dashboard/en/coyote.png';
				} else if (minScore === scores?.dimension4_score) {
					console.log("usercard src:", '鸵鸟')
					this.animal = "ostrich";
					return '/static/dashboard/en/ostrich.png';
				} else if (minScore === scores?.dimension5_score) {
					console.log("usercard src:", '猴子')
					this.animal = "monkey";
					return '/static/dashboard/en/monkey.png';
				}
			},
			truncatedSuggestion() {
				const suggestion = this.homepageData?.response?.eq_scores?.overall_suggestion || '暂无建议';
				return suggestion.length > 75 ? suggestion.slice(0, 75) + '...' : suggestion;
			},
			safeStarRatings() {
				return this.courseData && this.courseData.courses
					? this.courseData.courses.map(course => course.result)
					: [];
			}
		},
		components: {
			SProgressBar,
			ChatHistory
		},
		onLoad(option) {
			console.log('Received options:', option);

			// 接收上一个页面传递的数据
			this.userId = option.userId || '717';
			this.username = decodeURIComponent(option.username || 'Dgidegfiugrwi');

			this.jobId = option.jobId || '154ee592-287b-4675-b8bd-8f88de348476';

			// 立即调用一次
			this.getHomepageData(this.userId);
			this.getBattlefield(1);
			// this.username = this.homepageData.response.personal_info.name || '';

			console.log('Parsed data:', {
				userId: this.userId,
				username: this.username,
				jobId: this.jobId
			});

			console.log('Received options:', option);

			// 接收 currentView 参数并更新
			if (option.currentView) {
				this.currentView = option.currentView;
			}

			console.log('Current View:', this.currentView);


			// 设置定时调用
			this.intervalId = setInterval(() => {
				console.log('this.userId:', this.userId);
				this.getHomepageData(this.userId);
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
			navigateToAnalysis(analysis) {
				uni.setStorage({
					key: `analysis-${analysis.id}`,
					data: analysis,
					success() {
						uni.navigateTo({
							url: `/pages/dashboard/moment_analysis?analysisId=${analysis.id}`
						});
					},
				});
			},
			async chooseImage() {
				try {
				  const res = await uni.chooseImage({
				    count: 1,
				    sizeType: ['original', 'compressed'],
				    sourceType: ['album', 'camera']
				  });
				  const tempFilePaths = res.tempFilePaths;
				  console.log(tempFilePaths);
				  await this.uploadImage(tempFilePaths[0]);
				} catch (error) {
				  console.error('Error choosing image:', error);
				}
			},
			async uploadImage(filePath) {
			  try {
				// TODO replace 
			    const result = await apiService.uploadImage(filePath);
			    console.log('Upload result:', result);
			    // to analysis page
			  } catch (error) {
			    console.error('Upload failed:', error);
			    // 处理上传失败的情况
			  }
			},
			async getHomepageData() {
				try {
					this.isLoading = true;
					this.error = null;
					this.userId
					console.log('Fetching homepage data with userId:', this.userId);

					const data = await apiService.getHomepageData(this.userId);
					this.homepageData = data;
					console.log('Homepage data received:', this.homepageData);

					this.$nextTick(() => {
						this.drawRadar();
					});
				} catch (error) {
					this.error = 'Error fetching homepage data';
					console.error(this.error, error);
				} finally {
					this.isLoading = false;
				}
			},
			
			async getBattlefield() {
				try {

					this.userId
					console.log('Fetching homepage data with jobId:', this.userId);
			
					const data = await apiService.getBattlefield(1);
					this.courseData = data;
					console.log('Homepage data received:', this.courseData);
			
					this.$nextTick(() => {
						this.drawRadar();
					});
				} catch (error) {
					this.error = 'Error fetching homepage data';
					console.error(this.error, error);
				} finally {
					// this.isLoading = false;
				}
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
			navigateToBattlefieldIntro() {
				uni.navigateTo({
					url: `/pages/battlefield/battlefield-intro?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData?.response?.personal_info?.job_id}`

				});
			},
			toProfilePage() {
				if (this.canNavigateToProfile) {
					// 准备要发送的数据
					this.getHomepageData();
					const requestData = {
						personal_name: this.homepageData?.response?.personal_info?.name || '',
						name: this.profileName,
						tag: this.selectedTags.join(','),
						contact_relationship: this.selectedOption
					};

					// 在发送请求之前打印数据
					console.log('Sending data to create contact profile:', requestData);

					// 发送请求创建联系人档案
					uni.request({
						url: 'https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/create_contact_profile',
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
			toProfilePage1(contact) {
				this.getHomepageData();
				console.log('Navigating to profile page for contact:', contact);
				console.log('Navigating to profile page for contact:', this.homepageData?.response?.personal_info?.name);
				if (this.canNavigateToProfile) {
					// 准备要发送的数据
					this.getHomepageData();
					const requestData = {
						personal_name: this.homepageData?.response?.personal_info?.name || '',
						name: contact?.name || '',
						tag: contact?.tag || '',
						contact_relationship: contact?.contact_relationship || ''
					};

					// 在发送请求之前打印数据
					console.log('Sending data to create contact profile:', requestData);

					// 发送请求创建联系人档案
					uni.request({
						url: 'https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/create_contact_profile',
						method: 'POST',
						data: requestData,
						success: (res) => {
							if (res.statusCode === 200) {
								console.log('Contact profile created successfully:', res.data);
								// 创建成功后，导航到档案页面
								uni.navigateTo({
									url: `/pages/profile/profile?personal_name=${encodeURIComponent(this.username)}&name=${encodeURIComponent(contact?.name || '')}&jobId=${this.jobId}&relation=${encodeURIComponent(contact?.contact_relationship || '')}&tags=${encodeURIComponent(contact?.tag || '')}&contactId=${res.data.contact_id}`
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
					url: `/pages/result/result_en?userId=${this.userId}`
				});
			},
			openWeChat() {
				try {
					// Attempt to open WeChat using the URL scheme
					uni.navigateTo({
						url: 'weixin://',
						success: () => {
							console.log('WeChat opened successfully');
						},
						fail: () => {
							// If opening WeChat fails, show a toast message
							uni.showToast({
								title: 'WeChat is not installed',
								icon: 'none'
							});
						}
					});
				} catch (error) {
					// Handle any unexpected errors
					console.error('Error opening WeChat:', error);
					uni.showToast({
						title: 'Unable to open WeChat',
						icon: 'none'
					});
				}
			},
			toggleTipImage() {
				this.tipImageSrc = this.tipImageSrc === '/static/tip.png' ?
					'/static/tipp.png' // Replace with the new image path
					:
					'/static/tip.png';
			},
			truncateName(name) {
				const maxLength = 6; // Set the maximum length for the name
				if (name.length > maxLength) {
					return name.substring(0, maxLength) + '...';
				}
				return name;
			},

			navigateToDashboard() {
				this.switchView('dashboard');
			},
			navigateToDashboard2() {
				this.switchView('dashboard2');
			},
			switchView(view) {
				this.currentView = view;
			},
		},
	};
</script>



<style scoped>

    .character-view {
		margin-top: 16rpx;
        width: 668rpx;
        height: 420rpx;
        color: #373742;
		display: flex;
		background-color: #373742;
		border-radius: 32rpx;
    }

	.animal-tag {
		width: 318rpx;
		height: 80rpx;
		font-size: 40rpx;
		font-weight: 700;
		color: #fdedcb;
		border-radius: 32rpx 0px 32rpx 0px;
		text-transform: uppercase;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hedgehog {
		background-color: #f15d39;
	}

	.capybara {
		background-color: #6e5b38;
	}

	.ostrich {
		background-color: #6e4939;
	}

	.monkey {
		background-color: #c157e0;
	}

	.coyote {
		background-color: #5555db;
	}

	.character-image {
		width: 352rpx;
		height: 420rpx;
	}

	.detail-summary {
		display: -webkit-box;
		font-size:24rpx;
		font-weight: 400;
		line-height: 32rpx;
		color: #ffffff;
		margin-top: 16rpx;
		overflow: hidden;
		height: 160rpx;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
  		-webkit-line-clamp: 5;
	}

	.calendar {
		width: 670rpx;
		height: 240rpx;
		margin-top: 9px;
		border-radius: 32rpx;
		background-image: url("/static/calendar-image.png");
		background-size: 100% 100%;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.left-calendar {
		width: 154rpx;
		height: 240rpx;
		color: #FFFFFF;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.right-calendar {
		width: 516rpx;
		height: 240rpx;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.import-button {
		width: 324rpx;
		height: 120rpx;
	}

	.history-list {
		display: flex;
		flex-direction: row;
		gap: 22rpx;
	}

	.left-history-container {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		margin-top: 24rpx;
	}

	.right-history-container {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}
	
	.container {
		position: relative;
		background-color: #2F2F38;
		/* display: flex; */
		flex-direction: column;
		align-items: left;
		padding-top: 100rpx;
		width: 100%;
		height: 100vh;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.content {
		display: flex;
		/* 避免 flex 布局干扰 */
		flex-direction: column;
		align-items: left;
		/* width: 100%; */
		margin-left: 20px;
	}


	.illustration1 {
		width: 300rpx;
		height: auto;
		position: relative;
		z-index: 10;
		/* top: -5px; */
		left: 0px;
		margin-top: 30rpx;
		margin-bottom: 50rpx;
		margin-right: 20rpx;
	}

	.illustration-qr {
		width: 170rpx;
		height: auto;
		position: relative;
		z-index: 10;
		top: 0px;
		left: 0px;
		/* margin-top: 30rpx; */
		/* margin-bottom: 50rpx; */
	}

	.illustration2 {
		width: 130rpx;
		height: auto;
		position: absolute;
		top: 1030rpx;
		left: 290rpx;
	}

	.illustration3 {
		width: 100rpx;
		height: auto;
		position: relative;
		top: 0rpx;
		left: 0rpx;
	}

	.illustration31 {
		width: 260rpx;
		height: auto;
		margin-top: 24rpx;
	}

	.illustration32 {
		width: 690rpx;
		height: auto;
		position: relative;
		top: 0rpx;
		left: 0rpx;
		margin-bottom: 10px;
	}

	.illustration33 {
		width: 130rpx;
		height: auto;
		position: absolute;
		top: 0rpx;
		left: 500rpx;
		margin-bottom: 10px;
	}

	.illustration34 {
		width: 60rpx;
		height: auto;
		position: absolute;
		top: 15rpx;
		left: 620rpx;
		margin-bottom: 10px;
	}

	.illustration35 {
		width: 320rpx;
		height: auto;
		position: absolute;
		/* top: 1240rpx; */
		right: 0rpx;
		margin-bottom: 10rpx;
		z-index: 40;
	}

	.illustration36 {
		width: 60rpx;
		height: auto;
		position: absolute;
		top: 30rpx;
		left: 100rpx;
	}

	.illustration37 {
		width: 60rpx;
		height: auto;
		position: absolute;
		top: 30rpx;
		left: 340rpx;
	}

	.illustration38 {
		width: 60rpx;
		height: auto;
		position: absolute;
		top: 30rpx;
		left: 570rpx;
	}

	.illustration39 {
		width: 300px;
		height: auto;
		position: absolute;
		top: 30rpx;
		left: 10 px;
	}

	.illustration4 {
		width: 70rpx;
		height: auto;
		position: absolute;
		margin-top: -20rpx;
		left: 390rpx;
	}

	.illustration5 {
		width: 150rpx;
		height: auto;
		position: absolute;
		margin-top: -20rpx;
		left: 520rpx;
	}

	.illustration6 {
		width: 400rpx;
		height: auto;
		position: absolute;
		bottom: -20rpx;
		left: 250rpx;
	}

	.illustrationhead {
		width: 100rpx;
		height: auto;
		position: relative;
		z-index: 10;
		left: 0px;
		margin-top: 30rpx;
		margin-bottom: 0rpx;
	}

	.card {
		width: 300rpx;
		height: 420rpx;
		background-color: #373742;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
		position: relative;
		/* top: 65px; */
		/* left: 190px; */
		text-align: left;
		display: flex;
		flex-direction: column;
		align-items: left;
		padding: 30rpx 30rpx 0rpx 30rpx;
		/* margin-bottom: 10rpx; */
		margin-top: 30rpx;
	}

	.card1 {
		width: 88%;
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
		margin-bottom: 30rpx;
	}

	.cardjuese {
		width: 265rpx;
		height: 300rpx;
		background-color: #373742;
		border-radius: 50rpx;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 20;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: left;
		padding: 20rpx 30rpx 20rpx 30rpx;
		margin-bottom: 10rpx;
	}

	.cardjuese1 {
		width: 180rpx;
		height: 60rpx;
		background-color: #373742;
		border-radius: 50rpx;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 20;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: left;
		padding: 20rpx 30rpx 20rpx 30rpx;
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
		/* margin-bottom: 30rpx; */
		z-index: 1000;
		/* 确保按钮悬浮其他内容之上 */
		position: fixed;
		/* 固定定位 */
		bottom: 0px;
		transform: translateX(-50%);
		/* 调整水平位置以居中 */
		left: 50%;
		/* 水平居中 */
	}

	.peoplecontain {
		width: 680rpx;
		background-color: #2F2F38;
		position: relative;
		z-index: 20;
		text-align: center;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		/* 添加这行 */
		align-items: flex-start;
		padding: 0rpx 0rpx 0rpx 0rpx;

		gap: 10rpx;
		margin-bottom: 200rpx;
	}

	.lower-card {
		top: 140rpx;
		/* 偶数片下移 30px */
		margin-left: 10rpx;
		margin-right: 10rpx;
		/* margin-top: 5rpx; */
		margin-bottom: 10rpx;
	}

	.score-title-head {
		font-size: 50rpx;
		font-weight: bold;
		color: #FFFFFF;
		margin-top: 30rpx;
		position: relative;
		z-index: 30;
	}

	.score-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #9EE44D;
		margin-bottom: 5rpx;
	}

	.score-title1 {
		font-size: 36rpx;
		color: #FFFFFF;
		margin-bottom: 5rpx;
	}

	.score-title2 {
		font-size: 30rpx;
		color: #FFFFFF;
		/* margin-bottom: 5rpx; */
		left: 300px;
		top: -23px;
		font-weight: bold;
	}

	.score-container,
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
		font-size: 50rpx;
		font-weight: bold;
		color: #FFFFFF;
		margin-left: 60rpx;
		left: 30px;
		top: 26px;
		position: absolute;

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
		width: 95%;
		height: 10rpx;
		background-color: rgba(125, 123, 126, 0.5);
		/* 设置透明度为50% */
		border-radius: 25rpx;
		overflow: hidden;
		margin-top: 5rpx;
		margin-bottom: 15rpx;
	}

	.status-text {
		top: 190px;
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
		width: 700rpx;
		height: 500rpx;
		margin-top: 50px;
		top: -50px;
		background-color: transparent;
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
		/* color: #252529; */
		background-color: #EDFB8B;
		margin-bottom: 10rpx;
		padding: 10px;
		border-radius: 20rpx 20rpx 20rpx 0rpx;
		/* 左上角方角，其他三个角为圆角 */
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
		font-size: 45rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.card-title12 {
		position: absolute;
		top: 400px;
		left: 32px;
		font-size: 26rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.card-title13 {
		position: absolute;
		top: 415px;
		left: 30px;
		font-size: 50rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.card-title14 {
		font-size: 25rpx;
		color: #FFFFFF;
		margin-bottom: 10rpx;
		margin-top: 10rpx;
		margin-left: 20rpx;
	}

	.card-title15 {
		font-size: 25rpx;
		color: #bbbbbb;
		margin-bottom: 10rpx;
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
		font-size: 20rpx;
		color: #FFFFFF;
		line-height: 1.5;
		margin-top: 0rpx;
		/* word-break: break-all;  // 确保长单词也能换行
		white-space: normal;    // 允许文本换行 */
	}

	.card-description1 {
		font-size: 24rpx;
		color: #FFFFFF;
		line-height: 1.5;
		margin-top: 10rpx;
	}

	.guide-button {
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
		/* margin-bottom: 30rpx; */
		z-index: 1000;
		/* 确保按钮悬浮在其他容之上 */
		position: fixed;
		/* 固定定位 */
		bottom: 0px;
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
		background-color: rgba(0, 0, 0, 1);
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
		top: 350rpx;
	}

	.emotion-detection-box2 {
		top: 450rpx;
		left: 35%;
	}

	.emotion-detection-box3 {
		top: 450rpx;
		right: 35%;
	}

	.emotion-detection-box4 {
		top: 800rpx;
		right: 35%;
	}

	.emotion-detection-box5 {
		top: 800rpx;
		left: 35%;
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
		padding: 10rpx;
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
		height: 55rpx;
		/* Adjust the height to your desired size */
		cursor: pointer;
		/* Make it clickable */
		margin: 0 auto;
		/* Center it */
		/* bottom:30px; */
	}

	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		z-index: 1000;
		padding: 10rpx;
	}

	.popup-content {
		width: 580rpx;
		/* Set the width to 90% */
		background-color: #3C3C47;
		border-radius: 50rpx;
		padding: 50rpx;
		display: flex;
		justify-content: center;
		align-items: left;
		flex-direction: column;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: left;
		margin-bottom: 20rpx;
	}

	.popup-wordy {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		margin-bottom: 0rpx;
	}

	.popup-icon {
		display: flex;
		/* Use flexbox for layout */
		flex-direction: row;
		/* Arrange items in a row */
		justify-content: space-between;
		/* Distribute space evenly between items */
		align-items: center;
		/* Align items vertically centered */
		width: 500rpx;
		/* Ensure the container takes full width */
		padding: 2rpx;
		/* Optional: Add some padding */
	}

	.popup-icon1 {
		width: 400rpx;
		/* Set the width of the image */
		height: auto;
		/* Maintain aspect ratio */

	}

	.popup-icon2 {
		width: 100rpx;
		/* Set the width of the image */
		height: auto;
		/* Maintain aspect ratio */
		margin-bottom: 40rpx;
		/* Add horizontal margin for spacing */
		margin-top: 40rpx;

	}

	.popup-title {
		color: #FFFFFF;
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 20px;
	}

	.popup-notitle {
		color: #FFFFFF;

		font-size: 30rpx;
		margin-bottom: 20px;
	}

	.popup-close {
		color: #FFFFFF;
		font-size: 40rpx;
		position: absolute;
		right: 50px;
	}

	.popup-input {
		background-color: #2F2F38;
		color: #FFFFFF;
		padding: 20rpx;
		border-radius: 30rpx;
		margin-bottom: 20rpx;
		width: 80%;
	}

	.popup-section {
		margin-bottom: 20rpx;
	}

	.popup-question {
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.popup-options {
		display: flex;
		flex-direction: row;
		/* 改为横向排列 */
		flex-wrap: wrap;
		/* 允许换行 */
		align-items: flex-start;
	}

	.popup-option {
		background-color: #2F2F38;
		color: #FFFFFF;
		border-radius: 50rpx 0rpx 0rpx 50rpx;
		padding: 20rpx 60rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		width: auto;
		font-size: 14px;
	}

	.popup-option1 {
		background-color: #2F2F38;
		color: #FFFFFF;
		border-radius: 0rpx;
		padding: 20rpx 60rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		width: auto;
		font-size: 14px;
	}

	.popup-option2 {
		background-color: #2F2F38;
		color: #FFFFFF;
		border-radius: 0rpx 30rpx 30rpx 0rpx;
		padding: 20rpx 60rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		width: auto;
		font-size: 14px;
	}

	.popup-option.active,
	.popup-option1.active,
	.popup-option2.active {
		background-color: #9EE44D;
		color: #2F2F38;
	}

	.popup-tags {
		display: flex;
		flex-direction: row;
		/* 改为横向排列 */
		flex-wrap: wrap;
		/* 许换行 */
		align-items: flex-start;
		width: 100%;
		/* 按钮组占满整个宽度 */
		margin-bottom: 10px;
		/* 调整间距 */
	}

	.popup-tag {
		display: inline-block;
		background-color: #2F2F38;
		color: #FFFFFF;
		padding: 20rpx 40rpx;
		border-radius: 30rpx;
		margin: 5px;
		/* 调整间距 */
		white-space: nowrap;
		cursor: pointer;
		/* 增加点击效果 */
		font-size: 14px;
	}

	.popup-tag.active {
		background-color: #9EE44D;
		color: #2F2F38;
	}

	.custom-tag {
		border: 1rpx dashed #FFFFFF;
	}

	.popup-button {
		background: linear-gradient(-30deg, #EDFB8B -20%, #9EE44D 120%);
		color: #2F2F38;
		width: 100%;
		padding: 5rpx;
		border-radius: 50rpx;
		text-align: center;
		margin-top: 10px;
	}

	.new-profile-button {
		background: linear-gradient(-30deg, #8BE1FB -20%, #4D9EE4 120%);
		margin-top: 20px;
	}

	.card1inner {
		flex-direction: row;
		margin-left: 20rpx;
		display: flex;
		align-items: center;
	}

	.card2inner {
		flex-direction: column;
		display: flex;
		align-items: left;
		text-align: left;
		margin-left: 20rpx;
		top: 20px;
	}

	.white-line {
		width: 100%;
		height: 1rpx;
		background-color: #acacac;
		margin: 30rpx 0;
	}

	.usercard-title1 {
		font-size: 26rpx;
		color: #FFFFFF;
		/* font-weight: bold; */
		/* margin-top: 20rpx; */
		/* margin-bottom: 20rpx; */
	}

	.usercard-title2 {
		font-size: 32rpx;
		color: #FFFFFF;
		font-weight: bold;
		/* margin-top: 20rpx; */
		/* margin-bottom: 20rpx; */
	}

	.usercard-title3 {
		font-size: 20rpx;
		color: #FFFFFF;
		/* font-weight: bold; */
		/* margin-top: 20rpx; */
		margin-bottom: 10rpx;
	}

	.dashboard1-card-o {
		width: 680rpx;
		position: relative;
		text-align: left;
		display: flex;
		flex-direction: row;
		align-items: left;
		margin-bottom: 20rpx;
		gap: 5rpx;
	}

	/* Styles for the first view */
	.dashboard-content {
		display: block;
		flex-direction: column;
		align-items: center;
		padding: 10rpx;
	}

	.dashboard-card {
		/* Add styles specific to the first view */
	}

	/* Styles for the second view */
	.dashboard2-content {
		display: block;
		flex-direction: column;
		align-items: center;
		padding: 10rpx;
	}

	.dashboard2-card-o {
		width: 105%;
		position: relative;
		text-align: left;
		display: flex;
		flex-direction: row;
		align-items: left;
		margin-bottom: 10rpx;
		/* top: -50rpx; */
	}

	.dashboard2-card {
		width: 150px;
		position: relative;
		text-align: left;
		display: flex;
		flex-direction: column;
		align-items: left;
		padding: 40rpx 20rpx 0rpx 20rpx;
	}

	.dashboard2-card1-container {
		padding: 20 20rpx;
		/* Add left and right padding */
		width: 100%;
		box-sizing: border-box;
		/* margin-top: 50rpx; */
	}

	.dashboard2-card1 {
		width: calc(100% - 80rpx);
		/* Screen width minus 20rpx on each side */
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

	.dashboard2-progress-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 10px;
	}

	.dashboard2-card3 {
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

	.dashboard2-score-title1 {
		font-size: 28rpx;
		color: #010101;
	}

	.dashboard2-score-title2 {
		font-size: 30rpx;
		color: #FFFFFF;
		left: 300px;
		top: -23px;
		font-weight: bold;
	}

	.dashboard2-score-value-large-y {
		font-size: 50rpx;
		font-weight: bold;
		color: #fe9a52;
		margin-left: 60rpx;
		left: 30px;
		top: 30px;
		position: absolute;
	}

	.dashboard2-score-value-large-g {
		font-size: 50rpx;
		font-weight: bold;
		color: #aeed50;
		margin-left: 60rpx;
		left: 30px;
		top: 30px;
		position: absolute;
	}

	.dashboard2-score-value-large1 {
		font-size: 50rpx;
		font-weight: bold;
		color: #FFFFFF;
		margin: 10px;
		position: relative;
	}

	.dashboard2-progress-bar1 {
		width: 70%;
		height: 15rpx;
		background-color: #000000;
		border-radius: 15rpx;
		overflow: hidden;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
		margin-left: 15rpx;
	}

	.dashboard2-progress {
		height: 100%;
		background-color: #ffdc6f;
	}

	.dashboard2-level-badge {
		position: absolute;
		right: 40rpx;
		top: 40rpx;
		background-color: #ffdc6f;
		border-radius: 20rpx;
		padding: 5rpx 15rpx;
	}

	.dashboard2-xiuluochang-image {
		width: 100%;
		height: 1100rpx;
		object-fit: cover;
		margin: 20rpx 0;
	}

	.dashboard2-illustration35 {
		width: 300rpx;
		height: auto;
		position: absolute;
		top: 470rpx;
		left: 335rpx;
		margin-bottom: 10px;
		z-index: 40;
	}

	.dashboard2-illustration3 {
		width: 100rpx;
		height: auto;
		position: relative;
		top: 0rpx;
		left: 0rpx;
	}

	.dashboard2-illustration31 {
		width: 150rpx;
		height: auto;
		position: absolute;
		top: 40rpx;
		right: 0rpx;
	}

	.dashboard2-illustration36,
	.dashboard2-illustration37,
	.dashboard2-illustration38 {
		width: 60rpx;
		height: auto;
		position: absolute;
		top: 30rpx;
	}

	.dashboard2-illustration36 {
		left: 100rpx;
	}

	.dashboard2-illustration37 {
		left: 340rpx;
	}

	.dashboard2-illustration38 {
		left: 570rpx;
	}

	.network-title-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-top: 24rpx;
	}

	.floating-image {
		position: absolute;
		width: 320rpx; /* 调整图片大小 */
		height: auto;
		top: 110rpx; /* 调整垂直位置，使图片漂浮在进度条上方 */
		right: 105rpx; /* 调整水平位置 */
		z-index: 10; /* 确保图片在进度条上方 */
	}
	
	.container-sprogress {
	  width: 100%;
	  overflow-x: hidden; /* Hide horizontal overflow */
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  flex-direction: column;
	  background-color: #2F2F38;
	  margin-right: 3rpx;
	}
	
	.progress-canvas {
	  width: 150%; /* Increase canvas width */
	  height: 2000rpx;
	  margin: 45rpx;
	  transform: translateX(-20%); /* Move canvas to the left */
	}

	.tear-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 134px;
  padding-top: 0px;
}
	
</style>