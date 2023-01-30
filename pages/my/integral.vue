<template>
	<!-- 我的积分页面 -->
	<page-meta :page-style="'overflow:'+(showTimeList?'hidden':'visible')"></page-meta>
	<view class="integral">
		<view class="myIntegral">
			我的积分
			<view class="number">
				{{integral}}
			</view>
		</view>

		<view class="integralContent">
			<view class="content-top">
				<view class="left">积分收支明细</view>
				<view class="right">
					<view class="showTime" @click.stop="showTimeList = true">
						<view class="time">{{date}}</view>
						<u-icon v-if="showTimeList == false" name="arrow-down" color="#333333" size="16"></u-icon>
						<u-icon v-if="showTimeList == true" name="arrow-up" color="#333333" size="16"></u-icon>
					</view>
					<view class="record">
						支出 {{cost}} | 收入 {{recharge}}
					</view>
				</view>
			</view>
			<view class="infoList">
				<view class="infoItem" v-for="(integral,number) in moneyList" :key="number">
					<view class="infoItem-left">
						<view class="name">{{integral.integralContent}}</view>
						<view class="time">{{integral.createTime}}</view>
					</view>
					<view :class="['infoItem-right',{cost:integral.integralType == 1}]">
						<view class="moneyText">
							<view v-if="integral.integralType == 0">+</view>
							<view v-if="integral.integralType == 1">-</view>
							{{integral.integralNum}}
						</view>
						<view class="refund">
							{{integral.typeText}}
						</view>
					</view>
				</view>
				
				<view style="margin-top: 90px;" v-if="moneyList.length === 0">
					<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
					</u-empty>
				</view>
				
			</view>
		</view>
		<u-datetime-picker :show="showTimeList" v-model="value1" mode="year-month" @confirm="bindDateChange"
			@cancel="showTimeList = false" :closeOnClickOverlay="true" @close="showTimeList = false"></u-datetime-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				integral: 0,
				date: '',
				value1: 0,
				show: false,
				showTimeList: false,
				cost: '0',
				recharge: '0',
				timeDate: '',
				pageNo: 1,
				overContent: true,
				moneyList: []
			};
		},
		created() {
			let now = new Date();
			this.value1 = now.getTime()
			let YY = now.getFullYear();
			let MM = now.getMonth() + 1;
			MM = MM >= 10 ? MM : '0' + MM;
			this.date = YY + '年' + MM + '月';
			this.timeDate = YY + '-' + MM
			this.getUserInfo()
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.pageNo++;
				this.getIntegralList();
			}
		},
		methods: {
			async getIntegralList() {
				let res = await this.$get('/user/integral/details/page', {
					date: this.timeDate,
					current: this.pageNo,
					size: 10
				})
				// console.log('积分明细',res)
				uni.showLoading({
					title: '加载中'
				})
				if (res.code === 200) {
					uni.hideLoading()
					this.overContent = true;
					this.cost = res.data.expenditureIntegral || 0
					this.recharge = res.data.incomeIntegral || 0
					if (res.data.page.records) {
						res.data.page.records.map(d=>{
							d.typeText = d.integralSource == 0?'商家订单'
							: d.integralSource == 1?'商家订单退款'
							: d.integralSource == 10?'积分订单'
							: d.integralSource == 21?'充值活动':'活动'
						})
						this.moneyList = this.moneyList.concat(res.data.page.records);
					}
					this.total = res.data.total;
					// console.log('数据',this.moneyList)
				} else {
					this.overContent = true;
					this.pageNo--;
					uni.showToast({
						title: res.msg
					})
					uni.hideLoading()
				}
			},
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				if (res.code == 200) {
					this.userInfo = res.data
					this.integral = this.userInfo.integral
					this.getIntegralList()
				} else {
					uni.showToast({
						title: res.msg
					})
				}
			},
			bindDateChange(value) {
				let time = new Date(value.value)
				let YY = time.getFullYear()
				let MM = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : '0'+(time.getMonth() + 1)

				this.timeDate = YY + "-" + MM;
				this.date = YY + '年' + MM + '月';
				this.showTimeList = false;
				this.moneyList = [];
				this.pageNo = 1;
				this.overContent = true;
				this.getIntegralList()
			},
			toPath(url) {
				uni.navigateTo({
					url: url
				})
			},
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.integral {
		background-color: #F5F5F5;

		.myIntegral {
			color: #121212;
			display: flex;
			align-items: center;
			padding: 32rpx;

			.number {
				font-weight: bold;
				font-size: 56rpx;
				font-family: Bahnschrift;
				margin-left: 20rpx;
			}
		}

		.integralContent {
			background-color: white;
			border-radius: 20rpx;
			padding: 42rpx 32rpx;

			.content-top {
				display: flex;
				justify-content: space-between;
				border-bottom: 2rpx solid #F5F5F5;
				padding-bottom: 32rpx;

				.left {
					font-size: 32rpx;
					color: #121212;
					font-weight: bold;
				}

				.right {
					display: flex;
					flex-direction: column;
					align-items: flex-end;

					.showTime {
						width: 240rpx;
						font-size: 26rpx;
						color: #333333;
						background: #F5F5F5;
						border-radius: 15px;
						padding: 16rpx 28rpx;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: center;
						position: relative;

						.time {
							margin-right: 4rpx;
						}

						.timeList {
							width: 240rpx;
							background-color: #F5F5F5;
							color: #121212;
							border-radius: 10rpx;
							position: absolute;
							left: 0;
							bottom: -230rpx;

							.time-item {
								padding: 20rpx 28rpx;
								border-radius: 10rpx;
								text-align: center;

								&:active {
									background-color: #FFFFFF;
								}
							}
						}
					}

					.record {
						font-size: 24rpx;
						color: #FB8146;
						margin-top: 16rpx;
					}
				}
			}

			.infoList {
				.infoItem {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 32rpx 0;
					border-bottom: 2rpx solid #F5F5F5;

					.infoItem-left {
						width: 70%;

						.name {
							font-weight: bold;
							font-size: 30rpx;
							color: #121212;
						}

						.time {
							font-size: 26rpx;
							color: #707070;
							margin-top: 4rpx;
						}
					}

					.infoItem-right {
						color: #FB8146;
						font-size: 40rpx;
						font-family: Bahnschrift;
						display: flex;
						flex-direction: column;
						align-items: flex-end;
						.moneyText{
							font-size: 40rpx;
							font-family: Bahnschrift;
							display: flex;
							align-items: center;
						}
						.refund{
							font-size: 24rpx;
							color: rgb(249, 5, 5);
						}
					}

					.cost {
						color: #47D33E;
					}
				}
			}
		}
	}
</style>
