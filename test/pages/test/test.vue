<template>
	<view class="container">
		<!-- 背景图 -->
		<image class="background-image" :src="backgroundImageSrc" mode="aspectFill" />

		<view class="progress-container">
			<view class="progress-bar">
				<view class="progress" :style="{ width: `${progress}%` }"></view>
			</view>
			<text class="progress-text">{{ currentScene }}/{{ totalScenes }}</text>
		</view>

		<!-- Test page content -->
		<template v-if="currentPage === 'test'">
			<!-- <view class="banner-container">
				<image class="logo" src="/static/signa.png" mode="aspectFit" />
				<view style="display: flex;">
					<text class="room-text">{{ scenarioData.location }}</text>
				</view>
			</view> -->
			<view class="banner-container">
				<image class="logo" src="/static/signa.png" mode="aspectFit" />
				<view class="test">
					<text class="room-text">{{ scenarioData.location }}</text>
				</view>
			</view>
			<view class="text-box" @tap="navigateToTest1" :class="{ 'disabled': isLoading }">
				<text class="text-content">{{ background }}</text>
				<view class="expand-icon">
					<image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
				</view>
			</view>
		</template>

		<!-- Test1 page content -->
		<template v-else-if="currentPage === 'test1'">
			<onboarding-chat-bubble :userName="scenarioData.role" :avatar="npcAvatar" @tap="navigateToTest2"
				:description="description" :class="{ 'disabled': isLoading }"></onboarding-chat-bubble>
		</template>

		<!-- Test2 page content -->
		<template v-else-if="currentPage === 'test2'">
			<view class="options-container">
				<view v-for="(option, index) in scenarioData && scenarioData.options
            ? scenarioData.options
            : []" :key="index" :class="['text-box1', { selected: selectedOptionIndex === index }]"
					@click="selectOption(index)">
					<text class="text-content1" :style="{ color: option.textColor || 'white' }">
						{{ option.text }}
					</text>
				</view>
				<view class="next-button-container">
					<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @click="nextPage"
						:class="{ 'disabled': isLoading }">
					</image>
				</view>
			</view>
		</template>

		<!-- Test3 page content -->
		<template v-else-if="currentPage === 'test3'">
			<view class="banner-container">
				<image class="logo" src="/static/signa.png" mode="aspectFit" />
				<view class="test">
					<text class="room-text">{{ scenarioData.location }}</text>
				</view>
			</view>
			<view class="text-box" @tap="navigateToTest4" :class="{ 'disabled': isLoading }">
				<text class="text-content">{{ background }}</text>
				<view class="expand-icon">
					<image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
				</view>
			</view>
		</template>

		<!-- Test4 page content -->
		<template v-else-if="currentPage === 'test4'">
			<onboarding-chat-bubble :userName="scenarioData.role" :avatar="'/static/npc1.png'"
				:dismiss="navigateToTest5" :description="description"
				:class="{ 'disabled': isLoading }"></onboarding-chat-bubble>
		</template>

		<!-- Test5 page content -->
		<template v-else-if="currentPage === 'test5'">
			<view class="options-container">
				<view v-for="(option, index) in scenarioData && scenarioData.options
            ? scenarioData.options
            : []" :key="index" :class="['text-box1', { selected: selectedOptionIndex === index }]"
					@click="selectOption(index)">
					<text class="text-content1" :style="{ color: option.textColor || 'white' }">
						{{ option.text }}
					</text>
				</view>
				<view class="next-button-container">
					<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @click="nextPage"
						:class="{ 'disabled': isLoading }">
					</image>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import {
		findLastName,
		getAvatar
	} from "../../scripts/locate_name";
	import OnboardingChatBubble from "/components/OnboardingChatBubble.vue";
	import apiService from "@/services/api-service";

	export default {
		components: {
			OnboardingChatBubble,
		},
		data() {
			return {
				currentPage: "test",
				userId: "",
				username: "",
				gender: "",
				selectedOptions: [],
				birthday: null,
				scenarioData: null,
				background: "请点击下方箭头继续",
				jobId: "",
				npcName: "",
				npcAvatar: "",
				description: "",
				firstScene: false,
				selectedOptionIndex: null,
				num: null,
				baseURL: apiService.API_ENDPOINT,
				progress: 0,
				currentScene: 0,
				totalScenes: 5,
				isFirstScene: true, // Add this new property
				scenarioId: 1, // Add this new property
				isLoading: false,
				chatHistory: [], // Keep this new property
			};
		},
		onLoad(option) {
			console.log("Received options:", option);
			this.initializeData(option);
			this.initializeScenario();
			// this.sendDataToBackend();
		},
		methods: {
			initializeData(option) {
				this.userId = option.userId || "";
				this.username = decodeURIComponent(option.username || "");
				this.gender = option.gender || "";
				this.jobId = option.jobId || "";
				console.log("jobID:", this.jobId);
				this.background = option.background || "";
				this.scenarioId = option.scenarioId || this.scenarioId;

				if (option.options) {
					try {
						this.selectedOptions = JSON.parse(decodeURIComponent(option.options));
					} catch (e) {
						console.error("Error parsing options:", e);
						this.selectedOptions = [];
					}
				}

				if (option.birthday) {
					try {
						this.birthday = JSON.parse(decodeURIComponent(option.birthday));
					} catch (e) {
						console.error("Error parsing birthday:", e);
						this.birthday = null;
					}
				}

				console.log("Parsed data:", {
					userId: this.userId,
					username: this.username,
					gender: this.gender,
					selectedOptions: this.selectedOptions,
					birthday: this.birthday,
					jobId: this.jobId,
				});
			},
			async initializeScenario() {
				try {
					this.backgroundImageSrc = `/static/bg${this.scenarioId}.png`;
					console.log("this scenario id:", this.scenarioId);
					await this.getScenarioData();
				} catch (error) {
					console.error("Error initializing scenario:", error);
					uni.showToast({
						title: "初始化失败",
						icon: "none",
					});
				}
			},

			getScenarioIdFromStorage() {
				return new Promise((resolve) => {
					uni.getStorage({
						key: "scenarioId",
						success: (res) => {
							resolve(res.data);
							console.log("get scenarioid by local", res.data);
						},
						fail: () => {
							resolve(null); // 如果未找到，返回 null
							console.log("unable to get scenario id by local");
						},
					});
				});
			},
			getScenarioData() {
				// const requestMethod = this.isFirstScene ?
				// 	apiService.startScenario(this.jobId) :
				// 	apiService.getCurrentScenario(this.jobId);
				const requestMethod = apiService.getCurrentScenario(this.jobId);
				return requestMethod
					.then((res) => {
						console.log("get current Scenario data:", res.scenario_id);
						this.scenarioData = res.scene.scenes || res;
						// this.scenarioId = res.scenario_id || 1;
						this.handleScenarioData();
						this.updateProgress();
						this.isFirstScene = false;
					})
					.catch((err) => {
						console.error("Error getting scenario data:", err);
						throw err; // Re-throw the error to be caught in navigateToTest3
					});
			},
			handleScenarioData() {
				if (this.scenarioData) {
					this.description = this.scenarioData.description || "无法获取背景信息";
					this.background = this.scenarioData.background || "请点击下方箭头继续";

					// 如果有选项，重置选项的文字颜色
					if (this.scenarioData.options) {
						this.scenarioData.options = this.scenarioData.options.map(
							(option) => ({
								...option,
								textColor: "white",
							})
						);
					} else {
						this.scenarioData.options = [];
					}

					// 重置选中的选项
					this.selectedOptionIndex = null;
					this.num = null;
				} else {
					console.warn("Background information not found in scenario data");
					this.description = "无法获取背景信息";
					this.background = "���点击下方箭头继续";
					this.scenarioData = {
						options: [],
					};
				}
			},
			navigateToTest1() {
				if (this.isLoading) return;
				this.isLoading = true;
				uni.showLoading({
					title: '加载中...'
				});

				this.analyzeBackground();
				this.getScenarioData()
					.then(() => {
						this.currentPage = "test1";
					})
					.catch((error) => {
						console.error("Error loading scenario data:", error);
						uni.showToast({
							title: "加载失败，请重试",
							icon: "none",
						});
					})
					.finally(() => {
						this.isLoading = false;
						uni.hideLoading();
					});
			},
			navigateToTest2() {
				if (this.isLoading) return;
				this.isLoading = true;
				uni.showLoading({
					title: '加载中...'
				});

				this.currentPage = "test2";
				this.getScenarioData()
					.catch((error) => {
						console.error("Error loading scenario data:", error);
						uni.showToast({
							title: "加载失败，请重试",
							icon: "none",
						});
					})
					.finally(() => {
						this.isLoading = false;
						uni.hideLoading();
					});
			},
			navigateToTest3() {
				// Show loading indicator
				uni.showLoading({
					title: "加载中...",
				});

				// Get new scenario data first
				this.getScenarioData()
					.then(() => {
						// Update the page only after new data is loaded
						this.currentPage = "test3";
						// Hide loading indicator
						uni.hideLoading();
					})
					.catch((error) => {
						console.error("Error loading scenario data:", error);
						uni.hideLoading();
						uni.showToast({
							title: "加载失败，请重试",
							icon: "none",
						});
					});
			},
			navigateToTest4() {
				if (this.isLoading) return;
				this.isLoading = true;
				uni.showLoading({
					title: '加载中...'
				});

				this.currentPage = "test4";
				this.getScenarioData()
					.catch((error) => {
						console.error("Error loading scenario data:", error);
						uni.showToast({
							title: "加载失败，请重试",
							icon: "none",
						});
					})
					.finally(() => {
						this.isLoading = false;
						uni.hideLoading();
					});
			},
			navigateToTest5() {
				if (this.isLoading) return;
				this.isLoading = true;
				uni.showLoading({
					title: '加载中...'
				});

				this.currentPage = "test5";
				this.getScenarioData()
					.catch((error) => {
						console.error("Error loading scenario data:", error);
						uni.showToast({
							title: "加载失败，请重试",
							icon: "none",
						});
					})
					.finally(() => {
						this.isLoading = false;
						uni.hideLoading();
					});
			},
			analyzeBackground() {
				if (this.background) {
					this.npcName = findLastName(this.background);
					this.npcAvatar = getAvatar(this.npcName);
				}
			},
			selectOption(index) {
				this.selectedOptionIndex = index;
				this.num = index + 1;
				console.log(
					"Selected option:",
					this.num,
					this.scenarioData.options[index].text
				);

				this.scenarioData.options.forEach((option, i) => {
					option.textColor = i === index ? "black" : "white";
				});
			},
			nextPage() {
				if (this.num === null) {
					uni.showToast({
						title: "请选择一个选项",
						icon: "none",
					});
					return;
				}

				// Add the current scenario and selected option to chat history
				this.chatHistory.push({
					background: this.background,
					description: this.description,
					selectedOption: this.scenarioData.options[this.selectedOptionIndex].text
				});

				console.log("Sending data to backend:", {
					choice: this.num,
					job_id: this.jobId,
				});

				// Log the chat history before navigating
				console.log("Chat History:", this.chatHistory);

				apiService
					.chooseScenario(this.num, this.jobId)
					.then((result) => {
						console.log("Response data:", result);

						if (
							result.message ===
							"Final choice made. Processing data in background."
						) {
							this.navigateToLoading();
						} else {
							// 更新当前场景
							this.currentScene++;
							// 重置选项
							this.selectedOptionIndex = null;
							this.num = null;
							// 根据需要更新 currentPage
							this.navigateToNextPage();
						}

						// 更新进度
						this.updateProgress();
					})
					.catch((error) => {
						console.error("Detailed error:", error);
						uni.showToast({
							title: `发生错误：${error.message}`,
							icon: "none",
						});
					});
			},
			navigateToNextPage() {
				// 根据当前页面，决定下一个页面
				if (this.currentPage === "test2") {
					this.navigateToTest3();
				} else if (this.currentPage === "test5") {
					this.navigateToTest3();
				} else {
					this.navigateToTest3();
				}
			},
			navigateToLoading() {
				const loadingPageUrl = `/pages/result/loading?jobId=${
        this.jobId
      }&userId=${this.userId}&username=${encodeURIComponent(
        this.username
      )}&gender=${this.gender}&birthday=${encodeURIComponent(
        JSON.stringify(this.birthday)
      )}&options=${encodeURIComponent(
        JSON.stringify(this.selectedOptions)
      )}&num=${this.num}`;

				uni.navigateTo({
					url: loadingPageUrl,
					fail: (err) => {
						console.error("Navigation failed:", err);
						uni.showToast({
							title: "页面跳转失败",
							icon: "none",
						});
					},
				});
			},
			updateProgress() {
				this.progress = (this.currentScene / this.totalScenes) * 100;
			},
		},
	};
</script>

<style scoped>
	@import url("/pages/test/common.css");


	/* ... 其他样式保持不变 ... */
</style>