<template>
	<view class="container" @click="handleContainerClick">
		<image class="background-image" src="/static/battlefield/background.png" mode="aspectFill" />
		<view class="overlay"></view>

		<view class="navbar" :class="{ shadowed: shouldShadow }">
			<image class="back-button" src="/static/battlefield/back-iconpng.png" @tap="goToDashboard"></image>
			<reward-bar :gemCount="gemCount"></reward-bar>
			<view class="setting-group">
				<!-- <image class="setting-item" src="/static/battlefield/copy.png" @click="missionShow = true"></image> -->
				<image class="setting-item" src="/static/battlefield/copy.png" @click="handleClickTaskList"></image>
				<image class="setting-item" src="/static/battlefield/setting.png"></image>
			</view>
		</view>
		<view v-if="showToolTips && isTooltipVisible && showTaskTooltip" class="taskTooltip">
			查看任务清单
		</view>

		<view class="npc-group" :class="{ shadowed: shouldShadow }">
			<npc-status v-for="npc in npcs" :key="npc.characterName" :health="npc.health" :avatar="npc.avatar"
				:characterName="npc.characterName"></npc-status>
		</view>

		<view class="chat-container" :class="{ shadowed: shouldShadow }" v-if="state !== 'NpcTalk'">
			<scroll-view class="chat-history-container" scroll-y :scroll-top="scrollTop" ref="chatHistoryContainer"
				:scroll-into-view="scrollIntoViewId">
				<view v-for="(chat, index) in displayedMessages" :key="index" :id="'chat-item-' + index">
					<npc-chat-box v-if="['领导', '同事A', '同事B'].includes(chat.role)" :key="'npc-' + index"
						:avatar="getBattlefieldAvatar(chat.role)" :name="chat.role"
						:dialog="chat.content"></npc-chat-box>
					<view v-else-if="chat.role === 'user'"
						:class="['message-wrapper', { 'animate': chat.shouldAnimate }]">
						<self-chat-box :key="'user' + index" :wording="chat.content" :commit="userJudgeContent"
							:isLastElement="index === displayedMessages.length - 1"></self-chat-box>
					</view>
					<view v-else-if="chat.role === 'tipping'"
						:class="['message-wrapper', { 'animate': chat.shouldAnimate }]">
						<tipping-chat-box :key="'tipping' + index" :tip="chat.content"></tipping-chat-box>
					</view>
				</view>
				<view class="loading-container" v-if="anasLoadingObj.loading">
					<image class="loading-icon" src="/static/battlefield/loading.png"></image>
					<span v-if="anasLoadingObj.text !== ''">{{ anasLoadingObj.text }}</span>
				</view>
			</scroll-view>
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

		<view v-if="state==='userTalk' && showToolTips && isTooltipVisible" class="tooltipOverlay" @click="hideTooltip">
		</view>
		<!-- tooltip -->
		<!-- tooltip for record -->
		<view v-if="state === 'userTalk' && showToolTips && isTooltipVisible && showRecordTooltip"
			class="recordTooltip">
			长按开始录音
		</view>
		<!-- tooltip for hint -->
		<view v-if="state === 'userTalk' && showToolTips && isTooltipVisible && showHintTooltip" class="hintTooltip">
			需要帮助吗？选择锦囊卡片
		</view>
		<view class="player-action-container" :class="{ shadowed: shouldShadow }">
			<view class="action-item" v-if="!isRecording" @click="handleClickInput()">
				<image class="action-icon" src="/static/battlefield/keyboard.png"></image>
			</view>
			<view class="middle-container">
				<view class="action-item action-item-middle" @touchstart="handleClickRecording"
					@touchend="handleRecordingDone" @touchmove="handleTouchMove" @click="hideTooltip">
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

		<view class="popup-overlay" v-if="showInput" @click="showInput = false;">
			<view class="input-container" @click.stop>
				<!-- <input type="text" :focus="focusInput" placeholder="请输入..." /> -->
				<textarea placeholder="请输入文字" v-model="inputContent" auto-height @blur="inputRecordingBlur" />
			</view>
		</view>

		<view class="judge-container" v-if="state === 'judge' || state === 'judgeTry'">
			<judge :title="judgeTitle" :wording="judgeContent" @judge="gotoNextRound" :good-judge="isGoodReply"
				:isCompleteTask="isCompleteTask" :currentTask="currentTask"></judge>
		</view>

		<!-- 精囊卡片 -->
		<view v-if="showCardPopup" class="popup-overlay" @click="showCardPopup = false">
			<CueCardsVue @closeCueCard="closeCueCard" @exchangeClick="exchangeClick"
				:cardButtonLoading="cardButtonLoading" :jobId="jobId" />
		</view>

		<view v-if="missionShow" class="judge-mission-container">
			<MissionList :listData="taskList.taskList" @closeMissionCard="closeMissionCard" />
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
	import MissionList from '../../components/MissionList.vue';
	import CueCardsVue from '../../components/CueCards.vue';
	import {
		reply,
		startField,
		helpReply,
		hint,
		continueChat,
		evalBattlefield,
		checkShowToolTips,
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
			MissionList,
			CueCardsVue
		},
		data() {
			return {
				judgeTitle: '',
				judgeContent: '',
				userJudgeContent: '',
				taskList: new TaskList([]),
				isGoodReply: true,
				state: 'NpcTalk', // Current state
				userTalkCount: 0, // 计数器，用来控制tooltip的出现时机
				showToolTips: checkShowToolTips(2) ? checkShowToolTips(2) : true, // 假设tooltip显示状态为 true，等后端数据返回后更新
				showRecordTooltip: true,
				showHintTooltip: false,
				showTaskTooltip: false,
				isTooltipVisible: true, // 控制tooltip的可见性，默认可见
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
				isRecording: false, // Controls the display state of left and right icons
				getBattlefieldAvatar,
				showCardPopup: false,
				cardButtonLoading: false,
				selectedCard: 0,
				missionShow: false,
				inputContent: '',
				missionResultList: [{
						num: 10,
						content: '',
					},
					{
						num: 30,
						content: '',
					},
				],
				isRecording: false, // Controls the display state of recording box
				remainingTime: 30, // 录音剩余时间
				isCanceling: false, // 判断是否处于取消状态
				touchStartY: 0, // 记录touchstart的位置
				touchThreshold: -100, // 上滑取消的阈值（负值表示向上滑动）
				countdownInterval: null, // 倒计时的定时器
				getBattlefieldAvatar,
				anasLoadingObj: {
					loading: false,
					text: '',
				},
				jobId: '',
				answerNotGoodNum: 0,
				totalTaskNum: 1,
				completedTaskNum: 1,
				scrollIntoViewId: '',
				isCompleteTask: false,
				currentTask: null,
			};
		},
		created() {
			console.log("created")
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
			this.taskList.addTask(new Task(1, '让老板对你点的菜很满意', async (judgeResult) => {
				let res = "";

				judgeResult.moods.filter((mood) => {
					if (mood.role === "同事B")
						res = mood.mood;
				})
				const bMood = parseInt(res ? res : 0, 10);
				if (bMood < 0 && !this.taskList.getTask(1).once) {
					this.judgeTitle =
						`做得好！ ${this.taskList.getTask(1).title} (${this.taskList.doneTaskLength + 1}/${this.taskList.taskLength})`;
					return true;
				}
				return false;
			}));
		},
		methods: {
			goToDashboard() {
				uni.navigateTo({
					url: '/pages/dashboard/dashboard?currentView=dashboard2',
				});
			},
			handleClickTaskList() {
				this.missionShow = true; // 显示任务
				this.showTaskTooltip = false; // 隐藏 Tooltip
				this.isTooltipVisible = false; //去掉蒙层
			},
			handleClickRecording(e) {
				// console.log("click start , isRecording: ", this.isRecording)
				this.isRecording = true;
				this.showInput = false;
				this.inputContent = '';
				this.isCanceling = false;
				this.remainingTime = 30;
				this.touchStartY = e.touches[0].clientY;
				this.startRecording();
				this.startCountdown();
				// 隐藏tooltip
				this.isTooltipVisible = false;
				this.showRecordTooltip = false;
				// console.log(("change tooltip visible into:", this.isTooltipVisible));
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
			hideTooltip() {
				// 隐藏工具提示
				this.isTooltipVisible = false;
				this.showRecordTooltip = false;
				this.showHintTooltip = false;
				console.log(("change tooltip visible into:", this.isTooltipVisible));
			},
			async gotoNextRound() {
				if (!this.isGoodReply) {
					this.retry();
					this.answerNotGoodNum = 0;
					return;
				}
				if (this.task1Finished) {
					await this.Pass();
				}
				const nextRound = await continueChat(this.chattingHistory);
				console.log('next round data', nextRound);
				this.chattingHistory = nextRound.dialog;
				console.log('after concat, chatting history:', this.chattingHistory);
				// let someoneTalked = false;
				this.displayedNpcChatIndex = 0;
				this.talkingNpc = this.getNpcIndexByName(this.chattingHistory[0].role);

				this.state = 'NpcTalk';
				const isTask2 = await this.checkBossComplimentTask2(nextRound.dialog);
				// console.log(isTask2);
				// if(isTask2) {
				// }
				// this.chattingHistory = this.chattingHistory.concat(nextRound.dialog);
				// for (; this.displayedNpcChatIndex < this.chattingHistory.length;
				// 	++this.displayedNpcChatIndex
				// ) {
				// 	let npcIndex = getNpcIndex(this.chattingHistory[this.displayedNpcChatIndex]);
				// 	if (npcIndex >= 0) {
				// 		this.talkingNpc = npcIndex;
				// 		console.log('someone talk:', this.talkingNpc);
				// 		someoneTalked = true;
				// 		break;
				// 	}
				// }
				// console.log(this.displayedNpcChatIndex);
				// if (!someoneTalked) {
				// 	console.log(this.displayedNpcChatIndex);
				// 	this.displayedNpcChatIndex--;
				// }
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
				this.userJudgeContent = '';
				console.log('开始录音');
			},
			handleRecordingDone() {
				// console.log('Released');
				if (this.isRecording) {
					recorderManager.stop();
					this.isRecording = false;
				}
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
			// showInput = true; focusInput = true;
			handleClickInput() {
				this.showInput = true;
				this.focusInput = true;
				this.inputContent = '';
			},
			help() {
				console.log('Choose help card');
			},
			hint() {
				console.log('Choose hint card');
			},
			clickHintButton() {
				this.state = 'hint';
				this.showCardPopup = true;
				this.showHintTooltip = false;
				this.isTooltipVisible = false;
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
				if (this.task1Finished) {
					uni.setStorage({
						key: 'isPass',
						data: true,
					});
					const gemCount = this.calculateStars();
					uni.setStorage({
						key: 'gemCount',
						data: gemCount,
					});
				}
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/battlefield/battlefield-summary',
					});
				}, 1000);
			},
			calculateStars() {
				const totalMood = this.npcs.reduce((sum, npc) => sum + npc.health, 0);
				const adjustedMood = totalMood; // 调整情绪值，确保为正数
				console.log(adjustedMood);
				if (adjustedMood >= 41 && adjustedMood <= 60) {
					return 3; // 三颗星
				} else if (adjustedMood >= 21 && adjustedMood <= 40) {
					return 2; // 两颗星
				} else if (adjustedMood >= 0 && adjustedMood <= 20) {
					return 1; // 一颗星
				} else {
					return 0; // 如果调整后的情绪值小于0，返回0颗星
				}
			},
			handleContainerClick() {
				if (this.state === 'NpcTalk') {
					console.log('handleContainerClick');
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

					this.anasLoadingObj = {
						loading: true,
						text: '',
					};
					// 如果录音被取消，则不进行上传或其他处理
					if (this.isCanceling) {
						console.log("Recording was canceled, no further action taken.");
						this.resetRecording(); // 重置录音状态
						this.anasLoadingObj.loading = false;
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
							this.anasLoadingObj.loading = false;
							return; // 直接返回，避免后续逻辑执行
						}
						const newMessage = {
							role: 'user',
							content: transcript,
							shouldAnimate: false
						};
						this.chattingHistory.push(newMessage);
						this.$nextTick(() => {
							setTimeout(() => {
								newMessage.shouldAnimate = true;
								this.anasLoadingObj.text = '分析中';
							}, 50);
						});
						const validChats = filterChatHistory(this.chattingHistory);
						const judgeResult = await reply(validChats);

						await this.handleRecorderReply(judgeResult);
						this.anasLoadingObj.loading = false;

					} catch (error) {
						console.error('在用户说话反馈过程中有错发生哦：', error);
						this.anasLoadingObj.loading = false;
						if (this.chattingHistory.length > 0) {
							this.chattingHistory.pop();
						}
					}
				});
			},
			async inputRecordingBlur() {
				this.showInput = false;
				console.log('输入结果:', this.inputContent);
				console.log(this.taskList);
				if (this.inputContent !== "") {
					this.anasLoadingObj = {
						loading: true,
						text: '',
					};
					this.userJudgeContent = '';
					const newMessage = {
						role: 'user',
						content: this.inputContent,
						shouldAnimate: false
					};
					this.chattingHistory.push(newMessage);
					this.$nextTick(() => {
						// Force a repaint to trigger the animation
						void this.$el.offsetWidth;

						newMessage.shouldAnimate = true;
						this.anasLoadingObj.text = '分析中';

						// 使用 requestAnimationFrame 确保动画在下一帧开始
						requestAnimationFrame(() => {
							setTimeout(() => {
								// 这个空函数强制浏览器应用更改
							}, 0);
						});
					});
					try {
						const validChats = filterChatHistory(this.chattingHistory);
						const judgeResult = await reply(validChats);
						console.log("judge Result:", judgeResult);
						await this.handleRecorderReply(judgeResult);
						this.inputContent = '';
						this.anasLoadingObj.loading = false;
					} catch (error) {
						console.error('在用户说话反馈过程中有错发生哦：', error);
						this.anasLoadingObj.loading = false;
						if (this.chattingHistory.length > 0) {
							this.chattingHistory.pop();
						}
						this.anasLoadingObj.loading = false;
					}
				}
			},
			async exchangeClick(selectedCard) {
				// console.log(selectedCard);
				this.cardButtonLoading = true;
				const validChats = filterChatHistory(this.chattingHistory);
				let judgeResult = null;
				this.userJudgeContent = '';
				try {
					if (selectedCard == 1) {
						this.anasLoadingObj = {
							loading: true,
							text: '生成中',
						};
						judgeResult = await helpReply(validChats);
						// console.log(judgeResult.responsive);
						if (judgeResult.responsive) {
							this.showCardPopup = false
							const newMessage = {
								role: 'user',
								content: judgeResult.responsive,
								shouldAnimate: false
							};
							this.chattingHistory.push(newMessage);
							this.$nextTick(() => {
								// Force a repaint to trigger the animation
								void this.$el.offsetWidth;

								newMessage.shouldAnimate = true;
								this.anasLoadingObj.text = '分析中';

								// 使用 requestAnimationFrame 确保动画在下一帧开始
								requestAnimationFrame(() => {
									setTimeout(() => {
										// 这个空函数强制浏览器应用更改
									}, 0);
								});
							});

							const validChatsRepy = filterChatHistory(this.chattingHistory);
							const judgeResultRepy = await reply(validChatsRepy);
							await this.handleRecorderReply(judgeResultRepy);
						}
					}
					if (selectedCard == 2) {
						this.anasLoadingObj = {
							loading: true,
							text: '生成中',
						};
						judgeResult = await hint(validChats);
						// console.log(judgeResult.tips);
						if (judgeResult.tips) {
							this.showCardPopup = false
							const newMessage2 = {
								role: 'tipping',
								content: judgeResult.tips,
								shouldAnimate: false
							};
							this.chattingHistory.push(newMessage2);
							this.$nextTick(() => {
								// Force a repaint to trigger the animation
								void this.$el.offsetWidth;

								newMessage2.shouldAnimate = true;
								this.anasLoadingObj.text = '分析中';

								// 使用 requestAnimationFrame 确保动画在下一帧开始
								requestAnimationFrame(() => {
									setTimeout(() => {
										// 这个空函数强制浏览器应用更改
									}, 0);
								});
							});
						}
					}
					this.cardButtonLoading = false;
					this.anasLoadingObj.loading = false;
				} catch (error) {
					console.error('在用户说话反馈过程中有错发生哦：', error);
					this.anasLoadingObj.loading = false;
				}
			},
			async handleRecorderReply(judgeResult) {
				try {
					if (judgeResult) {

						await this.checkBossComplimentTask1(judgeResult);

						this.updateScrollIntoView();


						// 遍历 judgeResult.moods 并根据角色调整 this.mood 的值
						judgeResult.moods.forEach(item => {
							let randomValue;
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
						if (this.task1Finished) {
							await this.Pass();
						}
						return true; // 添加返回值，表示处理成功
					} else {
						throw new Error('judgeResult is undefined or null');
					}
				} catch (error) {
					console.error('处理回复时出错:', error);
					uni.showToast({
						title: '处理回复时出错，请重试',
						icon: 'none',
						duration: 2000
					});
					if (this.chattingHistory.length > 0) {
						this.chattingHistory.pop();
					}
					return false; // 添加返回值，表示处理失败
				}
			},
			async checkBossComplimentTask1(judgeResult) {
				if (judgeResult) {
					const totalScore = judgeResult.moods.reduce((sum, item) => sum + parseInt(item.mood, 10), 0);

					if (totalScore > 0) {
						this.isGoodReply = true;
						this.judgeContent = judgeResult.comments;
						const allPositive = judgeResult.moods.every(item => parseInt(item.mood, 10) > 0);
						if (allPositive) {
							if (!this.task1Finished && !this.taskList.getTask(0).one) {
								this.state = 'judge';
								console.log("allPositive:", allPositive);
								this.currentTask = this.taskList.getTask(0);
								const totalTaskLength = this.taskList.getTotalTaskLength();
								console.log("Total task length:", totalTaskLength);
								this.taskList.getTask(0)._status = true;
								this.taskList.getTask(0)._completedRoundNum++;
								if (this.taskList.getTask(0).totalRoundNum == this.taskList.getTask(0)
									._completedRoundNum) {
									this.isCompleteTask = true;
									this.taskList.getTask(0).one = true;
									this.taskList.doneTaskLength++;
									this.judgeTitle = `(${this.taskList.doneTaskLength}/${totalTaskLength})` + ' 任务达成';
									if (this.taskList.doneTaskLength >= totalTaskLength) {
										this.task1Finished = true;
									}
								} else {
									this.judgeTitle = '任务达成';
									this.isCompleteTask = true;
								}
							} else {
								await this.gotoNextRound();
							}
						} else {
							this.state = 'judge';
							this.judgeTitle = "做的好";
							this.isCompleteTask = false;
						}

					} else {
						if (this.answerNotGoodNum < 2) {
							this.answerNotGoodNum++;
							this.isGoodReply = true;
							// this.state = 'userTalk';
							// this.userJudgeContent = judgeResult.comments;
							await this.gotoNextRound();
						} else {
							this.isGoodReply = false;
							this.isTooltipVisible = true;
							this.showHintTooltip = true;
							console.log("tooltip for hint", this.isTooltipVisible);
							this.judgeTitle = "还有提升空间";
							this.isCompleteTask = false;
							this.judgeContent = judgeResult.comments;
							this.state = 'judgeTry';
						}
					}
				}
			},
			async checkBossComplimentTask2(dialog) {
				let taskCompleted = false;
				if (!this.task1Finished && !this.taskList.getTask(1).one) {
					const bossCompliment = "你点的菜真不错";
					for (let chat of dialog) {
						if (chat.role === '领导' && chat.content.includes(bossCompliment)) {
							if (this.taskList && this.taskList.getTask(1)) {
								console.log("task2 is true");
								this.isGoodReply = true;
								this.state = 'judge';
								const task2 = this.taskList.getTask(1);
								this.currentTask = task2;
								task2._status = true;
								task2._completedRoundNum++;
								if (task2.totalRoundNum === task2._completedRoundNum) {
									this.isCompleteTask = true;
									task2.one = true;
									this.taskList.doneTaskLength++;
									const totalTaskLength = await this.taskList.getTotalTaskLength();
									this.judgeTitle = `(${this.taskList.doneTaskLength}/${totalTaskLength})` + ' 任务达成';
									console.log("Task 2 completed");
									taskCompleted = false;
								} else {
									this.judgeTitle = '任务达成';
									this.isCompleteTask = true;
									taskCompleted = true;
								}
							}
							break;
						} else {
							taskCompleted = true;
						}
					}
					const totalTaskLength = await this.taskList.getTotalTaskLength();
					if (this.taskList.doneTaskLength >= totalTaskLength) {
						console.log("Task 222 completed");
						this.task1Finished = true;
						await this.Pass();
						taskCompleted = false;
					}
				} else {
					taskCompleted = true;
				}
				return taskCompleted;
			},
			closeCueCard() {
				this.showCardPopup = false
			},
			closeMissionCard() {
				this.missionShow = false;
			},
			updateScrollIntoView() {
				this.$nextTick(() => {
					const lastMessageId = 'chat-item-' + (this.displayedMessages.length - 1);
					this.scrollIntoViewId = lastMessageId;
				});
			}
		},
		onLoad(option) {
			console.log("loaded", option)
			uni.getStorage({
				key: 'chats',
				success: (res) => {
					console.log('chatting histories,', res.data);
					this.chattingHistory = res.data.map(item => ({
						...item,
						content: item.words
					}));
				},
			});
			this.jobId = option.jobId || '154ee592-287b-4675-b8bd-8f88de348476';
			this.initRecorderManager();
		},
		watch: {
			isCanceling(newValue) {
				console.log("isCanceling : ", newValue)
				if (newValue) {
					console.log("Doing canceling ")
					this.handleRecordingDone();
				}
			},
			chattingHistory: {
				handler(newValue, oldValue) {
					// console.log(newValue, oldValue)
					this.updateScrollIntoView();
				},
				deep: true
			},
			state(newVal, oldVal) {
				if (newVal === 'userTalk') {
					this.userTalkCount++; // 增加计数器

					// 第二次进入 'userTalk' 时显示任务tooltip
					if (this.userTalkCount === 2) {
						this.showTaskTooltip = true;
						this.isTooltipVisible = true;
					}
				}
			}
		},
		computed: {
			shouldShadow() {
				return this.state === 'NpcTalk' || this.isRecording || this.showTippingCard;
			},

			displayedMessages() {
				const validChats = filterChatHistory(this.chattingHistory);
				const userAndNpcChats = validChats.filter(chat =>
					chat.role === 'user' || chat.role === '领导' || chat.role === '同事A' || chat.role === '同事B' || chat
					.role === 'tipping'
				);
				console.log("displayedMessages")
				// 按顺序展示user和npc的记录
				return userAndNpcChats;
				// const userChats = this.chattingHistory.filter((chat) => chat.role === 'user');
				// const npcChats = this.chattingHistory.filter((chat) => ['领导', '同事A', '同事B'].includes(chat.role));

				// // 只保留来自 'user' 的最新一条
				// const latestUserChat = userChats.slice(-1); // 取最后一条

				// // 保留来自 '领导'、'同事A' 和 '同事B' 的最新三条消息
				// const latestNpcChats = npcChats.slice(-3); // 取最后三条

				// 合并 'user' 的消息和 'npc' 的消息
				// return [...latestNpcChats, ...latestUserChat];
				// return [...npcChats, ...userChats];
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
<style>
	.uni-scroll-view {
		position: relative;
	}

	.uni-scroll-view-content {
		height: auto;
		padding-bottom: 60rpx;
	}
</style>
<style scoped>
	@import "./common.css";

	.container {
		/* position: relative; */
		width: 100%;
		height: 100%;
		color: #fff;
		height: 100vh;
	}

	.navbar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		position: relative;
		z-index: 12;
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
		position: relative;
	}

	.setting-item {
		width: 24px;
		margin-right: 20rpx;
		height: 24px;
		z-index: 12;
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
		z-index: 10;
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
		z-index: 12;
	}

	.recordTooltip {
		position: absolute;
		z-index: 12;
		top: 83%;
		left: 31%;
		width: 105px;
		padding: 10px 20px;
		/* transform: translateX(-50%); */
		background-color: rgba(16, 16, 16, 0.4);
		border-radius: 10px;
	}

	.hintTooltip {
		position: absolute;
		z-index: 12;
		top: 83%;
		right: 1%;
		width: 205px;
		padding: 10px 20px;
		/* transform: translateX(-50%); */
		background-color: rgba(16, 16, 16, 0.4);
		border-radius: 10px;
	}


	.taskTooltip {
		position: absolute;
		z-index: 12;
		top: 11%;
		right: 1%;
		width: 105px;
		padding: 10px 20px;
		/* transform: translateX(-50%); */
		background-color: rgba(16, 16, 16, 0.4);
		border-radius: 10px;
	}

	.tooltipOverlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(46, 46, 47, 0.75);
		z-index: 3;
	}

	.recording-box {
		position: absolute;
		z-index: 12;
		top: 76%;
		right: 50%;
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
		/* justify-content: center; */
		padding: 20rpx 0;
		border-radius: 40rpx;
		/* 增加一些内边距 */
		background-color: #FDEDC8;
		/* 可选的背景色，用于强调输入框 */
	}

	textarea {
		padding: 0 20rpx;
		color: #252529;
	}

	.keyboard-container {
		width: 100%;
		z-index: 3;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.judge-container {
		width: 100%;
		z-index: 100;
		position: absolute;
		height: 350rpx;
		bottom: 0px;
	}

	.tipping-card {
		z-index: 3;
	}

	.chat-container {
		z-index: 3;
		width: 100%;
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
		height: 100vh;
		/* 使父容器高度占满整个视口高度 */
	}

	.chat-history-container {
		z-index: 3;
		width: 654rpx;
		height: 70%;
		margin: auto;
		overflow-y: auto;
		overflow-x: hidden;
		margin-top: 20rpx;
	}

	/* 消息动效 */
	.message-wrapper {
		opacity: 0;
		transform: translateX(-100%);
		transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
	}

	.message-wrapper.animate {
		opacity: 1;
		transform: translateX(0);
	}

	.message-wrapper2 {
		opacity: 0;
		transform: translateX(-100%);
		transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
	}

	.message-wrapper2.animate2 {
		opacity: 1;
		transform: translateX(0);
	}

	/* loading */
	.loading-container {
		display: flex;
		align-items: center;
		justify-content: right;
		margin-top: 10px;
		margin-right: 10px;
	}

	.loading-icon {
		width: 40rpx;
		height: 40rpx;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.loading-container span {
		margin-left: 8px;
		font-size: 13px;
		color: #D7D8E0;
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

	.judge-mission-container {
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
	}
</style>