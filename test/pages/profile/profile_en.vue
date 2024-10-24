<template>
  <view class="container">
    <scroll-view scroll-y>
      <view class="content">

        <view class="user-name">
          <image src="/static/user_icon.png" class="user-icon"></image>
          <text class="user-name-text">{{ username }}</text>
        </view>

        <view class="have-been-view">
          <view class="have-been-view-center">
            <view class="have-been-header">
              <image src="/static/user_icon.png" class="have-been-header-icon"></image>
              <text class="have-been-header-text">You have been here:</text>
            </view>
            <view class="day">
              <view class="day-content">
                <view class="day-text">1</view>
                <text class="day-text-days">days</text>
              </view>
            </view>
            <view class="diamonds-stars">
              <view class="diamonds">
                <image class="diamonds-icon" src="/static/baoshi.png"></image>
                <view class="diamonds-source">
                  <view class="diamonds-source-text">Diamonds</view>
                  <view class="diamonds-source-number">{{ homepageData.response.personal_info.num_diamond }}</view>
                </view>
              </view>
              <view class="stars">
                <image class="diamonds-icon" src="/static/xinxin.png"></image>
                <view class="diamonds-source">
                  <view class="diamonds-source-text">Stars</view>
                  <view class="diamonds-source-number">{{ homepageData.response.personal_info.num_star }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="eqoach-bot-wrapper" v-if="!isDelEqoashBot">
          <view class="eqoach-bot" :style="{ transform: `translateX(${swipeOffset}px)` }" @touchstart="touchStart"
            @touchmove="touchMove" @touchend="touchEnd">
            <image class="eqoach-bot-icon" src="/static/eqoach-icon.png"></image>
            <view class="eqoach-bot-center">
              <view class="eqoach-bot-title">EQoach bot</view>
              <view class="eqoach-bot-desc">Add for more support!</view>
            </view>
            <view class="eqoach-bot-add">
              <button class="eqoach-bot-add-btn" @click="showEqoachPopup = true; saveqrcodeLoding = false;">Add</button>
            </view>
          </view>
          <view class="delete-btn" :style="{ opacity: deleteOpacity }">
            <image class="delete-btn-icon" src="/static/delete.png" @click="isDelEqoashBot = true"></image>
          </view>
        </view>

      </view>
      
    </scroll-view>
    <view class="log-out" @click="logoutShow = true">
      log out / switch user
    </view>
    <Nav selectedView="Profile" :userId="userId" :username="username" :jobId="jobId" />

    <!-- 二维码弹框 -->
    <view v-if="showEqoachPopup" class="popup-overlay" @click="showCardPopup = false">
      <view class="popup-content" @click.stop>
        <view class="card-box">
          <view class="card-header">
            <view class="title">
              <image class="card-close-image" src="/static/code_close.png" mode="" @click="showEqoachPopup = false">
              </image>
            </view>
          </view>
          <view class="eqoach-center" @click.stop>
            <view class="eqoach-center-text">
              Add EQoach bot for line
            </view>
            <image class="eqoach-center-code-image" src="/static/eqoach-code.png" ref="qrCodeImage"></image>
            <view class="eqoach-center-line">
              <view class="save-code-one">
                <view class="save-code-num">1</view>
                Save QR code
              </view>
              <view class="save-code-two">
                <view class="save-code-num">2</view>
                Open Line and scan to add
              </view>
            </view>
          </view>
          <view class="card-button">
            <button :disabled="saveqrcodeLoding" @click="saveQRCode()">Save QR Code</button>
          </view>
        </view>
      </view>
    </view>

    <view v-if="logoutShow" class="popup-overlay">
      <view class="logout-popup-content" @click.stop>
        <view class="logout-header">Log out ?</view>
        <view class="logout-center" @click="logOutClick()">log out</view>
        <view class="logout-button" @click="logoutShow = false">Cancel</view>
      </view>
    </view>
  </view>
</template>

<script>
import apiService from '../../services/api-service';
import Nav from '../../components/Nav.vue';

export default {
  components: {
    Nav
  },
  data() {
    return {
      name: '',
      intervalId: null,
      swipeOffset: 0,
      deleteOpacity: 0,
      startX: 0,
      showEqoachPopup: false,
      logoutShow: false,
      saveqrcodeLoding: false,
      progressInterval: null,
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
      isDelEqoashBot: false,
    };
  },
  computed: {
  },
  onLoad(option) {
    console.log('Received options:', option);

    // 接收上一个页面传递的数据
    this.userId = option.userId || '';
    this.username = decodeURIComponent(option.username || '');
    // this.gender = option.gender || '';
    // this.jobId = option.jobId || '';
    // this.num = option.num || '';

    // 立即调用一次
    this.getHomepageData(this.userId);

    // 新增：接收个人名称
    // this.personalName = decodeURIComponent(option.personal_name || '');

    // 接收联系人相关信息
    // this.name = decodeURIComponent(option.name || '');
    // this.relation = decodeURIComponent(option.relation || '');
    // this.contactId = option.contactId || '';

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
    async getHomepageData() {
      try {
        this.isLoading = true;
        this.error = null;
        this.userId
        console.log('Fetching homepage data with userId:', this.userId);

        const data = await apiService.getHomepageData(this.userId);
        this.homepageData = data;
        console.log('Homepage data received:', this.homepageData);
      } catch (error) {
        this.error = 'Error fetching homepage data';
        console.error(this.error, error);
      } finally {
        this.isLoading = false;
      }
    },
    touchStart(event) {
      this.startX = event.touches[0].clientX;
    },
    touchMove(event) {
      const currentX = event.touches[0].clientX;
      const diff = currentX - this.startX;

      if (diff < 0 && diff > -60) {
        this.swipeOffset = diff;
        this.deleteOpacity = Math.abs(diff) / 60;
      } else if (diff > 0 && this.swipeOffset < 0) {
        this.swipeOffset = Math.min(0, this.swipeOffset + diff);
        this.deleteOpacity = Math.abs(this.swipeOffset) / 60;
      }
    },
    touchEnd() {
      if (this.swipeOffset < -40) {
        this.swipeOffset = -60;
        this.deleteOpacity = 1;
      } else {
        this.swipeOffset = 0;
        this.deleteOpacity = 0;
      }
    },
    saveQRCode() {
      this.saveqrcodeLoding = true;
      const qrCodeImage = this.$refs.qrCodeImage;
      if (!qrCodeImage) {
        console.error('QR code image not found');
        return;
      }
      const sysInfo = uni.getSystemInfoSync();
      if (sysInfo.platform === 'ios' || sysInfo.platform === 'android') {
        uni.saveImageToPhotosAlbum({
          filePath: '/static/eqoach-code.png',
          success: () => {
            uni.showToast({
              title: '图片保存成功',
              icon: 'success'
            });
          },
          fail: (err) => {
            console.log('保存图片失败：', err);
            uni.showToast({
              title: '图片保存失败',
              icon: 'none'
            });
          }
        });
      } else {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = qrCodeImage.src;

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'qrcode.png';
            link.click();

            wx.saveImageToPhotosAlbum({
              filePath: link.href,
              success: () => {
                uni.showToast({
                  title: '图片保存成功',
                  icon: 'success'
                });
              },
              fail: (err) => {
                uni.showToast({
                  title: '图片保存失败',
                  icon: 'none'
                });
              }
            });

          }, 'image/png');
        };

        img.onerror = (error) => {
          console.error('Error loading QR code image:', error);
        };
      }
      this.saveqrcodeLoding = false;
    },
    logOutClick() {
      console.log("logOutClick");
      this.logoutShow = false;
      uni.navigateTo({
        url: `/`
      });
    }
  },
  mounted() {
    // this.startProgress(); // 开始进度条
    // this.animateImage(); // 开始图片动画
    // 如果需要在弹窗打开时设置默认选项，可以在此处调用
    // this.selectedOption = '同事'; // 已在 data 中设置，不需要额外操作
  },
  beforeDestroy() {
    // 页面销毁前清除定时器
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
};
</script>
<style scoped>
.container {
  position: absolute;
  background-color: #2F2F38;
  display: flex;
  flex-direction: column;
  align-items: left;
  /* padding-top: 100rpx; */
  width: 100%;
  height: calc(100vh - 120rpx);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-image: url("/static/profile-bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /* 启用 iOS 惯性滚动 */
}

.content {
  display: flex;
  flex-direction: column;
  /* align-items: left; */
  width: 654rpx;
  /* height: 100%; */
  margin: 0 auto;
  /* margin-left: 20px; */
  padding-top: 88rpx;
  overflow: hidden;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 50rpx;
}

.user-name-text {
  font-size: 34rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.user-icon {
  width: 96rpx;
  height: 96rpx;
}

.have-been-view {
  /* display: flex; */
  /* width: auto; */
  height: 654rpx;
  background-image: url("/static/have-been-bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 76rpx;
}

.have-been-view-center {
  /* width: 100%; */
  padding: 16px 12px;
}

.have-been-header {
  position: relative;
  display: flex;
  gap: 8rpx;
}

.have-been-header-icon {
  width: 40rpx;
  height: 40rpx;
}

.have-been-header-text {
  font-family: SF Pro Text;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 40rpx;
  text-align: left;
  color: #FFFFFF;
}

.day {
  width: 100%;
  height: 444rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-content {
  position: relative;
  display: flex;
  width: 302rpx;
  height: 136rpx;
  justify-content: left;
  align-items: center;
}

.day-text {
  font-size: 192rpx;
  color: #E8FFC4;
  font-weight: 700;
}

.day-text-days {
  position: absolute;
  font-size: 30rpx;
  color: #E8FFC4;
  font-weight: 400;
  bottom: 0;
  right: 0;
}

.diamonds-stars {
  display: flex;
  /* width: 622rpx; */
  height: 128rpx;
  gap: 18rpx;
  /* justify-content: space-around; */
}

.diamonds {
  display: flex;
  align-items: center;
  justify-content: left;
  width: 312rpx;
  height: 100%;
  background-color: #FFFFFF1A;
  border-radius: 32rpx;
  gap: 16rpx;
  padding-left: 24rpx;
}

.diamonds-icon {
  width: 80rpx;
  height: 80rpx;
}

.diamonds-source {
  display: block;
}

.diamonds-source-text {
  font-size: 30rpx;
  font-weight: 400;
  color: #D7D8E0;
}

.diamonds-source-number {
  font-size: 40rpx;
  font-weight: 700;
  color: #F2BC74;
}

.stars {
  display: flex;
  align-items: center;
  justify-content: left;
  width: 312rpx;
  height: 100%;
  background-color: #FFFFFF1A;
  border-radius: 32rpx;
  gap: 16rpx;
  padding-left: 24rpx;
}

.eqoach-bot-wrapper {
  position: relative;
  overflow: hidden;
  margin-top: 32rpx;
}

.eqoach-bot {
  display: flex;
  /* height: 128rpx; */
  background-color: #373742;
  border-radius: 32rpx;
  /* justify-content: space-between; */
  align-items: center;
  margin-top: 32rpx;
  padding: 32rpx 24rpx;
}

.eqoach-bot-icon {
  width: 88rpx;
  height: 88rpx;
}

.eqoach-bot-center {
  width: 368rpx;
  display: block;
  padding-left: 8rpx;
}

.eqoach-bot-add {
  display: flex;
  width: 226rpx;
  justify-content: right;
  /* margin-left: 140rpx; */
}

.eqoach-bot-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #E8FFC4;
}

.eqoach-bot-desc {
  font-size: 24rpx;
  font-weight: 400;
  color: #FFFFFF;
}

.eqoach-bot-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 48rpx;
  border: 1px solid #9EE44D;
  border-radius: 100rpx;
  box-shadow: 0px -2px 8.1px 0px #757CE029;
  background-color: #373742;
  font-size: 26rpx;
  font-weight: 600;
  color: #9EE44D;
}

.eqoach-bot {
  transition: transform 0.3s ease;
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  /* height: 128rpx; */
  background-color: #373742;
  border-radius: 32rpx;
  /* justify-content: space-between; */
  align-items: center;
  margin-top: 32rpx;
  /* padding: 32rpx 24rpx; */
  width: 96rpx;
  height: 152rpx;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: opacity 0.3s ease;
}

.delete-btn-icon {
  width: 40rpx;
  height: 40rpx;
}

.log-out {
  width: 100%;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 180rpx;
  bottom: 100rpx;
  color: #9EE44D;
}


/* 二维码弹框 */
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
  /* height: 810rpx; */
  background-color: #373742;
  border-radius: 32rpx;
  padding: 56rpx 32rpx;
  display: flex;
  /* justify-content: center; */
  align-items: left;
  flex-direction: column;
}

.logout-popup-content {
  width: 580rpx;
  /* Set the width to 90% */
  /* height: 810rpx; */
  background-color: #373742;
  border-radius: 32rpx;
  /* padding: 56rpx 32rpx; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.logout-header {
  display: flex;
  width: 100%;
  height: 160rpx;
  align-items: center;
  justify-content: center;
  color: #D7D8E0;
  font-size: 44rpx;
  font-weight: 600;
}

.logout-center {
  display: flex;
  width: 100%;
  height: 88rpx;
  align-items: center;
  justify-content: center;
  color: #FF6262;
  font-size: 30rpx;
  font-weight: 600;
  border-top: 1px solid #454552;
}

.logout-button {
  display: flex;
  width: 100%;
  height: 88rpx;
  align-items: center;
  justify-content: center;
  color: #D7D8E0;
  font-size: 30rpx;
  font-weight: 600;
  border-top: 1px solid #454552;
}

.eqoach-center {
  margin-top: 36rpx;
  display: block;
  width: 590rpx;
  /* height: 508rpx; */
  text-align: center;
}

.eqoach-center-text {
  font-size: 44rpx;
  font-weight: 6000;
  color: #FFFFFF;
}

.eqoach-center-code-image {
  width: 360rpx;
  height: 360rpx;
  margin-top: 32rpx;
}

.eqoach-center-line {
  display: block;
  text-align: left;
  width: 430rpx;
  /* height: 96rpx; */
  margin: 48rpx auto;
  color: #FFFFFF;
  line-height: 60rpx;
}

.save-code-one,
.save-code-two {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  gap: 14rpx;
}

.save-one-two {
  border-left: 2rpx solid #FFFFFF;
  height: 28px;
}

.save-code-num {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #454552;
  width: 32rpx;
  height: 32rpx;
  border-radius: 99px;
  text-align: center;
  font-size: 26rpx;
  font-weight: 400;
}

.card-header {
  display: block;
}

.title {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48rpx;
  font-weight: 700;
  color: #8C5225;
}

.card-close-image {
  position: absolute;
  right: 0;
  width: 48rpx;
  height: 48rpx;
}

.top {
  display: block;
  height: 176rpx;
  text-align: center;
}

text {
  font-size: 34rpx;
  font-weight: 500;
  color: #252529;
}

.card-button {
  display: flex;
  width: 100%;
  margin-top: 48rpx;
}

.card-button button {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(101.13deg, #EDFB8B 13.84%, #9EE44D 84.78%);
  border-radius: 400rpx;
  font-size: 30rpx;
  color: #2F2F38;
}

.card-button button[disabled] {
  opacity: 50%;
}
</style>