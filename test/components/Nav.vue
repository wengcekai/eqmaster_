<template>
    <div class="nav-contation">
        <view class="nav-contation-inner">
            <view class="nav-item" @click="navigateToProfilePage('Home')">
                <image class="nav-image"
                    :src="selectedView === 'Home' ? '/static/nav/home1.png' : '/static/nav/home.png'" mode="widthFix">
                </image>
                <text class="nav-text" :class="{ 'highlight': selectedView === 'Home' }">Home</text>
            </view>
            <view class="nav-item" @click="navigateToProfilePage('Battlefield')">
                <image class="nav-image" :class="{ 'highlight': selectedView === 'Battlefield' }"
                    :src="selectedView === 'Battlefield' ? '/static/nav/battlefield1.png' : '/static/nav/battlefield.png'"
                    mode="widthFix"></image>
                <text class="nav-text" :class="{ 'highlight': selectedView === 'Battlefield' }">Battlefield</text>
            </view>
            <view class="nav-item" @click="navigateToProfilePage('Profile')">
                <image class="nav-image" :class="{ 'highlight': selectedView === 'Profile' }"
                    :src="selectedView === 'Profile' ? '/static/nav/profile1.png' : '/static/nav/profile.png'"
                    mode="widthFix"></image>
                <text class="nav-text" :class="{ 'highlight': selectedView === 'Profile' }">Profile</text>
            </view>
        </view>
    </div>
</template>
<script>
export default {
    props: {
        selectedView: {
            type: String,
            required: true,
            default: 'Home',
        },
        userId: {
            type: Number,
            default: 0,
        },
        username: {
            type: String,
            default: '',
        },
        jobId: {
            type: String,
            default: '',
        },
    },
    methods: {
        navigateToProfilePage(val) {
            const currentPages = getCurrentPages();
            const currentRoute = currentPages[currentPages.length - 1].route;
            if(val === 'Home') {
                if (currentRoute !== 'pages/dashboard/dashboard_en') {
                    uni.navigateTo({
                        url: `/pages/dashboard/dashboard_en?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.jobId}&currentView=dashboard` // 添加查询参数
                    });
                } else {
                    this.$emit('switchHomeView', "dashboard");
                }
            }
            if(val === 'Battlefield') {
                if (currentRoute !== 'pages/dashboard/dashboard_en') {
                    uni.navigateTo({
                        url: `/pages/dashboard/dashboard_en?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.jobId}&currentView=dashboard2` // 添加查询参数
                    });
                } else {
                    this.$emit('switchHomeView', "dashboard2");
                }
            }
            if(val === 'Profile') {
                uni.navigateTo({
                    url: `/pages/profile/profile_en?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.jobId}` // 添加查询参数
                });
            }
        }
    }
}
</script>
<style scoped>
.nav-contation {
    display: flex;
    z-index: 9999;
    height: 150rpx;
    width: 100%;
    position: fixed;
    bottom: 0px;
    transform: translateX(-50%);
    left: 50%;
    background: #252529;
    border-top: 1px solid #373742;

}

.nav-contation-inner {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    /* height: 150rpx;
    background-color: #252529;
    color: #252529;
    font-size: 36rpx;
    text-align: center;
    line-height: 100rpx; */
}

.nav-image {
    width: 44rpx;
    height: 44rpx;
}

.nav-item {
    display: block;
    width: 100rpx;
    text-align: center;
    height: 82rpx;
}

.nav-text {
    color: #67677A;
    font-size: 24rpx;
    font-weight: 400;
}

.highlight {
    color: #9EE44D;
}
</style>