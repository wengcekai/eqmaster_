<template>
	<view class="container">
		<scroll-view scroll-y style="height: 100%;">
			<!-- <view class="debug-info"> -->
			  <!-- 如需调试信息，可取消注释以下行 -->
			  <!-- <text>homepageData: {{ JSON.stringify(homepageData) }}</text> -->
			<!-- </view> -->
			<view class="card first-card">
				<image class="head-image" src="/static/summary-bg.png" mode="aspectFill"></image>
			</view>

			<view class="card second-card">
				<view class="score">
					<text class="summary-dimension">情绪平衡力</text>
					<text class="course-score">+15</text>
				</view>
				<view class="progress-container">
					<view class="progress-bar1">
						<view class="progress" :style="{ width: progressWidth(45) }">
						</view>
					</view>
					<text class="score-title2">45%</text>
				</view>
				<view class="comments">
					<view class="comment-header">
						<view class="down-line"></view>
						<text class="comment-title">互动评价</text>
					</view>

					<view class="sub-card">
						<npc-comment :name="'领导'" :avatar="'/static/battlefield/boss.png'" :comment="comments[0]">
						</npc-comment>
						<npc-comment :name="'同事A'" :avatar="'/static/battlefield/xiaoA.png'" :comment="comments[1]">
						</npc-comment>
						<npc-comment :name="'同事B'" :avatar="'/static/battlefield/xiaoB.png'" :comment="comments[2]">
						</npc-comment>
					</view>
				</view>
			</view>

			<view class="card third-card">
				<view class="third-card-title">
					<view class="down-line second-line"></view>
					<text class="comment-title">本关情商技巧</text>
				</view>
				<view class="suggestion">
					<text>{{suggestion}}</text>
				</view>
			</view>
			<button class="guide-button" @click="navigateToGuide">开启高情商之旅</button>
						
			
		</scroll-view>
	</view>
</template>

<script>
	import NpcComment from '/components/NpcComment.vue'; // 引入组件
	export default {
		components: {
			NpcComment, // 注册组件
		},
		data() {
			return {
				comments: ["哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看", "好好哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看好我看看",
					"嘿嘿哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看嘿"
				],
				suggestion: "注意倾听每个人的需求，及时回应对方的感受。"
			}
		},
		methods: {
			progressWidth(value) {
				// 计算进度条宽度百分比
				const percentage = (value / 100) * 100;
				// console.log('${percentage}%：', `${percentage}%`)
				return `${percentage}%`;
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

			navigateToNextPage() {
				uni.navigateTo({
					url: '/pages/battlefield/battlefield-task' // Replace this with the actual path to your next page
				});
			}
		},
		
		onLoad() {
			const evalResult = uni.getStorage({
				key: 'evalResult',

				success: (res) => {
					console.log('result:', res);
					const list = res.data.eval.map(item => item.analysis);
					this.comments = list;

					this.suggestion = res.data.eq_tips.join('\n');
				}
			});
		
		

		}
	}
</script>

<style scoped>
	.container {
		width: 100%;
		min-height: 100vh;
		background-image:
			linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9)),
			url('/static/battlefield/background.png');
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-left: 10px;
	}

	.comments {
		margin-top: 20px;
		margin-left: 6px;
	}

	.comment-title {
		color: #fff;
		font-weight: bold;
	}

	.comment-header {
		position: relative;
	}

	.score-title2 {
		color: #fff;
		margin-left: 3px;
	}

	.card {
		width: 90%;
		height: 30vh;
		margin-top: 2vh;
		background-color: #373742;
		z-index: 3;
		border-radius: 20px;
		position: relative;
		overflow: visible;
		padding: 10px;
	}

	.first-card {
		height: 25vh;
		margin-top: 10vh;
	}

	.head-image {
		position: absolute;
		top: -5vh;
		left: 25%;
		width: 50%;
		z-index: 4;
	}

	.progress-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.progress-bar1 {
		margin-left: 10px;
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
		background-color: #F2Bc74;
	}

	.score {
		margin: 10px;
		margin-left: 10px;
		width: 80%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: 10px;
		align-items: center;
	}

	.summary-dimension {
		margin-top: 3px;
		font-weight: bold;
		color: #fff;
	}

	.course-score {
		color: #F2Bc74;
	}

	.down-line {
		position: absolute;
		width: 18%;
		bottom: 4px;
		height: 3px;
		background-color: rgba(242, 188, 116, 0.8);
	}

	.sub-card {
		margin-right: 5px;
	}

	.second-card {
		height: auto;
	}

	.third-card-title {
		margin-top: 20rpx;
		margin-left: 20rpx;
		position: relative;
	}

	.second-line {
		width: 28%;
	}

	.suggestion {
		margin-top: 5px;
		color: #fff;
	}

	.third-card {
		height: auto;
		margin-bottom: 3vh;
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
</style>