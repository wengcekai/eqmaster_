<template>
  <view class="tear-container">
    <view class="tear-calendar1" @tap="tearPage">
      <image class="tear-background-image1" :src="leftImageSrc" mode="widthFit" />
      <view class="left-text-container">
        <text class="tear-calendar-text1 left-text-month">{{ currentMonth }}</text>
        <text class="tear-calendar-text1 left-text-day">{{ currentDay }}</text>
      </view>
    </view>
	
    <view class="tear-calendar" @tap="tearPage">
      <image class="tear-background-image" :src="rightBackImageSrc" mode="widthFit" />
      <view class="tear-right-text-container">
        <text class="tear-calendar-text right-text">{{ rightText }}</text>
      </view>
      <view :class="['tear-page', { 'tearing': isTearing }]">
        <image class="tear-page-image" :src="rightFrontImageSrc" mode="widthFit" />
        <text class="tear-calendar-text page-text">{{ pageText }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    leftImageSrc: {
      type: String,
      default: '/static/jingjileft.png'
    },
    rightBackImageSrc: {
      type: String,
      default: '/static/jingjiright2.png'
    },
    rightFrontImageSrc: {
      type: String,
      default: '/static/jingjiright1.png'
    },
    leftText: {
      type: Object,
      default: () => ({
        month: '五月',
        day: '15'
      })
    },
    rightText: {
      type: String,
      default: 'FFI赞美法指感受(feeling)、事实(fact)和影响(influence)。首先说出内心感受，然后陈述带给你感受的客观事实，再通过举例证实影响结果。'
    },
    pageText: {
      type: String,
      default: '撕页文字'
    },
	lang: {
		type: String,
		default: 'zh'
	}
  },
  data() {
    return {
      isTearing: false,
      currentDate: new Date()
    };
  },
  computed: {
    currentMonth() {
      const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
	  const monthsEnglish = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
	  return this.lang === 'en' ? monthsEnglish[this.currentDate.getMonth()] : months[this.currentDate.getMonth()];
    },
    currentDay() {
      return this.currentDate.getDate().toString();
    }
  },
  mounted() {
    this.updateDate();
    setInterval(this.updateDate, 60000); // Update every minute
  },
  methods: {
    tearPage() {
      this.isTearing = true;
      // setTimeout(() => {
      //   this.isTearing = false;
      // }, 2000);
    },
    updateDate() {
      this.currentDate = new Date();
    }
  }
};
</script>

<style>
.tear-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 240rpx;
  margin-top: 18rpx;
}

.tear-calendar {
  position: relative;
  width: 80%;
  height: 100%;
  overflow: hidden;
}

.tear-calendar1 {
  position: relative;
  width: 25%;
  height: 100%;
  overflow: hidden;
}

.tear-background-image {
  width: 95%;
  height: 100%;
  object-fit: contain;
}

.tear-background-image1 {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.tear-page-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 95%;
  height: 100%;
  object-fit: contain;
}

.tear-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  transition: transform 2s, opacity 2s;
  transform-origin: left center;
}

.tear-page.tearing {
  transform: translateX(100%) rotate(-10deg);
  opacity: 0;
}

.tear-calendar-text {
  position: absolute;
  color: #fcfcfc;
  font-size: 12px;
  width: 80%;
}

.tear-calendar-text1 {
  /* position: absolute; */
  color: #fcfcfc;
  font-size: 12px;
  width: 100%;
  left: 10rpx;
}

.tear-left-text {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tear-right-text {
  width: 90%;
  text-align: center;
  word-wrap: break-word;
}

.tear-page-text {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tear-right-text-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 3;
}

.tear-calendar-text1 {
  color: #fcfcfc;
  width: 100%;
}

.left-text-month {
  font-size: 14px;
}

.left-text-day {
  font-size: 24px;
  font-weight: bold;
}
</style>
