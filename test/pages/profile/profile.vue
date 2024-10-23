<template>
  <view class="container">
    <scroll-view
      scroll-y
      style="height: 100%;"
    >
      <view class="content">
		  
		
		
		<image class="iconback" src="/static/back.png" mode="widthFix" @click="goToDashboard"></image>
		<image class="iconrenew" src="/static/renew.png" mode="widthFix" ></image>
		
		<!-- <view class="debug-info"> -->
		  <!-- 显示从上一个页面接收到的数据  这个是修改信息的功能，能不能点开的时候，弹出来的窗口和外面的是一致的-->
		  <!-- <text>this.contactDetails：{{ this.contactDetails }}</text> -->
		<!-- <text>personalName: {{ personalName }}</text> -->
		  <!-- <text>profileName: {{ name }}</text> -->
		  <!-- <text>name: {{ name }}</text> -->
		  <!-- <text>relation: {{ relation }}</text> -->
		  <!-- <text>tags: {{ JSON.stringify(tags) }}</text> -->
		  <!-- <text>contactId: {{ contactId }}</text> -->
		<!-- </view> -->

        <!-- 添加白色卡片1 -->
        <view class="card-a">
          <image class="illustrationhead" src="/static/head.png" mode="widthFix"></image>
          <view class="card1inner">
            <view class="card2inner">
              <text class="usercard-title1">{{ name }}</text>
              <image class="editillustration" src="/static/edit.png" mode="widthFix" @click="openPopup"></image>
            </view>
            
            <view class="popup-tags-outside">
              <text
                v-for="tag in tags"
                :key="tag"
                class="popup-tag-outside"
              >{{ tag }}</text>
            </view>
          </view>
        </view>
        

        <text class="card-title1">关系解码器</text>
		<text class="card-title15">一起分析聊天记录</text>
		
<!-- 		<view class="card-container">
		  <view class="card-b">
			<text class="card-titleaa">基础</text>
			<text class="card-titleab">亲密指数</text>
			<image class="illustrationlock" src="/static/lock.png" mode="widthFix"></image>
		  </view>
		  <view class="card-b">
			<text class="card-titleaa">基础</text>
			<text class="card-titleab">亲密指数</text>
			<image class="illustrationlock" src="/static/lock.png" mode="widthFix"></image>
		  </view>
		  <view class="card-b">
			<text class="card-titleaa">基础</text>
			<text class="card-titleab">亲密指数</text>
			<image class="illustrationlock" src="/static/lock.png" mode="widthFix"></image>
		  </view>
		</view> -->
		
		<view class="small-card-container">
		  <scroll-view
		    scroll-x
		    style="width: 100%;"
		  >
		    <!-- New wrapper to arrange cards horizontally -->
		    <view class="card-wrapper">
		      <view class="card-b" @click="unlockCard('intimacy')">
		        <text class="card-titleaa">基础</text>
		        <text class="card-titleab">亲密指数</text>
		        <image v-if="!cards.intimacy.unlocked" class="illustrationlock" src="/static/lock.png" mode="widthFix"></image>
		        <view v-else class="unlocked-content">
		          <text class="card-score">{{ cards.intimacy.score }}</text>
		          <text class="card-description">{{ this.contactDetails.message }}</text>
		        </view>
		      </view>
		      <view class="card-b1" @click="unlockCard('opinion')">
		        <text class="card-titleaa">基础</text>
		        <text class="card-titleab">TA对你的看法</text>
		        <image v-if="!cards.opinion.unlocked" class="illustrationlock" src="/static/lock.png" mode="widthFix"></image>
		        <view v-else class="unlocked-content">
		          <text class="card-description">{{ this.contactDetails.message }}</text>
		        </view>
		      </view>
		      <view class="card-b2">
		        <text class="card-titleaa">基础</text>
		        <text class="card-titleab">PUA鉴别</text>
		        <image class="illustrationlock" src="/static/lock.png" mode="widthFix"></image>
		      </view>
		    </view>
		  </scroll-view>
		</view>

		
		<text class="card-title1">妙计囊</text>
		<text class="card-title15">根据关系巧妙建议，祝你应对职场难题</text>
		<image class="illustration32" src="/static/dashboard/trick-fake.png" mode="widthFix"></image>
		<view class="upload-button" @click="chooseImage">
		  <image class="uploadillustration" src="/static/Placeholder.png" mode="widthFix"></image>
		  <text class="upload-title">上传</text>
		</view>
		<text class="card-title16">更多聊天截图有助于获取更准确的分析</text>
		
        

        <view v-if="showPopup" class="popup-overlay">
          <view class="popup-content" @click.stop>
            <view class="popup-header">
              <text class="popup-title">编辑人脉档案</text>
              <text class="popup-question">先给TA起个昵称吧！</text> 
              <text class="popup-close" @click="closePopup">×</text>
            </view>
            <input class="popup-input" v-model="editName" placeholder="请输入名字" />
            <view class="popup-section">
              <text class="popup-question">TA是你的？</text> 
            </view>
            <view class="popup-options">
              <text class="popup-option" :class="{ active: editRelation === '同事' }" @click="selectOption('同事')">同事</text>
              <text class="popup-option1" :class="{ active: editRelation === '老板' }" @click="selectOption('老板')">老板</text>
              <text class="popup-option2" :class="{ active: editRelation === '下属' }" @click="selectOption('下属')">下属</text>
            </view>
            
            <view class="popup-section">
              <text class="popup-question">哪些标签可以用来形容TA？</text>
            </view>
            <view class="popup-tags">
              <text
                v-for="tag in currentTags"
                :key="tag"
                class="popup-tag"
                :class="{ active: editTags.includes(tag) }"
                @click="toggleTag(tag)"
              >{{ tag }}</text>
            </view>
            
            <button 
              class="popup-button" 
              @click="confirmEdit" 
              :style="{ opacity: canConfirmEdit ? 1 : 0.5 }"
            >
              确认更改
            </button>
          </view>
        </view>
		

		<!-- 添加色卡片2 -->


     
	  </view>
    </scroll-view>
  </view>
</template>

<script>
import apiService from '../../services/api-service';

export default {
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
          url: `/pages/profile/profile_en?name=${encodeURIComponent(this.profileName)}&jobId=${this.jobId}&relation=${encodeURIComponent(this.selectedOption)}&tags=${encodeURIComponent(JSON.stringify(this.selectedTags))}`
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
  position: relative;
  background-color: #2F2F38;
  /* display: flex; */
  flex-direction: column;
  align-items: left;
  padding-top: 100rpx;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* 启用 iOS 惯性滚动 */
}

.content {
  display: flex; 
  flex-direction: column;
  align-items: left;
  width: 340px;
  margin-left: 20px;
}

.iconback {
  width: 60rpx;
  height: auto;
  position: relative;
  top:0rpx;
  left: 0rpx;
}
.iconrenew {
  width: 60rpx;
  height: auto;
  position: absolute;
  top:0rpx;
  right: 0rpx;
}

.illustrationhead {
  width: 200rpx;
  height: auto;
  position: relative;
  z-index: 10;
  left: 0px;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
.illustrationlock {
  width: 90rpx;
  height: auto;
  position: relative;
  z-index: 10;
  left: 30px;
  top: 10px;
  margin-top: 30rpx;
}

.illustration2 {
  width: 130rpx;
  height: auto;
  position: absolute;
  top:1030rpx;
  left: 290rpx;
}

.illustration3 {
  width: 100rpx;
  height: auto;
  position: relative;
  top:0rpx;
  left: 0rpx;
}
.illustration31 {
  width: 250rpx;
  height: auto;
  position: absolute;
  top:340rpx;
  left: 60rpx;
  margin-top: 3px;
}

.illustration32 {
  width: 690rpx;
  height: auto;
  position: relative;
  top:0rpx;
  left: 0rpx;
  margin-bottom: 10px;
}
.illustration33 {
  width: 130rpx;
  height: auto;
  position: absolute;
  top:0rpx;
  left: 500rpx;
  margin-bottom: 10px;
}
.illustration34 {
  width: 60rpx;
  height: auto;
  position: absolute;
  top:15rpx;
  left: 620rpx;
  margin-bottom: 10px;
}
.editillustration {
  width: 40rpx;
  height: auto;
  position: relative;
  left: 140rpx;
  margin-top:10px ;
}
.uploadillustration {
  width: 50rpx;
  height: auto;
  position: relative;
  z-index: 10;
  left: 120px;
}
.illustration36 {
  width: 60rpx;
  height: auto;
  position: absolute;
  top:30rpx;
  left: 100rpx;
}
.illustration37 {
  width: 60rpx;
  height: auto;
  position: absolute;
  top:30rpx;
  left: 340rpx;
}
.illustration38 {
  width: 60rpx;
  height: auto;
  position: absolute;
  top:30rpx;
  left: 570rpx;
}
.illustration39 {
  width: 300px;
  height: auto;
  position: absolute;
  top:30rpx;
  left: 10 px;
}

.illustration4 {
  width: 70rpx;
  height: auto;
  position: absolute;
  margin-top:-20rpx;
  left: 390rpx;
}

.illustration5 {
  width: 150rpx;
  height: auto;
  position: absolute;
  margin-top:-20rpx;
  left: 520rpx;
}

.illustration6 {
  width: 400rpx;
  height: auto;
  position: absolute;
  bottom: -20rpx;
  left: 250rpx;
}

.innercard{
  width: 280px;
  height:225px;
  background-color: #373742;
  border-radius: 20rpx;
  position:relative;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 30rpx 30rpx 0rpx 30rpx;
  margin-bottom: 10rpx;
}

.small-card-container {
  width: 100%; /* 占据父容器的全部宽度 */
  margin-bottom: 30rpx;
}

.card-wrapper {
  display: flex;
  flex-direction: row;
}

.card-a {
  width: 320px;
  background-color: #373742;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 20;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: left;
  padding: 20rpx 50rpx 20rpx 50rpx;
  margin-bottom: 30rpx;
}

.card-b {
	  flex: 0 0 auto; /* 防止卡片被压缩 */
	  width: 140px;
  width: 100px;
  height: 140px;
  background-color: #EDED68;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 20;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-right: 10px;
  padding: 30rpx;
}
.card-b1 {
	  flex: 0 0 auto; /* 防止卡片被压缩 */
  width: 100px;
  height: 140px;
  background-color: #89E3C9;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 20;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-right: 10px;
  padding: 30rpx;
}
.card-b2 {
	  flex: 0 0 auto; /* 防止卡片被压缩 */
	  width: 140px;
  width: 100px;
  height: 140px;
  background-color: #F0EBE5;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 20;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-right: 10px;
  padding: 30rpx;
}

.card1inner {
  flex-direction: column;
  margin-left: 20rpx;
}
.card2inner {
  flex-direction: row;
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
  z-index: 1000; /* 确保按钮悬浮其他内容之上 */
  position: fixed; /* 固定定位 */
  bottom:0px;
  transform: translateX(-50%); /* 调整水平位置以居中 */
  left: 50%; /* 水平居中 */
}

.peoplecontain {
  width: 360px;
  background-color: #2F2F38;
  /* border-radius: 20rpx; */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 20;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 30rpx 0rpx 30rpx;
  margin-bottom: 200rpx;
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

.score-container, .score-container1 {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 80rpx;
}

.score-details {
  display: flex;
  align-items: baseline;
  margin-bottom:20rpx;
  margin-top:20rpx;
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
  background-color: rgba(125, 123, 126, 0.5); /* 设置透明度为50% */
  border-radius: 25rpx;
  overflow: hidden;
  margin-top: 5rpx;
  margin-bottom: 15rpx;
}

.status-text {
	top:190px;
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
  margin-top: 50px ;
  top:-50px;
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

.text-box, .text-box1 {
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
  border-radius: 20rpx 20rpx 20rpx 0rpx; /* 左上角方角，其他三个角为圆角 */
}


.card-title2 {
  font-size: 28rpx;
  /* color: #252529; */
  background-color: #9EE44D;
  margin-bottom: 10rpx;
  margin-top: 20rpx;
  padding: 10px;
  border-radius: 20rpx 20rpx 20rpx 0rpx; /* 左上角方角，其他三个角为圆角 */
}

.card-title1 {
  font-size: 45rpx;
  color: #FFFFFF;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.card-titleaa {
  font-size: 25rpx;
  color: #000000;
  background-color: #FFFFFF;
  opacity: 0.6;
  margin-bottom: 10rpx;
  width: 37px;
  align-items: center;
  padding: 5px;
}
.card-titleab {
  font-size: 26rpx;
  color: #000000;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.usercard-title1 {
  font-size: 36rpx;
  color: #FFFFFF;
  font-weight: bold;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  
}

.upload-title {
  font-size: 45rpx;
  color: #000000;
  font-weight: bold;
  font-size: 36rpx;
  position: absolute;
  left: 170px;
  
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
left:30px;
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
  margin-top: 10rpx;
}
.card-title16 {
  font-size: 25rpx;
  color: #bbbbbb;
  margin-bottom: 10rpx;
  margin-top: 10rpx;
  left: 70px;
}

.logo {
  width: 300rpx; 
  height: 300rpx;
  position: absolute;
  top: 11%;
  left: 50%;
  transform: translate(-50%, -50%); /* 同时水平和垂直居 */
}

.card-description {
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
  z-index: 1000; /* 确保按钮悬浮在其他容之上 */
  position: fixed; /* 固定定位 */
  bottom:0px;
  transform: translateX(-50%); /* 调整水平位置以居中 */
  left: 50%; /* 水平居中 */
}



.debug-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.5);
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
  top:95px;
  z-index: 30;
  border: 3rpx solid #FFFFFF; /* 添加白色边框 */

}

.green-circle1 {
  position: absolute;
  width: 22rpx;
  height: 22rpx;
  background-color: #b3bec1;
  border-radius: 50px;
  top:102px;
  /* z-index: 3; */
}

.expand-button {
  color: #9EE44D; /* 按钮文字颜色 */
  border: none; /* 去掉边框 */
  padding: 0; /* 去掉内边距 */
  text-align: center; /* 文字居中 */
  text-decoration: underline; /* 添加下划线以突出显示 */
  display: inline; /* 使按钮为行内元素 */
  font-size: 16px; /* 字体大小 */
  margin: 0; /* 掉外边距 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  background-color: #373742;
}

.expand-button:hover {
  color: #9EE44D; /* 悬停时的文字颜色 */
  text-decoration: underline; /* 悬停时保持下划线 */
}

.expand-image {
  width: 150rpx; /* Adjust the width to your desired size */
  height: 55rpx; /* Adjust the height to your desired size */
  cursor: pointer; /* Make it clickable */
  margin: 0 auto; /* Center it */
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
  z-index: 1000;
}

.popup-content {
  width: 90%;
  background-color: #3C3C47;
  border-radius: 50rpx;
  padding: 50rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: left;
  margin-bottom: 20rpx;
}

.popup-title {
  color: #FFFFFF;
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 20px;
}

.popup-close {
  color: #FFFFFF;
  font-size: 40rpx;
  position: absolute;
  right: 5px;
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
  flex-direction: row; /* 改为横向排列 */
  flex-wrap: wrap;     /* 允许换行 */
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

.popup-option.active,.popup-option1.active,.popup-option2.active {
  background-color: #9EE44D;
  color: #2F2F38;
}

.popup-tags {
  display: flex;
  flex-direction: row; /* 改为横向排列 */
  flex-wrap: wrap;     /* 允许换行 */
  align-items: flex-start;
  width: 100%; /* 按钮组占满整个宽度 */
  margin-bottom: 10px; /* 调整间距 */
}

.popup-tags-outside {
  display: flex;
  flex-direction: row; /* 改为横向排列 */
  flex-wrap: wrap;     /* 允许换行 */
  align-items: flex-start;
  margin-bottom: 10px; /* 调整间距 */
}

.popup-tag-outside {
  display: inline-block;
  background-color: #9EE44D;
  color: #000000;
  padding: 15rpx 30rpx;
  border-radius: 30rpx;
  margin: 5px; /* 调整间距 */
  white-space: nowrap;
  cursor: pointer; /* 增加击效果 */
  font-size: 14px;
}

.popup-tag {
  display: inline-block;
  background-color: #2F2F38;
  color: #FFFFFF;
  padding: 20rpx 40rpx;
  border-radius: 30rpx;
  margin: 5px; /* 调整间距 */
  white-space: nowrap;
  cursor: pointer; /* 增加点击效果 */
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

.upload-button {
  width: 100%;
  background: linear-gradient(-30deg, #EDFB8B -20%, #9EE44D 120%);
  border-radius: 50rpx;
  position: relative;
  z-index: 20;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20rpx;
  margin-bottom: 30rpx;

}


.back-button {
  background: #2F2F38;
  color: #ffffff;
  width: 40px;
  padding: 5rpx;
  text-align: left;
  margin-top: 10px;
  font-size: 30px;
}

.unlocked-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0rpx;
  position: absolute;
  top: 45px;
}

.card-score {
  font-size: 36rpx;
  font-weight: bold;
  position:absolute;
  top: 0px;
  left: 70%;
  color: #000000;
  margin-bottom: 10rpx;
}

.card-description {
  font-size: 24rpx;
  color: #000000;
  text-align: left;
  top: -20px;
}

.debug-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
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

</style>