<template>
  <view class="container">
    <scroll-view scroll-y style="height: 100%">
      <!-- <view class="debug-info">
				如需调试信息，可取消注释以下行
				<text>homepageData: {{ JSON.stringify(homepageData) }}</text>
			</view> -->
      <image
        class="head-image"
        :src="
          this.isPass
            ? '/static/battlefield/IP_Green.svg'
            : '/static/battlefield/IP_Grey.svg'
        "
        mode="aspectFit"
      ></image>
      <view class="card first-card">
        <view class="status-text">
          {{ this.isPass ? "你真棒！" : "很遗憾..." }}
        </view>
        <reward-bar
          :style="{ backgroundColor: 'transparent', width: '300rpx' }"
          :gemCount="this.gemCount"
          gem-icon-width="40px"
          gem-icon-height="40px"
        ></reward-bar>
        <view class="diamond-wrapper">
          <image
            class="diamond-image"
            src="/static/battlefield/diamond.png"
            mode="aspectFill"
          ></image>
          <text class="diamond-text">
            {{ this.isPass ? "+10！" : "+3" }}
          </text>
        </view>
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
            <npc-comment
              :name="'领导'"
              :avatar="'/static/battlefield/boss.png'"
              :comment="comments[0]"
            ></npc-comment>
            <npc-comment
              :name="'同事A'"
              :avatar="'/static/battlefield/xiaoA.png'"
              :comment="comments[1]"
            ></npc-comment>
            <npc-comment
              :name="'同事B'"
              :avatar="'/static/battlefield/xiaoB.png'"
              :comment="comments[2]"
            ></npc-comment>
          </view>
        </view>
      </view>

      <view class="card third-card">
        <view class="third-card-title">
          <view class="down-line second-line"></view>
          <text class="comment-title">本关情商技巧</text>
        </view>
        <view class="suggestion">
          <text>{{ suggestion }}</text>
        </view>
      </view>
      <button class="guide-button" @click="navigateToGuide">
        开启高情商之旅
      </button>
    </scroll-view>
  </view>
</template>

<script>
import RewardBar from "/components/RewardBar.vue";
import NpcComment from "/components/NpcComment.vue"; // 引入组件
import api from "../../services/api-service";
export default {
  components: {
    NpcComment, // 注册组件
    RewardBar,
  },
  data() {
    return {
      comments: [
        "哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看",
        "好好哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看好我看看",
        "嘿嘿哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看哈哈哈你看看嘿",
      ],
      suggestion: "注意倾听每个人的需求，及时回应对方的感受。",
      diamondAdd: 3,
      gemCount: 0,
      npcHealthValues: [],
    };
  },
  methods: {
    progressWidth(value) {
      // 计算进度条宽度百分比
      const percentage = (value / 100) * 100;
      // console.log('${percentage}%：', `${percentage}%`)
      return `${percentage}%`;
    },
    navigateToGuide() {
      console.log("Navigating to guide with data:", {
        userId: this.userId,
        username: this.username,
        // jobId: this.homepageData.response.personal_info.job_id
      });
      uni.navigateTo({
        url: `/pages/dashboard/dashboard_en?userId=${this.userId}`,

        // url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData.response.personal_info.job_id}`
      });
    },

    navigateToNextPage() {
      uni.navigateTo({
        url: "/pages/battlefield/battlefield-task", // Replace this with the actual path to your next page
      });
    },
  },

  onLoad() {
    // this.homepageData = api.getHomepageData()
    uni.getStorage({
      key: "isPass",
      success: (res) => {
        // 根据存储的值更新 isPass
        console.log("res: ", res);
        this.isPass = res.data || false; // 如果 res.data 为 undefined，则默认为 false
      },
      fail: () => {
        console.warn("获取 isPass 值失败");
        this.isPass = false; // 失败时可以设置默认值
        // console.log("this.isPass: ", this.isPass);
      },
    });
    const evalResult = uni.getStorage({
      key: "evalResult",
      success: (res) => {
        console.log("result:", res);
        const dbCourse = res.data.db_course;
        const list = Object.keys(dbCourse)
          .filter((key) => key.startsWith("comment")) // 筛选以 'comment' 开头的键
          .sort() // 如果你想按照 comment1, comment2 的顺序排列
          .map((key) => dbCourse[key]); // 提取这些键的值						;
        this.comments = list;
        // this.suggestion = res.data.eq_tips.join('\n');
      },
    });
    // 读取 NPC health data
    // uni.getStorage({
    // 	key: 'npcHealthData',
    // 	success: (res) => {
    // 		const npcHealthData = res.data;
    // 		this.npcHealthValues = npcHealthData; // 假设你在data中定义了npcHealthValues
    // 	}
    // });
    uni.getStorage({
      key: "gemCount",
      success: (res) => {
        console.log("res.data: ", res.data);
        this.gemCount = parseInt(res.data);
        // let diamondAdd = 3; // 默认值为 3
        // if (gemCount > 0) {
        // 	diamondAdd = 10; // 如果 gemCount > 0, 设置 diamondAdd 为 10
        // }
        // this.diamondAdd = diamondAdd;
        // console.log('获取到的 Gem Count:', gemCount, 'Diamond Add 值为:', diamondAdd);
      },
      fail: (err) => {
        console.error("获取 Gem Count 失败:", err);
        this.gemCount = 0;
        // this.diamondAdd = 3;
      },
    });
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9)),
    url("/static/battlefield/background.png");
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.head-image {
  position: absolute;
  left: 23%;
  top: -5%;
  width: 50%;
  z-index: 4;
}

.status-text {
  color: #fff;
  text-align: center;
  font-size: 56rpx;
  line-height: 64rpx;
  height: 64rpx;
  margin-top: 80rpx;
  font-weight: 700;
}

.diamond-wrapper {
  margin-top: 10rpx;
}

.diamond-image {
  width: 60rpx;
  height: 60rpx;
}

.diamond-text {
  font-size: 48rpx;
  font-weight: 800;
  line-height: 56rpx;
  position: relative;
  top: -12%;
  left: 5%;
  color: #f2bc74;
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
  background-color: #f2bc74;
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
  color: #f2bc74;
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
  margin-bottom: 13vh;
}

.guide-button {
  width: 80%;
  height: 100rpx;
  background-color: #9ee44d;
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
