<template>
	<view class="date-picker-container">
		<view class="mask top"></view>
		<picker-view class="picker-view" :indicator-style="indicatorStyle" :value="value" @change="bindChange">
			<picker-view-column class="picker-view-column">
				<view class="item" v-for="(item, index) in years" :key="index">
					<text class="text">{{ item }}年</text>
				</view>
			</picker-view-column>
			<picker-view-column class="picker-view-column">
				<view class="item" v-for="(item, index) in months" :key="index">
					<text class="text">{{ item }}月</text>
				</view>
			</picker-view-column>
			<picker-view-column class="picker-view-column">
				<view class="item" v-for="(item, index) in days" :key="index">
					<text class="text">{{ item }}日</text>
				</view>
			</picker-view-column>
		</picker-view>
		<view class="mask bottom"></view>
	</view>
</template>

<script>
	export default {
		data() {
			const date = new Date();
			const _years = [];
			const _year = date.getFullYear();
			const _months = [];
			const _month = date.getMonth() + 1;
			const _days = [];
			const _day = date.getDate();
			for (let i = 1950; i <= _year; i++) {
				_years.push(i);
			}
			for (let i = 1; i <= 12; i++) {
				_months.push(i);
			}
			for (let i = 1; i <= 31; i++) {
				_days.push(i);
			}
			return {
				title: 'picker-view',
				years: _years,
				year: _year,
				months: _months,
				month: _month,
				days: _days,
				day: _day,
				value: [ 2000, _month - 1, _day - 1],
				result: [],
				indicatorStyle: 'height: 50px;',
				userId: '',
				username: '',
				gender: '',
			};
		},
		created() {
			console.log("初始化月份:", this.months);
			console.log("初始化日期:", this.days);
			console.log("初始化年份:", this.years);
			this.$emit('dateChanged', {
				year: this.year,
				month: this.month,
				day: this.day
			});
		},
		methods: {
			bindChange(e) {
				const val = e.detail.value;
				this.result = val;
				this.year = this.years[val[0]];
				this.month = this.months[val[1]];
				this.day = this.days[val[2]];
				console.log(this.year, this.month, this.day);

				this.$emit('dateChanged', {
					year: this.year,
					month: this.month,
					day: this.day
				});
			},
		}
	};
</script>

<style scoped>
	.date-picker-container {
		position: relative;
		width: 100%;
		margin-top: 50rpx;
		background-color: #1c1c1e;
		overflow: visible;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.picker-view {
		width: 90%;
		height: 250px;
		position: relative;
		z-index: 1;
		background-color: #1c1c1e;
		padding-left: 20px;
		/* 设置为您想要的颜色 */
	}

	.item {
		height: 50px;
		padding-left: 20px;
	}

	.text {
		line-height: 50px;
		text-align: center;
		color: #ffffff;
	}

	.mask {
		position: absolute;
		left: 0;
		right: 0;
		height: 100px;
		/* 根据设计需要调整 */
		background-color: rgba(28, 28, 30, 1);
		/* 调整透明度 */
		z-index: 2;
	}

	.mask.top {
		top: 0;
	}

	.mask.bottom {
		bottom: 0;
	}
</style>