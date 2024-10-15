<template>
    <view class="container">
        <image class="background-image" src="/static/bg1.png" mode="aspectFill" />
		
		<view class="progress-container">
			<view class="progress-bar">
				<view class="progress" :style="{ width: `${progress}%` }"></view>
			</view>
			<text class="progress-text">{{ currentScene }}/{{ totalScenes }}</text>
		</view>

        <!-- Test3 content -->
        <template v-if="currentPage === 'test3'">
            <view class="banner-container">
                <image class="logo" src="/static/signa.png" mode="aspectFit" />
                <text class="room-text">{{ scenarioData.location }}</text>
            </view>
            <view class="text-box">
                <text class="text-content">{{ background }}</text>
                <view class="expand-icon" @tap="navigateToTest4">
                    <image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
                </view>
            </view>
        </template>

        <!-- Test4 content -->
        <template v-if="currentPage === 'test4'">
            <onboarding-chat-bubble 
                :userName="scenarioData.role" 
                :avatar="'/static/npc1.png'" 
                :dismiss="navigateToTest5"
                :description="description">
            </onboarding-chat-bubble>
        </template>

        <!-- Test5 content -->
        <template v-if="currentPage === 'test5'">
            <view class="options-container">
                <view v-for="(option, index) in scenarioData && scenarioData.options ? scenarioData.options : []"
                    :key="index" 
                    :class="['text-box1', { 'selected': selectedOptionIndex === index }]"
                    @click="selectOption(index)">
                    <text class="text-content1" :style="{ color: option.textColor || 'white' }">{{ option.text }}</text>
                </view>
            </view>
            <view class="button-container">
                <view class="continue-button" @click="nextPage">
                    <text class="arrow">→</text>
                </view>
            </view>
        </template>

    </view>
</template>

<script>
import OnboardingChatBubble from '/components/OnboardingChatBubble.vue';
import apiService from '/services/api-service.js';

export default {
    components: {
        OnboardingChatBubble,
    },
    data() {
        return {
            currentPage: 'test3',
            userInfoStyle: {
                bottom: '180px',
                left: '50%',
                marginLeft: '-65px' // 替换 transform
            },
            userId: '',
            username: '',
            gender: '',
            selectedOptions: [],
            birthday: null,
            scenarioData: null,
            background: '',
            description: '',
            jobId: '',
            selectedOptionIndex: null,
            num: null,
            baseURL: apiService.API_ENDPOINT // Use the API_ENDPOINT from the service
        }
    },
    onLoad(option) {
        console.log('Received options:', option);

        // 接收上一个页面传递的数据
        this.userId = option.userId || '';
        this.username = decodeURIComponent(option.username || '');
        this.gender = option.gender || '';
        this.jobId = option.jobId || '';

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

        // 接收来自其他页面的新信息
        if (option.roundCount) {
            this.roundCount = parseInt(option.roundCount, 10);
        }
        if (option.num) {
            this.num = parseInt(option.num, 10);
        }

        console.log('Parsed data:', {
            userId: this.userId,
            username: this.username,
            gender: this.gender,
            selectedOptions: this.selectedOptions,
            birthday: this.birthday,
            roundCount: this.roundCount,
            num: this.num,
            jobId: this.jobId
        });

        // 获取场景数据
        this.getScenarioData();
    },
    methods: {
        navigateToTest4() {
            this.getScenarioData().then(() => {
                this.currentPage = 'test4';
            });
        },
        navigateToTest5() {
            this.getScenarioData().then(() => {
                this.currentPage = 'test5';
            });
        },
        selectOption(index) {
            this.selectedOptionIndex = index;
            this.num = index + 1;
            console.log('Selected option:', this.num, this.scenarioData.options[index].text);

            this.scenarioData.options.forEach((option, i) => {
                option.textColor = (i === index) ? 'black' : 'white';
            });
        },
        nextPage() {
            if (this.num === null) {
                uni.showToast({
                    title: '请选择一个选项',
                    icon: 'none'
                });
                return;
            }

            console.log('Sending data to backend:', {
                choice: this.num,
                job_id: this.jobId
            });

            apiService.chooseScenario(this.num, this.jobId)
                .then(result => {
                    console.log('Response data:', result);

                    if (result.message === "Final choice made. Processing data in background.") {
                        this.navigateToLoading();
                    } else {
                        // 获取新的场景数据并进入下一步
                        setTimeout(() => {
                            this.getScenarioData().then(() => {
                                this.currentPage = 'test3';
                            });
                        }, 1000); // 延迟 1 秒
                    }
                })
                .catch(error => {
                    console.error('Detailed error:', error);
                    uni.showToast({
                        title: `发生错误：${error.message}`,
                        icon: 'none'
                    });
                });
        },
        navigateToLoading() {
            const loadingPageUrl = `/pages/result/loading?jobId=${this.jobId}&userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(this.birthday))}&options=${encodeURIComponent(JSON.stringify(this.selectedOptions))}&num=${this.num}`;

            uni.navigateTo({
                url: loadingPageUrl,
                fail: (err) => {
                    console.error('Navigation failed:', err);
                    uni.showToast({
                        title: '页面跳转失败',
                        icon: 'none'
                    });
                }
            });
        },
        getScenarioData() {
            this.loading = true;
            return apiService.getCurrentScenario(this.jobId)
                .then(data => {
                    console.log('Scenario data:', data);
                    this.scenarioData = data.scenes || data;
                    this.handleScenarioData();
                })
                .catch(err => {
                    console.error('Error getting scenario data:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleScenarioData() {
            if (this.scenarioData) {
                this.description = this.scenarioData.description || '无法获取背景信息';
                this.background = this.scenarioData.background || '请点击下方箭头继续';
                
                // 添加这个块来处理 test5 的选项
                if (this.scenarioData.options) {
                    this.scenarioData.options = this.scenarioData.options.map(option => ({
                        ...option,
                        textColor: 'white' // 重置所有选项的文字颜色
                    }));
                } else {
                    this.scenarioData.options = [];
                }

                // 重置选中的选项
                this.selectedOptionIndex = null;
                this.num = null;
            } else {
                console.warn('场景数据中未找到背景信息');
                this.description = '无法获取背景信息';
                this.background = '请点击下方箭头继续';
                this.scenarioData = { options: [] };
            }
        }
    }
}
</script>

<style scoped>
    @import url("common.css");

    .text-box {
        position: absolute;
        bottom: 80rpx;
        left: 40rpx;
        right: 40rpx;
        background-color: rgba(55, 55, 66, 0.8);
        border-radius: 50rpx;
        padding-top: 50rpx;
        padding-bottom: 50rpx;
        padding-left: 50rpx;
        padding-right: 50rpx;
        z-index: 1;
        min-height: 100rpx;
        max-height: 400rpx;
        overflow: auto;
        border: 6rpx solid #F2BC74;
        /* 示例边框颜色 */
    }

    .text-content {
        color: white;
        font-size: 28rpx;
        line-height: 1.4;
    }

    .expand-icon {
        text-align: center;
        color: white;
        font-size: 24rpx;
        margin-top: 10rpx;

    }

    .icon-image {
        width: 20px;
        /* 使图片适应容器宽度 */
        height: 20px;
        /* 使图片适应容器高度 */
    }

    .debug-info {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 10rpx;
        font-size: 20rpx;
        z-index: 100;
        max-height: 50vh;
        overflow-y: auto;
    }

    .debug-info text {
        display: block;
        margin-bottom: 4rpx;
    }

    .options-container {
        position: absolute;
        top: 50vh;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20rpx;
    }

    .text-box.selected {
        background-color: #F6ECC9;
    }

    .text-box.selected .text-content {
        color: #373742 !important;
    }
    
    .text-box1 {
        width: 80%;
        background-color: rgba(55, 55, 66, 0.8);
        border-radius: 50px;
        padding: 15px 25px;
        min-height: 80rpx;
        max-height: 160rpx;
        transition: background-color 0.3s;
        display: flex;
        align-items: center;
    }
    
    .text-content1 {
        color: white;
        font-size: 14px;
        line-height: 1.4;
    }
    
    .text-box1.selected .text-content {
        color: #373742 !important;
    }
    
    .text-box1.selected {
        background-color: #F6ECC9;
    }

    /* 添加您需要的其他样式 */
</style>
