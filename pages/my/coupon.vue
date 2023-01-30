<template>
	<!-- 优惠券 -->
	<view class="coupon">
		<u-subsection :list="list" :current="current" mode="button" activeColor="#0B0B0B" @change="sectionChange"
			style="background-color: #EBEBEB;"></u-subsection>
		<view class="couponList" v-for="(item,index) in couponList" :key="index" @click="toHome">
			<view class="couponItem">
				<view class="couponItem-top">
					<view class="couponInfo">
						<view class="couponName">{{item.couponName}}</view>
						<view class="time">
							<view>使用期限：</view>
							<view>{{item.time}}</view>
						</view>
						<view class="couponDescription">{{item.description}}</view>
					</view>
					<view class="couponValue">
						<view class="price">
							<view class="pIcon">￥</view>
							{{item.denomination}}
						</view>
						<view v-if="item.achieveMoney">{{item.achieveMoney}}</view>
					</view>
					<view class="stamp">
						{{item.useState == '0'?'已过期':item.useState == '1'?'未使用':'已使用'}}
					</view>
				</view>
				<view class="couponItem-bottom" v-if="item.useState == '1'">立即使用</view>
			</view>
		</view>
		<view style="margin-top: 40rpx;" v-if="couponList.length === 0">
			<u-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						name: '未使用',
						value: 1
					},
					{
						name: '已使用',
						value: 2
					},
					{
						name: '已过期',
						value: 0
					}
				],
				couponStatus: 1,
				current: 0,
				pageNo: 1,
				total: 10,
				overContent: true, // 节流
				couponList: []
			};
		},
		created() {
			this.getCoupon();
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.pageNo++;
				this.getCoupon();
			}
		},
		methods: {
			async getCoupon() {
				let that = this;
				let res = await that.$get('/coupon/user/page', {
					useState: that.couponStatus,
					current: that.pageNo,
					size: 10
				})
				console.log('优惠券',res)
				uni.showLoading({
					title:'加载中'
				})
				if (res.code === 200) {
					this.overContent = true;
					uni.hideLoading()
					this.total = res.data.total;
					res.data.records.map(d => {
						let start = this.rewriteTime(d.startTime)
						let end = this.rewriteTime(d.endTime)
						d.time = start + '至' + end
						if (d.achieveMoney) {
							d.achieveMoney = "满" + d.achieveMoney / 100 + "元使用"
						}else{
							d.achieveMoney = "任意使用"
						}
						d.description = d.merchantIds?'部分商家使用':''
						d.denomination = d.denomination / 100

						return d
					})
					this.couponList = this.couponList.concat(res.data.records);
				}else{
					if(!this.overContent){
						this.overContent = true;
						this.pageNo--;
					}
					uni.hideLoading()
					uni.showToast({
						title:res.msg
					})
				}
			},
			// 重写时间
			rewriteTime(time) {
				let rewrite = new Date(time);
				let YY = rewrite.getFullYear();
				let MM = rewrite.getMonth() + 1 >= 10?rewrite.getMonth() + 1:'0'+(rewrite.getMonth() + 1);
				let DD = rewrite.getDate() >= 10 ? rewrite.getDate() : '0'+rewrite.getDate();
				return YY + '.' + MM + '.' + DD
			},
			sectionChange(index) {
				this.couponStatus = this.list[index].value
				this.pageNo = 1;
				this.current = index;
				this.couponList = []
				this.getCoupon();
			},
			toHome(){
				uni.switchTab({
					url:'/pages/index/index'
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
	.coupon {
		padding: 20rpx 32rpx 80rpx 32rpx;

		.couponList {
			margin-top: 32rpx;

			.couponItem {
				margin-bottom: 32rpx;
				background-color: white;
				border-radius: 20rpx;
				padding: 40rpx 32rpx 28rpx 40rpx;
				box-sizing: border-box;
				color: #121212;

				.couponItem-top {
					font-size: 26rpx;
					border-bottom: 2rpx dotted #EBEBEB;
					display: flex;
					justify-content: space-between;
					padding-bottom: 40rpx;
					position: relative;

					.couponInfo {
						width: 68%;
						font-size: 26rpx;
						display: flex;
						flex-direction: column;
						align-items: flex-start;

						.couponName {
							color: white;
							background-color: #FB8146;
							padding: 4rpx 20rpx;
							border-radius: 0 20rpx 0 20rpx;
						}

						.time {
							margin: 12rpx 0;
						}

						.couponDescription {
							color: #47D33E;
						}
					}

					.couponValue {
						font-size: 24rpx;
						color: #707070;
						width: 30%;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						.price {
							display: flex;
							font-size: 84rpx;
							font-family: Bahnschrift_SemiBold;
							color: #121212;

							.pIcon {
								font-size: 24rpx;
								transform: scale(0.75);
								transform-origin: left;
							}
						}
					}

					.stamp {
						color: #999999;
						padding: 20rpx;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: rotate(30deg);
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						border: 1px solid #999999;
						z-index: 20;

						&::after {
							width: 70rpx;
							height: 70rpx;
							padding: 20rpx;
							content: '';
							position: absolute;
							border: 1px solid #999999;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							border-radius: 50%;
						}
					}
				}

				.couponItem-bottom {
					font-weight: bold;
					font-size: 28rpx;
					margin-top: 26rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
</style>
