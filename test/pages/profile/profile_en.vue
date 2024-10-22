<template>
  <view class="container">
    <scroll-view scroll-y>
      <view class="content">

        <view class="user-name">
          <image src="/static/user_icon.png" class="user-icon"></image>
          <text class="user-name-text">User Name</text>
        </view>

        <view class="have-been-view">
          <view class="have-been-view-center">
            <view class="have-been-header">
              <image src="/static/user_icon.png" class="have-been-header-icon"></image>
              <text class="have-been-header-text">You have been here:</text>
            </view>
            <view class="day">
              <view class="day-content">
                <view class="day-text">28</view>
                <text class="day-text-days">days</text>
              </view>
            </view>
            <view class="diamonds-stars">
              <view class="diamonds">
                <image class="diamonds-icon" src="/static/baoshi.png"></image>
                <view class="diamonds-source">
                  <view class="diamonds-source-text">Diamonds</view>
                  <view class="diamonds-source-number">120</view>
                </view>
              </view>
              <view class="stars">
                <image class="diamonds-icon" src="/static/xinxin.png"></image>
                <view class="diamonds-source">
                  <view class="diamonds-source-text">Stars</view>
                  <view class="diamonds-source-number">120</view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="eqoach-bot-wrapper">
          <view class="eqoach-bot" :style="{ transform: `translateX(${swipeOffset}px)` }" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
            <image class="eqoach-bot-icon" src="/static/eqoach-icon.png"></image>
            <view class="eqoach-bot-center">
              <view class="eqoach-bot-title">EQoach bot</view>
              <view class="eqoach-bot-desc">Add for more support!</view>
            </view>
            <view class="eqoach-bot-add">
              <button class="eqoach-bot-add-btn">Add</button>
            </view>
          </view>
          <view class="delete-btn" :style="{ opacity: deleteOpacity }">
            <image class="delete-btn-icon" src="/static/delete.png"></image>
          </view>
        </view>

        <view class="log-out">
          log out / switch user
        </view>
      </view>

    </scroll-view>
    <Nav selectedView="Profile" />
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
      jobId: '',
      relation: '',
      tags: [],
      contactId: '',
      score: 28, // 示例分数，可根据需要动态更改
      maxScore: 100, // 假设最大分数为100
      userId: '',
      username: '',
      gender: '',
      birthday: null,
      selectedOptions: [],
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
      selectedOption: '同事', // 默认选择“同事”
      // 添同类型的标签列表
      colleagueTags: ['摸鱼高手', '潜力股', '马屁精', '靠谱伙伴'],
      bossSubordinateTags: ['完美主义者', 'PUA大师', '加班狂魔', '甩锅侠', '独裁者'],
      selectedTags: [],
      isProfileComplete: false, // New data property to track profile completion
      profileName: '', // New data property for profile name
      cards: {
        intimacy: {
          unlocked: false,
          score: 0,
          description: ''
        },
        opinion: {
          unlocked: false,
          description: ''
        },
        // Add similar objects for other cards
      },
      personalName: '',
      editName: '',
      editRelation: '',
      editTags: [],
      currentView: '', // 初始化 currentView
      swipeOffset: 0,
      deleteOpacity: 0,
      startX: 0,
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
      if (this.editRelation === '同事') {
        return this.colleagueTags;
      } else if (this.editRelation === '老板' || this.editRelation === '下属') {
        return this.bossSubordinateTags;
      } else {
        return [];
      }
    },
    canConfirmEdit() {
      return this.editName.trim() !== '' && this.editTags.length > 0;
    }
  },
  onLoad(option) {
    console.log('Received options:', option);

    // 接收上一个页面传递的数据
    this.userId = option.userId || '';
    this.username = decodeURIComponent(option.username || '');
    this.gender = option.gender || '';
    this.jobId = option.jobId || '';
    this.num = option.num || '';

    // 新增：接收个人名称
    this.personalName = decodeURIComponent(option.personal_name || '');

    // 接收联系人相关信息
    this.name = decodeURIComponent(option.name || '');
    this.relation = decodeURIComponent(option.relation || '');
    this.contactId = option.contactId || '';

    // 解析标签
    if (option.tags) {
      try {
        this.tags = JSON.parse(decodeURIComponent(option.tags));
      } catch (e) {
        console.error('Error parsing tags:', e);
        this.tags = [];
      }
    }

    // 如果有其他需要的字段，可以继续添加

    console.log('Parsed data:', {
      userId: this.userId,
      username: this.username,
      gender: this.gender,
      jobId: this.jobId,
      num: this.num,
      personalName: this.personalName,
      name: this.name,
      relation: this.relation,
      tags: this.tags,
      contactId: this.contactId
    });

    // 在这里可以使用接收到的数据进行进一步的操作
    // 例如，加载联系人的详细信息
    // this.loadContactDetails();

    // 立即调用一次
    this.loadContactDetails();

    // 设置定时调用
    this.intervalId = setInterval(() => {
      this.loadContactDetails();
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
      // 计算进度条宽度百分比
      const percentage = (value / this.maxScore) * 100;
      // console.log('${percentage}%：', `${percentage}%`)
      return `${percentage}%`;
    },
    circleLeftPosition(value) {
      // 获取进度条实际宽度
      const percentage1 = (value / this.maxScore) * 100;
      const progressBarWidth = uni.getSystemInfoSync().windowWidth * 0.8; // 80%的屏幕宽度作为进度条的实际宽度
      console.log(percentage1)
      return (percentage1 / 100) * progressBarWidth;
    },
    navigateToGuide() {
      uni.navigateTo({
        url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.jobId}` // 添加查询参数
      });
    },
    async loadContactDetails() {
      try {
        if (!this.contactId) {
          console.error('Contact ID is missing or invalid');
          return;
        }

        const contactDetails = await apiService.getContactProfile(this.contactId);
        this.contactDetails = contactDetails;
        console.log('Contact details received:', this.contactDetails);
        this.$nextTick(() => {
          this.drawRadar();
        });
      } catch (error) {
        console.error('Error fetching contact details:', error);
      }
    },
    expand() {
      this.isExpanded = true; // 只展开，不再收起
    },
    openPopup() {
      this.editName = this.name;
      this.editRelation = this.relation;
      this.editTags = [...this.tags];
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    selectOption(option) {
      this.editRelation = option;
    },
    toggleTag(tag) {
      const index = this.editTags.indexOf(tag);
      if (index > -1) {
        this.editTags.splice(index, 1);
      } else {
        this.editTags.push(tag);
      }
    },
    confirmEdit() {
      if (this.canConfirmEdit) {
        this.name = this.editName;
        this.relation = this.editRelation;
        this.tags = [...this.editTags];
        this.closePopup();
        // 这里可以添加保存更改到后端的逻辑
      }
    },
    toProfilePage() {
      if (this.canConfirmEdit) {
        uni.navigateTo({
          url: `/pages/profile/profile?name=${encodeURIComponent(this.profileName)}&jobId=${this.jobId}&relation=${encodeURIComponent(this.selectedOption)}&tags=${encodeURIComponent(JSON.stringify(this.selectedTags))}`
        });
      }
    },
    toHomePage() {
      if (this.canConfirmEdit) {
        uni.navigateTo({
          url: `/pages/dashboard/dashboard`
        });
      }
    },

    // Add new method to handle navigation
    goToDashboard() {
      this.currentView = 'dashboard'; // 将 currentView 设置为 'dashboard'
      uni.navigateTo({
        url: `/pages/dashboard/dashboard?personalName=${encodeURIComponent(this.personalName)}&jobId=${this.jobId}&currentView=${this.currentView}`
      });
    },
    unlockCard(cardType) {
      if (!this.cards[cardType].unlocked) {
        this.cards[cardType].unlocked = true;
        if (cardType === 'opinion') {
          // Here you would typically make an API call to get the description
          // For demonstration, we'll use a placeholder value
          this.cards[cardType].description = "这是TA对你的看法。";
        } else {
          // Handle other card types as before
          this.cards[cardType].score = Math.floor(Math.random() * 100);
          this.cards[cardType].description = "这是解锁后的描述文字。";
        }
      }
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
        const result = await apiService.uploadImage(filePath);
        console.log('Upload result:', result);
        // 处理上传成功后的逻辑
      } catch (error) {
        console.error('Upload failed:', error);
        // 处理上传失败的情况
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

<style>
.uni-scroll-view-content {
  height: auto;
}
</style>
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
  overflow: hidden;
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
  height: 100%;
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
  margin-top: 200rpx;
  /* margin-bottom: 250rpx; */
  color: #9EE44D;
}
</style>