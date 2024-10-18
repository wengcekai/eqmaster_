<template>
	<view class="container" @click="handleContainerClick">
		<image class="background-image" src="/static/battlefield/background.png" mode="aspectFill" />
		<view class="overlay"></view>

		<view class="navbar" :class="{ shadowed: shouldShadow }">
			<image class="back-button" src="/static/battlefield/back-iconpng.png" @tap="goToDashboard"></image>
			<reward-bar :gemCount="gemCount"></reward-bar>
			<view class="setting-group">
				<image class="setting-item" src="/static/battlefield/copy.png"></image>
				<image class="setting-item" src="/static/battlefield/setting.png"></image>
			</view>
		</view>

		<view class="npc-group" :class="{ shadowed: shouldShadow }">
			<npc-status v-for="npc in npcs" :key="npc.characterName" :health="npc.health" :avatar="npc.avatar"
				:characterName="npc.characterName"></npc-status>
		</view>

		<view class="chat-history-container" :class="{ shadowed: shouldShadow }" v-if="state !== 'NpcTalk'">
			<template v-for="(chat, index) in displayedMessages">
				<self-chat-box v-if="chat.role === 'user'" :key="index" :wording="chat.content"></self-chat-box>
				<npc-chat-box v-else-if="['领导', '同事A', '同事B'].includes(chat.role)" :key="'npc-' + index"
					:avatar="getBattlefieldAvatar(chat.role)" :name="chat.role" :dialog="chat.content"></npc-chat-box>
				<tipping-chat-box v-else-if="chat.role === 'tipping'" :key="'tipping' + index"
					:tip="chat.content"></tipping-chat-box>
			</template>
		</view>

		<view v-if="state === 'NpcTalk'" class="npc-talk-container">
			<large-avatar-bubble :avatar="npcs[talkingNpc].avatar" :character="npcs[talkingNpc].characterName"
				:wording="chattingHistory[displayedNpcChatIndex].content">
			</large-avatar-bubble>
		</view>


		<!-- 录音弹框 -->
		<!-- avoid opacity inheriting -->
		<view v-if="isRecording" class="recording-box">
			<text class="timer">{{ remainingTime }}''</text>
			<view class="waveform">
				<!-- 声波动画 -->
				<view class="wave"></view>
				<view class="wave"></view>
				<view class="wave"></view>
				<view class="wave"></view>
				<view class="wave"></view>
			</view>

			<text class="cancel-text">松开发送，上滑取消</text>
		</view>

		<view class="player-action-container" :class="{ shadowed: shouldShadow }">
			<view class="action-item" v-if="!isRecording" @click="showInput = true; focusInput = true;">
				<image class="action-icon" src="/static/battlefield/keyboard.png"></image>
			</view>
			<view class="middle-container">
				<view class="action-item action-item-middle" @touchstart="handleClickRecording"
					@touchend="handleRecordingDone" @touchmove="handleTouchMove">
					<image class="action-icon action-icon-middle" src="/static/battlefield/microphone.png"></image>
				</view>
			</view>
			<view class="action-item" v-if="!isRecording">
				<image class="action-icon-hint" src="/static/battlefield/streamline.png" @click="clickHintButton">
				</image>
			</view>
		</view>

		<view v-if="showTippingCard" class="tipping-card">
			<tipping :quit="handleTippingQuit" :hint="hint" :help="help"></tipping>
		</view>

		<view class="keyboard-container">
			<view v-if="showInput" class="input-container">
				<input type="text" :focus="focusInput" placeholder="请输入..." @blur="showInput = false" />
			</view>
		</view>

		<view class="judge-container" v-if="state === 'judge'">
			<judge :title="judgeTitle" :wording="judgeContent" @judge="gotoNextRound" :good-judge="isGoodReply"></judge>
		</view>
	</view>
</template>

<script>
	const recorderManager = uni.getRecorderManager();
	import RewardBar from '/components/RewardBar.vue';
	import NpcStatus from '/components/NpcStatus.vue';
	import LargeAvatarBubble from '/components/LargeAvatarBubble.vue';
	import Judge from '/components/Judge.vue';
	import Tipping from '/components/Tipping.vue';
	import TippingChatBox from '/components/TippingChatBox.vue';
	import SelfChatBox from '/components/SelfChatBox.vue';
	import NpcChatBox from '/components/NpcChatBox.vue';
	import {
		reply,
		startField,
		helpReply,
		hint,
		continueChat,
		evalBattlefield,
	} from '/scripts/battlefield-chat';
	import {
		getBattlefieldAvatar,
	} from '../../scripts/locate_name';
	import {
		filterChatHistory,
		getNpcIndex,
	} from '../../scripts/battlefield-chat';
	import Task from '../../models/Task';
	import TaskList from '../../models/TaskList';
	export default {
		components: {
			RewardBar,
			NpcStatus,
			LargeAvatarBubble,
			Judge,
			Tipping,
			TippingChatBox,
			SelfChatBox,
			NpcChatBox,
		},
		data() {
			return {
				judgeTitle: '',
				judgeContent: '',
				taskList: new TaskList([]),
				isGoodReply: true,
				state: 'NpcTalk', // Current state
				showTippingCard: false, // Controls the tipping card visibility
				talkingNpc: 0,
				displayedNpcChatIndex: 0, // Tracks the last displayed NPC chat
				npcDialog: 'NPC dialogue here', // Replace with actual dialogue
				// Other data properties
				someoneTalk: true,
				chattingHistory: [{
					role: '领导',
					content: '唉，我最近有点上火，医生嘱咐我要清淡饮食。这些重口味的菜我可真不敢吃了，不然怕是吃完嘴上火气就更旺了。',
				}, ],
				showInput: false,
				focusInput: false,
				npcs: [{
						characterName: '领导',
						health: 10,
						avatar: '/static/battlefield/boss.png',
					},
					{
						characterName: '同事A',
						health: 10,
						avatar: '/static/battlefield/xiaoA.png',
					},
					{
						characterName: '同事B',
						health: 10,
						avatar: '/static/battlefield/xiaoB.png',
					},
				],
				gemCount: 2,
				isPass: false, // 初始化 isPass 值，可以是 true 或 false
				diamonds: 0,
				tempFilePath: '', // 临时录音文件路径
				isRecording: false, // Controls the display state of recording box
				remainingTime: 30, // 录音剩余时间
				isCanceling: false, // 判断是否处于取消状态
				touchStartY: 0, // 记录touchstart的位置
				touchThreshold: -100, // 上滑取消的阈值（负值表示向上滑动）
				countdownInterval: null, // 倒计时的定时器
				getBattlefieldAvatar,
			};
		},
		created() {
			// 动态添加任务到 taskList
			this.taskList.addTask(new Task(0, '一句话让同事们赞不绝口', async (judgeResult) => {
				const allPositive = judgeResult.moods.every((item) => parseInt(item.mood, 10) > 0);
				// const allPositive = judgeResult.moods.some((item) => parseInt(item.mood, 10) > 0);
				if (allPositive && !this.taskList.getTask(0).once) {
					this.judgeTitle =
						`做得好！ ${this.taskList.getTask(0).title} (${this.taskList.doneTaskLength + 1}/${this.taskList.taskLength})`;
					return true;
				}
				return false;
			}));
			// this.taskList.addTask(new Task(1, '让小b不开心', async (judgeResult) => {
			// 	let res = "";

			// 	judgeResult.moods.filter((mood) => {
			// 		if (mood.role === "同事B")
			// 			res = mood.mood;
			// 	})
			// 	const bMood = parseInt(res ? res : 0, 10);
			// 	if (bMood < 0 && !this.taskList.getTask(1).once) {
			// 		this.judgeTitle =
			// 			`做得好！ ${this.taskList.getTask(1).title} (${this.taskList.doneTaskLength + 1}/${this.taskList.taskLength})`;
			// 		return true;
			// 	}
			// 	return false;
			// }));
		},
		methods: {
			goToDashboard() {
				uni.navigateTo({
					url: '/pages/dashboard/dashboard?currentView=dashboard2',
				});
			},
			handleClickRecording(e) {
				// console.log("click start , isRecording: ", this.isRecording)
				this.isRecording = true;
				this.isCanceling = false;
				this.remainingTime = 30;
				this.touchStartY = e.touches[0].clientY;
				this.startRecording();
				this.startCountdown();
			},
			handleTouchMove(e) {
				console.log("move start , isRecording: ", this.isRecording)
				if (!this.isRecording) return;
				const currentY = e.touches[0].clientY;
				const distance = currentY - this.touchStartY;
				if (distance < this.touchThreshold) {
					this.isCanceling = true;
					console.log("canceled")
				} else {
					this.isCanceling = false;
					console.log("not canceled")
				}
			},
			handleRecordingDone() {
				console.log("handling touch move...");
				if (!this.isRecording) return;
				recorderManager.stop();
				clearInterval(this.countdownInterval);
				this.isRecording = false;


				// if (this.isCanceling) {
				//   this.cancelRecording();
				// } else {
				//   this.sendRecording();
				// }
			},
			resetRecording() {
				this.isRecording = false;
				this.isCanceling = false;
				this.remainingTime = 30;
				clearInterval(this.countdownInterval);
			},
			startCountdown() {
				this.countdownInterval = setInterval(() => {
					if (this.remainingTime > 0) {
						this.remainingTime--;
					} else {
						this.handleRecordingDone();
					}
				}, 1000);
			},
			resetRecording() {
				this.isRecording = false;
				this.isCanceling = false;
				this.remainingTime = 30;
				clearInterval(this.countdownInterval);
			},
			async gotoNextRound() {
				if (!this.isGoodReply) {
					this.retry();
					return;
				}
				const nextRound = await continueChat(this.chattingHistory);
				console.log('next round data', nextRound);

				this.chattingHistory = this.chattingHistory.concat(nextRound.dialog);
				console.log('after concat, chatting history:', this.chattingHistory);

				let someoneTalked = false;
				for (; this.displayedNpcChatIndex < this.chattingHistory.length;
					++this.displayedNpcChatIndex
				) {
					let npcIndex = getNpcIndex(this.chattingHistory[this.displayedNpcChatIndex]);
					if (npcIndex >= 0) {
						this.talkingNpc = npcIndex;
						console.log('someone talk:', this.talkingNpc);
						someoneTalked = true;
						break;
					}
				}

				if (!someoneTalked) {
					this.displayedNpcChatIndex--;
				}

				this.state = 'NpcTalk';
			},

			retry() {
				this.state = 'userTalk';
			},
			startRecording() {
				const options = {
					duration: 30000, // 最大录音时长 30 秒
					sampleRate: 16000, // 采样率，Azure 推荐16kHz
					numberOfChannels: 1, // 单声道
					encodeBitRate: 16000, // 编码码率
					format: 'wav', // 设置录音格式为 wav
				};
				recorderManager.start(options);
				console.log('开始录音');
			},
			getNextState() {
				if (this.state === 'NpcTalk' && this.chattingHistory.length === 0) {
					console.log('Dismiss npc');
					this.state = 'userTalk';
				} else {
					// Other state transitions
				}
			},
			handleTippingQuit() {
				console.log('Clicked quit tipping');
				this.state = 'userTalk'; // Change state
			},
			help() {
				console.log('Choose help card');
			},
			hint() {
				console.log('Choose hint card');
			},
			clickHintButton() {
				this.state = 'hint';
			},

			async uploadAndRecognizeSpeech(filePath) {
				try {
					const response = await uni.uploadFile({
						url: 'https://eqmaster.azurewebsites.net/upload-audio/', // 替换为你的 FastAPI 服务地址
						filePath: filePath, // 录音的 WAV 文件路径
						name: 'file', // 与 FastAPI 后端的字段名保持一致
						header: {
							'Content-Type': 'multipart/form-data', // 确保使用 multipart/form-data 进行文件上传
						},
					});

					console.log('文件上传成功:', response);
					const resData = JSON.parse(response.data); // 解析返回的 JSON 数据
					const transcript = resData.transcript; // 获取返回的识别文本
					return transcript; // 成功返回识别结果
				} catch (error) {
					console.error('文件上传失败:', error);
					throw error;
				}
			},

			async dismissNpcTalk() {
				let foundNpcMessage = false;
				const history = this.chattingHistory;
				for (let i = this.displayedNpcChatIndex + 1; i < history.length; i++) {
					if (history[i].role !== 'user') {
						// Found the next NPC message
						this.displayedNpcChatIndex = i;
						this.talkingNpc = this.getNpcIndexByName(history[i].role);
						this.npcDialog = history[i].content;
						foundNpcMessage = true;
						break;
					}
				}
				if (!foundNpcMessage) {
					// No more NPC messages; change state to 'userTalk'
					console.log('no more npc, now user turn.');
					this.state = 'userTalk';
				}
			},

			// Helper method to get NPC index by name
			getNpcIndexByName(name) {
				return this.npcs.findIndex((npc) => npc.characterName === name);
			},
			async Pass() {
				const isPass = this.isPass; // 假设你从当前状态得知是否通过
				const gemCount = this.gemCount; // 假设 this.gemCount 是当前的宝石数量
				const diamonds = this.diamonds; // 假设 this.diamonds 是当前的钻石数量

				const evaluationResult = await evalBattlefield(this.chattingHistory, isPass, gemCount, diamonds);
				console.log('evaluation result:', evaluationResult);
				// const evaluationResult = await evalBattlefield(this.chattingHistory);
				// console.log('evaluation result:', evaluationResult);
				uni.setStorage({
					key: 'evalResult',
					data: evaluationResult,
				});

				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/battlefield/battlefield-summary',
					});
				}, 500);
			},
			handleContainerClick() {
				if (this.state === 'NpcTalk') {
					this.dismissNpcTalk();
				}
				// If needed, handle clicks in other states
			},

			initRecorderManager() {
				recorderManager.onStart(() => {
					console.log('Recorder start');
				});
				recorderManager.onStop(async (res) => {
					console.log('Recorder stop', res);

					// 如果录音被取消，则不进行上传或其他处理
					if (this.isCanceling) {
						console.log("Recording was canceled, no further action taken.");
						this.resetRecording(); // 重置录音状态
						return; // 直接返回，避免后续逻辑执行
					}
					const path = res.tempFilePath;

					try {
						const transcript = await this.uploadAndRecognizeSpeech(path);
						if (transcript.length === 0) {
							this.isCanceling = true;
							console.log("record is none, canceling...");
							this.resetRecording(); // 重置录音状态
							uni.showToast({
								title: '好像没有听清哦～',
								icon: 'none',
							});
							return; // 直接返回，避免后续逻辑执行
						}
						this.chattingHistory.push({
							role: 'user',
							content: [{
								type: 'text',
								text: transcript
							}]
							// words: transcript
						});

						const validChats = filterChatHistory(this.chattingHistory);
						const judgeResult = await reply(validChats);
						console.log("get judge result: ", judgeResult)
						const totalScore = judgeResult.moods ? judgeResult.moods.reduce((acc, mood) => {
							return acc + parseInt(mood.mood, 10);
						}, 0) : 0;

						this.isGoodReply = totalScore > 0;
						this.judgeTitle = this.isGoodReply ? '做的好' : '继续努力';

						//For test
						const done = await this.taskList.execute(judgeResult);
						console.log("Done :", done)
						this.judgeContent = judgeResult.comments;
						this.state = 'judge';
						console.log("state has been changed")

						// 遍历 judgeResult.moods 并根据角色调整 this.npcs 的 health 值
						judgeResult.moods.forEach((item) => {
							if (item.role === '领导') {
								this.npcs[0].health = Math.min(this.npcs[0].health + (parseInt(item
									.mood, 10) > 0 ? 4 : -2), 20);
							} else if (item.role === '同事A') {
								this.npcs[1].health = Math.min(this.npcs[1].health + (parseInt(item
									.mood, 10) > 0 ? 4 : -2), 20);
							} else if (item.role === '同事B') {
								this.npcs[2].health = Math.min(this.npcs[2].health + (parseInt(item
									.mood, 10) > 0 ? 4 : -2), 20);
							}
						});

						// Calculate total health
						const totalHealth = this.npcs.reduce((acc, npc) => acc + npc.health, 0);

						// Determine gemCount based on total health
						if (totalHealth >= 0 && totalHealth <= 20) {
							this.gemCount = 1;
						} else if (totalHealth >= 21 && totalHealth <= 40) {
							this.gemCount = 2;
						} else if (totalHealth >= 41 && totalHealth <= 60) {
							this.gemCount = 3;
						} else {
							this.gemCount = 0;
						}

						// 检查任何 NPC 的 health 是否 <= 0
						const anyNpcHealthLow = this.npcs.some(npc => npc.health <= 0);

						if (anyNpcHealthLow) {
							this.isPass = false; // NPC 生命值过低时设置为 false
							this.diamonds = 3;
							uni.setStorage({
								key: 'gemCount',
								data: this.gemCount,
								success: () => {
									console.log('gemCount 设置成功:', this.gemCount);
								},
								fail: (err) => {
									console.error('设置 gemCount 失败:', err);
								}
							})
							uni.setStorage({
								key: 'isPass',
								data: false,
								success: () => {
									console.log('isPass 设置成功:', true);
								},
								fail: (err) => {
									console.error('设置 isPass 失败:', err);
								}
							});
							// 如果有任何 NPC 的 health <= 0，跳转到另一个页面
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/battlefield/battlefield-summary',
								});
							}, 500);
						}
						if (done) {
							this.isPass = true; // NPC 生命值过低时设置为 false
							this.diamonds = 10;
							uni.setStorage({
								key: 'isPass',
								data: true,
								success: () => {
									console.log('isPass 设置成功:', true);
								},
								fail: (err) => {
									console.error('设置 isPass 失败:', err);
								}
							});
							uni.setStorage({
								key: 'gemCount',
								data: this.gemCount,
								success: () => {
									console.log('gemCount 设置成功:', this.gemCount);

								},
								fail: (err) => {
									console.error('设置 gemCount 失败:', err);
								}
							})
						}
						if (done || anyNpcHealthLow) {
							const npcHealthData = this.npcs.map(npc => npc.health);
							uni.setStorage({
								key: 'npcHealthData',
								data: npcHealthData,
								success: () => {
									console.log('NPC health data 保存成功:', npcHealthData);
								},
								fail: (err) => {
									console.error('保存 NPC health data 失败:', err);
								}
							});
							console.log("done: ", done, "anyNpcHealthLow:", anyNpcHealthLow);
							await this.Pass();
						}
					} catch (error) {
						console.error('在用户说话反馈过程中有错发生哦：', error);
					}
				});
			},
		},
		onLoad(option) {
			console.log("loaded")
			uni.getStorage({
				key: 'chats',
				success: (res) => {
					console.log('chatting histories,', res.data);
					this.chattingHistory = res.data.map(item => ({
						...item,
						content: item.words
					}));
					// this.chattingHistory = res.data;
				},
			});

			this.initRecorderManager();
		},
		watch: {
			isCanceling(newValue) {
				console.log("isCanceling : ", newValue)
				if (newValue) {
					console.log("Doing canceling ")
					this.handleRecordingDone();
				}
			}
		},
		computed: {
			shouldShadow() {
				return this.state === 'NpcTalk' || this.isRecording || this.showTippingCard;
			},

			displayedMessages() {
				const userChats = this.chattingHistory.filter((chat) => chat.role === 'user');
				const npcChats = this.chattingHistory.filter((chat) => ['领导', '同事A', '同事B'].includes(chat.role));

				// 只保留来自 'user' 的最新一条
				const latestUserChat = userChats.slice(-1); // 取最后一条

				// 保留来自 '领导'、'同事A' 和 '同事B' 的最新三条消息
				const latestNpcChats = npcChats.slice(-3); // 取最后三条

				// 合并 'user' 的消息和 'npc' 的消息
				return [...latestNpcChats, ...latestUserChat];
			},

			displayedHistory() {
				const userChats = this.chattingHistory.filter((chat) => chat.role === 'user');
				const npcChats = this.chattingHistory.filter((chat) => ['领导', '同事A', '同事B'].includes(chat.role));

				// 只保留来自 'user' 的最新一条
				const latestUserChat = userChats.slice(-1); // 取最后一条

				// 保留来自 '领导'、'同事A' 和 '同事B' 的最新三条消息
				const latestNpcChats = npcChats.slice(-3); // 取最后三条

				// 合并 'user' 的消息和 'npc' 的消息
				return [...latestNpcChats, ...latestUserChat];
			},
		},
	};
</script>

<style scoped>
	@import "./common.css";

	.container {
		position: relative;
		width: 100%;
		height: 100%;
		color: #fff;
	}

	.navbar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		position: relative;
		z-index: 3;
		margin-top: 80rpx;
		margin-left: 20rpx;
	}

	.back-button {
		width: 24px;
		height: 24px;
		margin-left: 20rpx;
	}

	.content {
		padding: 20px;
		text-align: center;
		position: relative;
		z-index: 3;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 200rpx;
	}

	.time-info {
		font-size: 16px;
		color: #bbb;
		margin-bottom: 20px;
	}

	.description {
		font-size: 16px;
		line-height: 1.6;
		color: #fff;
	}

	.content-item {
		margin-top: 30rpx;
	}

	.setting-group {
		display: flex;
		flex-direction: row;
	}

	.setting-item {
		width: 24px;
		margin-right: 20rpx;
		height: 24px;
	}

	.npc-group {
		display: flex;
		flex-direction: row;
		z-index: 3;
		justify-content: space-around;
		margin-top: 50rpx;
	}

	.player-action-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-around;
		z-index: 3;
		overflow: visible;
		position: absolute;
		bottom: 80rpx;
	}

	.action-icon {
		width: 30px;
		height: 30px;
	}

	.action-icon-middle {
		width: 40px;
		height: 40px;
	}

	.action-icon-hint {
		width: 30px;
		height: 30px;
		box-shadow: 0 0 18px #fed397;
	}

	.action-item {
		width: 40px;
		height: 40px;
		border-radius: 20px;
		background: rgba(253, 237, 200, 1);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.action-item-middle {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: linear-gradient(180deg,
				rgba(253, 242, 211, 1) 0%,
				rgba(241, 188, 116, 1) 100%);
	}

	.middle-container {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background-color: transparent;
		border: 2rpx solid rgba(253, 242, 211, 1);
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: -10rpx;
		box-shadow: 0px 0px 4px 0px rgba(254, 211, 151, 1);
		z-index: 100;
	}

	.recording-box {
		position: absolute;
		z-index: 11;
		top: 76%;
		left: 50%;
		transform: translateX(-50%);
		width: 406rpx;
		height: 160rpx;
		background-color: #fdedc8;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 32rpx;
		/* 确保录音框在最上层 */
	}

	.waveform {
		position: absolute;
		left: 20%;
		top: 20%;
		width: 80%;
		height: 120rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: row-reverse;
		justify-content: center;
		align-items: center;
	}

	.timer {
		position: relative;
		left: -15%;
		top: 12%;
		color: #252529;
		font-size: 30rpx;
		margin-bottom: 10rpx;
	}

	.cancel-text {
		position: relative;
		top: 50%;
		font-size: 26rpx;
		line-height: 34rpx;
		color: white;
	}

	.wave {
		width: 10rpx;
		/* 每个波形条的宽度 */
		background-color: #ff8e3a;
		/* 初始颜色 */
		border-radius: 5px;
		margin-left: 10rpx;
		/* 圆角效果 */
		animation: audio-wave 2s ease-in-out infinite;
	}

	.wave:nth-child(1) {
		animation-delay: 0.1s;
	}

	.wave:nth-child(2) {
		animation-delay: 0.2s;
	}

	.wave:nth-child(3) {
		animation-delay: 0.3s;
	}

	.wave:nth-child(4) {
		animation-delay: 0.4s;
	}

	.wave:nth-child(5) {
		animation-delay: 0.5s;
	}

	@keyframes audio-wave {

		0%,
		100% {
			height: 10rpx;
			/* 波形条的最小高度 */
			background-color: #2f2f38;
			transform: translateY(0);
		}

		50% {
			height: 40rpx;
			/* 波形条的最大高度 */
			background-color: #2f2f38;
			opacity: 52%;
			transform: translateY(-15px);
			/* 向上移动一点，制造波动效果 */
		}
	}

	.npc-talk-container {
		width: 100%;
		z-index: 4;
		background-color: transparent;
		position: absolute;
		top: 30%;
	}

	.shadowed {
		z-index: 2;
		opacity: 0.5;
	}

	.input-container {
		position: fixed;
		width: 80%;
		left: 10%;
		bottom: 200rpx;
		/* 将其固定在屏幕底部 */
		display: flex;
		justify-content: center;
		padding: 10px 0;
		/* 增加一些内边距 */
		background-color: rgba(255, 255, 255, 0.9);
		/* 可选的背景色，用于强调输入框 */
	}

	.keyboard-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.judge-container {
		width: 100%;
		z-index: 3;
		position: absolute;
		height: 350rpx;
		bottom: 0px;
	}

	.tipping-card {
		z-index: 3;
	}

	.chat-history-container {
		z-index: 3;
		width: 100%;
		display: flex;
		flex-direction: column;
		/* Ensure messages stack vertically */
		align-items: center;
		/* Align messages to the start */
	}

	.input-field {
		width: 80%;
		height: 40px;
		/* 确保高度适当 */
		padding: 10px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.navbar.shadowed,
	.npc-group.shadowed,
	.chat-history-container.shadowed,
	.player-action-container.shadowed {
		opacity: 0.5;
	}
</style>