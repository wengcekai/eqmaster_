<template>
	<view class="container">
		<image class="background-image" src="/static/picture1.png" mode="widthFix"></image>

		<view class="text-content">
			<text class="question">🎂 你的生日是什么时候？</text>
			<!-- <text class="question1">完善个人信息</text> -->
		</view>
		
		
		<view class="date-picker-parent">
			<date-picker @dateChanged="onDateChanged"></date-picker>>
		</view>
	</view>

	<view class="button-container">
		<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @click="goToNextPage()"></image>
	</view>
</template>

<script lang="uts">
	import DatePicker from '@/components/DatePicker.vue';

	export default {
		components: {
			DatePicker
		},
		data() {
			return {
				year: '',
				month: '',
				day: '',
				title: 'picker-view',
				result: [],
				indicatorStyle: 'height: 50px;',
				userId: '',
				username: '',
				gender: '',
			};
		},
		onLoad(options : { userId : string; username : string; gender : string; }) {
			// Retrieve data from the previous page
			this.userId = options.userId;
			this.username = decodeURIComponent(options.username);
			this.gender = options.gender;
			console.log("preference initiated.");
		},
		methods: {
			goToNextPage() {
				// Prepare the selected date as a JSON string
				const selectedDate = {
					year: this.year,
					month: this.month,
					day: this.day,
				};
				// Navigate to the next page with all data passed as URL parameters
				const nextPageUrl = `/pages/preference/preference2?userId=${this.userId}&username=${encodeURIComponent(this.username)}&gender=${this.gender}&birthday=${encodeURIComponent(JSON.stringify(selectedDate))}`;
				uni.navigateTo({
					url: nextPageUrl,
				});
			},

			onDateChanged(newDate : { year : string; month : string; day : string; }) {
				console.log('接收到的日期:', newDate);
				this.year = newDate.year;
				this.month = newDate.month;
				this.day = newDate.day;
			}
		},
	};
</script>

<style>
	@import url("common.css");

	.container {
		display: flex;
		flex-direction: column;
		background-color: #1c1c1e;
		padding: 40px 20px;
	}

	/* 背景图片 */
	.background-image {
		position: absolute;
		top: 40px;
		right: 0px;
		width: 30%;
		height: 100vh;
		/* 确保背景图片覆盖整个视窗 */
		z-index: 1;
		/* 确保背景图片位于内容之下 */
	}

	/* 文本内容设置 */
	.text-content {
	  display: flex;
	  flex-direction: column;
	  align-items: flex-start;
	  margin-top: 0px;
	  margin-bottom: 40px;
	}

	.question {
		font-size: 20px;
		color: #ffffff;
		margin-bottom: 8px;
		font-weight: bold;
	}

	.subtitle {
		font-size: 14px;
		color: #8e8e93;
	}

	.date-picker-parent {
		width: 100%;
		height: 100px;
		overflow: visible;
		position: absolute;
		top: 30vh;
	}


</style>