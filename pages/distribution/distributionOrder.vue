<template>
	<!-- 分销订单页面 -->
	<view class="distributionOrder">
		<view class="topTool">
			<view class="sumPrice">
				<view class="">
					分销奖金累计：￥{{sumPrice}}
				</view>
				<view class="">
					可提现金额：￥{{withdrawBonus}}
				</view>
				<view class="">
					客人总数：{{guestNum}}
				</view>
			</view>
			<view class="withdraw" @click="toWithdraw">
				前去提现
				<u-icon  name="arrow-right" color="#333333" size="14"></u-icon>
			</view>
		</view>

		<view class="orderList">
			<view class="order-item" v-for="(item,index) in orderList" :key="index">
				<view class="order-item-top">
					<view class="user">
						<image class="userImage" :src="item.avatar"></image>
						<view class="name">{{item.nickName}}</view>
					</view>
					<view class="status">{{item.grade}}</view>
				</view>
				<view class="order-item-bottom">
					<view class="order-item-row">
						<view class="leftTitle">下单时间</view>
						<view class="value">{{item.orderTime}}</view>
					</view>
					<view class="order-item-row">
						<view class="leftTitle">佣金</view>
						<view class="value price">￥{{item.price}}</view>
					</view>
				</view>
			</view>
		</view>

		<view style="margin-top: 40rpx;" v-if="orderList.length === 0">
			<u-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:'',
				guestNum:0,// 顾客数量
				withdrawBonus:0,// 可提现金额
				sumPrice: 0,// 总分销奖金
				timeDate: '',
				number:0,
				showTimeList: false,
				pageNo: 1,
				total: 0,
				overContent: true,
				orderList: [],
				showType:10,
			};
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.pageNo++;
				this.getDistributionOrder();
			}
		},
		created() {
			let now = new Date();
			let YY = now.getFullYear();
			let MM = now.getMonth() + 1;
			MM = MM >= 10 ? MM : '0' + MM;
			this.date = YY + '年' + MM + '月';
			this.timeDate = YY + '-' + MM
			this.getUserInfo();
		},
		methods: {
			async getDistributionOrder() {
				let res = await this.$get('/salesman/guest/order/page', {
					current: this.pageNo,
					size: 10,
					parentUserId:this.userInfo.id
				})
				// console.log('订单结果',res)
				
				uni.showLoading({
					title: '加载中'
				})
				if (res.code === 200) {
					uni.hideLoading()
					this.overContent = true;
					res.data.records.map(d => {
						d.grade = '一级'
						d.price = d.commission / 100
						return d;
					})
					this.orderList = this.orderList.concat(res.data.records);
					this.total = res.data.total;
				} else {
					this.overContent = true;
					this.pageNo--;
					uni.showToast({
						title: res.msg,
						icon:'none'
					})
					uni.hideLoading()
				}
			},
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				// console.log('用户',res)
				if (res.code == 200) {
					this.userInfo = res.data
					this.sumPrice = this.userInfo.userTypeApplyVO.totalBonus / 100
					this.guestNum = this.userInfo.userTypeApplyVO.totalGuestNum
					this.withdrawBonus = this.userInfo.userTypeApplyVO.withdrawBonus / 100
					this.getDistributionOrder()
				} else {
					uni.showToast({
						title: res.msg,
						icon:'none'
					})
x				}
			},
			toWithdraw(){
				uni.navigateTo({
					url:`/pages/my/recharge?type=1&money=${this.withdrawBonus}&userId=${this.userInfo.id}`
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #F5F5F5;
	}
</style>
<style lang="less" scoped>
	.distributionOrder {
		padding-bottom: 80rpx;

		.topTool {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #FFF;
			padding: 20rpx;

			.sumPrice {
				font-size: 28rpx;
				color: #FB8146;
				width: 65%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.withdraw{
				font-size: 28rpx;
				display: flex;
				align-items: baseline;
			}

		}

		.orderList {
			margin-top: 20rpx;

			.order-item {
				padding: 32rpx;
				font-size: 28rpx;
				color: #0B0B0B;
				margin-top: 20rpx;
				background-color: white;
				border-radius: 20rpx;

				.order-item-top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-bottom: 32rpx;
					border-bottom: 1px solid #F5F5F5;

					.user {
						display: flex;
						align-items: center;

						.userImage {
							width: 84rpx;
							height: 84rpx;
							border-radius: 50%;
							margin-right: 20rpx;
						}
					}

					.status {
						color: white;
						border-radius: 20rpx;
						font-size: 24rpx;
						padding: 6rpx 24rpx;
						background: linear-gradient(90deg, #FFAA65 0%, #FB8146 100%);
					}
				}

				.order-item-bottom {
					.order-item-row {
						padding-top: 32rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.leftTitle {
							color: #707070;
						}

						.price {
							color: #FB8146;
						}
					}
				}
			}
		}
	}
</style>
