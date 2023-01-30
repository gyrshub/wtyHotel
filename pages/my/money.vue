<template>
	<!-- 零钱明细页面 -->
	<page-meta :page-style="'overflow:'+(showTimeList?'hidden':'visible')"></page-meta>
	<view class="money">
		<view class="topTool">
			<view class="tool" :style="{top:statusBarHeight + 10 + 'px'}">
				<image class="icon" src="/static/white_back.png" @click.stop="toBack"></image>
			</view>
			<view class="topTitle" :style="{top:statusBarHeight + 10 + 'px'}">零钱明细</view>
			<view class="showMoney">
				<view>余额(元)</view>
				<view class="money">
					￥<view class="light">
						{{money}}
					</view>
				</view>
			</view>
		</view>

		<view class="moneyInfo">
			<view class="info">
				<view class="info-left">
					<view class="left_item">支出 {{cost}}</view>
					<view class="left_item">收入 {{recharge}}</view>
				</view>
				<view class="info-right">
					<view class="showTime" @click.stop="showTimeList = true">
							<view class="time">{{date}}</view>
							<u-icon v-if="showTimeList == false" name="arrow-down" color="#FFFFFF" size="16"></u-icon>
							<u-icon v-if="showTimeList == true" name="arrow-up" color="#FFFFFF" size="16"></u-icon>
					</view>
				</view>
			</view>

			<view class="infoList">
				<view class="infoItem" v-for="(money,number) in moneyList" :key="number">
					<view class="infoItem-left">
						<view class="name">{{money.walletContent}}</view>
						<view class="time">{{money.createTime}}</view>
					</view>
					<view :class="['infoItem-right',{cost:money.mode == 0}]">
						<view class="moneyText">
							<view v-if="money.mode">+</view>
							<view v-if="!money.mode">-</view>
							{{money.number}}
						</view>
						<view class="refund">
							{{money.typeText}}
						</view>
					</view>
				</view>
				
				<view style="margin-top: 90px;color: #B4B9C5;" v-if="moneyList.length === 0">
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
				statusBarHeight: 0,
				timeDate:'',
				money: 0,
				cost: 0,
				recharge:0,
				value1: 0,
				orderList:'',
				date:'',
				pageNo:1,
				overContent:true,
				showTimeList: false,
				moneyList: [],
				userInfo:''
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
			this.getUserInfo()
			let now = new Date();
			this.value1 = now.getTime()
			let YY = now.getFullYear();
			let MM = now.getMonth()+1;
			MM = MM >= 10 ? MM : '0' + MM;
			this.date = YY + '年' + MM + '月';
			this.timeDate = YY + '-' + MM
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
		methods: {
			async getDistributionOrder(){
				let res = await this.$get('/user/wallet/details/page',{
					date:this.timeDate,
					current:this.pageNo,
					size:10
				})
				uni.showLoading({
					title:'加载中'
				})
				// console.log('订单列表',res)
				if(res.code === 200){
					uni.hideLoading()
					this.overContent = true;
					this.cost = res.data.expenditureMoney / 100 || 0
					this.recharge = res.data.incomeMoney / 100 || 0
					
					res.data.page.records.map(d=>{
						d.number = d.walletMoney/100
						d.mode = d.walletType == 0? 1 : 0
						// （0商家订单 1商家订单退款 10积分订单 20充值 21充值活动）
						d.typeText = d.walletSource == 0?'商家订单'
						: d.walletSource == 1?'商家订单退款'
						: d.walletSource == 10?'积分订单'
						: d.walletSource == 20?'充值':'充值活动'
						return d;
					})
					if (res.data.page.records) {
						this.moneyList = this.moneyList.concat(res.data.page.records);
					}
					this.total = res.data.total;
				}else{
					this.overContent = true;
					this.pageNo--;
					uni.showToast({
						title:res.msg
					})
					uni.hideLoading()
				}
			},
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				if (res.code == 200) {
					this.userInfo = res.data
					this.userInfo.money = this.userInfo.money / 100
					this.money = this.userInfo.money == 0? 0 : this.userInfo.money.toFixed(2)
					this.getDistributionOrder()
				} else {
					uni.showToast({
						title: res.msg
					})
				}
			},
			bindDateChange(value){
				let time = new Date(value.value)
				let YY = time.getFullYear()
				let MM = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : '0'+(time.getMonth() + 1)
				
				this.timeDate = YY + "-" + MM;
				this.date = YY + '年' + MM + '月';
				this.showTimeList = false;
				this.moneyList = [];
				this.pageNo = 1;
				this.overContent = true;
				this.getDistributionOrder()
			},
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>
<style>
	page{
		background-color: #F6F6F6;
	}
</style>
<style lang="less" scoped>
	.money {
		.topTool {
			width: 750rpx;
			height: 424rpx;
			position: relative;
			background: url('https://zy.xry.ink/file-api/statics/2022/11/21/62bf4f9e5b814e0d9f79857653f85deb_20221121102039A467.png') no-repeat;
			background-position: 0% 0%;
			background-size: 100% 100%;
			z-index: 5;
			.tool {
				width: 100%;
				position: absolute;
				left: 0;
				z-index: 10;
				padding: 0 32rpx;
				box-sizing: border-box;

				.icon {
					width: 40rpx;
					height: 40rpx;
				}
			}

			.topTitle {
				position: absolute;
				left: 50%;
				z-index: 10;
				transform: translateX(-50%);
				font-size: 32rpx;
				color: #FFFFFF;
			}
			.showMoney{
				color: #3D3D3D;
				font-size: 32rpx;
				z-index: 100;
				position: absolute;
				padding: 0 32rpx;
				left: 0;
				top: 160rpx;
				
				.money {
					font-size: 32rpx;
					font-family: Bahnschrift;
					display: flex;
					align-items: center;
					margin-top: 60rpx;
				
					.light {
						font-size: 50rpx;
						color: #081831;
					}
				}
			}

		}

		.moneyInfo {
			color: #FFFFFF;
			font-size: 24rpx;
			z-index: 100;
			// margin-top: -240rpx;
			position: relative;

			.info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				background: linear-gradient(90deg, #141414 0%, rgba(78,78,78,0.97) 89%);
				border-radius: 0 0 20rpx 20rpx;
				padding: 20rpx 50rpx;
				box-sizing: border-box;
				.info-left{
					display: flex;
					.left_item{
						position: relative;
						&:first-child{
							margin-right: 80rpx;
							&::after{
								content: '|';
								color: #FFF;
								position: absolute;
								top: 0;
								right: -44rpx;
							}
						}
					}
				}
				.info-right {
					display: flex;
					align-items: center;
					position: relative;

					.showTime{
						display: flex;
						font-size: 26rpx;
						align-items: center;
						justify-content: center;
					}

					.active {
						border-top: 0;
						border-bottom: 10rpx solid #FFFFFF;
					}
				}
			}

			.timeList {
				width: 180rpx;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				color: #121212;
				position: absolute;
				left: -10rpx;
				bottom: -220rpx;

				.time-item {
					padding: 16rpx 10rpx;
					border-radius: 10rpx;
					&:active{
						background-color: #F5F5F5;
					}
				}
			}
		}

		.infoList {
			margin-top: 80rpx;
			padding: 0 40rpx;
			box-sizing: border-box;
			position: relative;
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
</style>
