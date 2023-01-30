<template>
	<!-- 限时购页面 -->
	<view class="limitBuy">
		<view class="topTool">
			<image class="topImg"
				src="https://jiudian-1313125514.cos.ap-guangzhou.myqcloud.com/jiudianxiangmu%2Flimit-bg.png"></image>
			<view class="tool" :style="{ top:statusBarHeight + 10 + 'px' }">
				<image class="icon" src="/static/white_back.png" @click="toBack"></image>
			</view>
			<view class="topTitle" :style="{ top:statusBarHeight + 10 + 'px' }">限时购</view>
		</view>

		<view class="content">
			<!-- 抢购时间表 -->
			<view class="timeList">
				<view class="timeItem" v-for="(item,index) in timeList" :key="index" @click="searchLimit(item)">
					<view>{{item}}</view>
					<view :class="['status',{active:searchText===item}]">
						{{nowTime == index?'抢购中':nowTime > index?'已开抢':'即将开抢'}}
					</view>
				</view>
			</view>

			<!-- 抢购内容 -->
			<view class="limitList">
				<view class="limit_title">
					<view style="color: #FA6060;">抢购商品</view>
					<view style="color: #707070;">好价总在犹豫中错过</view>
				</view>
				<view class="limitItem" v-for="(item,index) in shopList" :key="index">
					<image class="shopImage" :src="item.goodsPicture"></image>
					<view class="shopInfo">
						<view class="shopName">{{item.goodsName}}</view>
						<view class="shopPrice">
							<view class="newPrice">
								<view class="dec">抢购价</view>
								￥
								<view class="light">{{item.spikePrice}}</view>
							</view>
							<view class="oldwPrice">￥{{item.goodsPrice}}</view>
						</view>
						<view class="number">
							<view class="number-left">
								<view class="showNumber">仅剩
									<view class="nowNumber">
										{{item.stock}}
									</view>
									件
								</view>
								<view class="line">
									<view :style="{'width':`${item.percent}%`}" class="activeline"></view>
								</view>
							</view>
							<view v-if="item.showBtn" :class="['number-btn',{nothing:item.stock == 0}]" @click="toBuy(item)">{{item.stock != 0?'马上抢':'已售罄'}}</view>
						</view>
					</view>
				</view>
				<view style="margin-top: 80px;" v-if="shopList.length === 0">
					<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				nowTime: -1, // 到达特定时间才加1
				timeList: ['16:00', '18:00', '20:00', '22:00','次日'],
				searchText:'16:00',
				shopList: [],
				total: 10,
				overContent: true,
				pageNo: 1,
				startTime:'',
				endTime:'',
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
			this.checkTime()
			this.getRecommendList()
		},
		onLoad(options) {
			this.startTime = options.startTime
			this.endTime = options.endTime
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			var allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.form.pageNo++;
				this.getRecommendList();
			}
		},
		methods: {
			async getRecommendList() {
				let res = await this.$get('/merchant/spike/page', {
					current: this.pageNo,
					size: 10,
					hour:this.searchText,
					latitude:23.009475,
					longitude:113.122532,
				})
				uni.showLoading({
					title: '加载中...'
				})
				// console.log('限时商品', res)
				if (res.code == 200) {
					uni.hideLoading()
					this.overContent = true;
					if(res.data){
						this.total = res.data.total
						res.data.records.map(d => {
							d.goodsPrice = d.goodsPrice / 100
							d.spikePrice = d.spikePrice / 100
							d.percent = (d.stock / d.totalNum) * 100
							if(this.searchText != '次日' && this.nowTime >= 0){
								let time = d.startTime.split(" ")[1]
								d.showBtn = time == this.timeList[this.nowTime] + ':00'?true:false
							}
						})
						this.shopList = this.shopList.concat(res.data.records)
					}
				} else {
					if (!this.overContent) {
						this.overContent = true;
						this.pageNo--;
					}
					uni.hideLoading()
					uni.showToast({
						title: res.msg
					})
				}
			},
			searchLimit(name){
				this.shopList = []
				this.searchText = name
				this.getRecommendList()
			},
			checkTime() {
				let now = new Date();
				let yy = new Date().getFullYear();
				let mm = new Date().getMonth() + 1;
				let dd = new Date().getDate();
				let day = yy + '/' + mm + '/' + dd;
				let nowTime = new Date().getTime()
				for (let i = 0; i < this.timeList.length-1; i++) {
					let j = new Date(day + ' ' + this.timeList[i]).getTime()
					if (nowTime >= j) {
						this.nowTime = i;
						this.searchText = this.timeList[this.nowTime]
					}
				}
			},
			async toBuy(item) {
				if (item.stock == 0) {
					uni.showToast({
						title: '该商品已无库存',
						icon: "none",
					})
					return
				}
				let goods = JSON.parse(JSON.stringify(item))
				goods.goodsPrice = goods.goodsPrice * 100
				goods.spikePrice = goods.spikePrice * 100
				uni.setStorageSync('activity',JSON.stringify(goods))
				if(item.merchantType == 0){
					uni.navigateTo({
						url: `/page_merchant/merchant/hotelOrder?id=${item.id}&type=2&startTime=${this.startTime}&endTime=${this.endTime}`
					})
				}else{
					uni.navigateTo({
						url:`/page_merchant/merchant/stealOrder?id=${item.id}&type=2&startTime=${this.startTime}&endTime=${this.endTime}`
					})
				}
			},
			toBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.limitBuy {
		.topTool {
			width: 750rpx;
			height: 460rpx;
			position: relative;

			.topImg {
				width: 100%;
				height: 100%;
			}

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
		}

		.content {
			margin-top: -260rpx;
			padding-bottom: 40rpx;

			.timeList {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 32rpx;
				box-sizing: border-box;
				position: relative;
				z-index: 100;

				.timeItem {
					flex: 1;
					color: #FFFFFF;
					font-size: 32rpx;
					display: flex;
					flex-direction: column;
					align-items: center;

					.status {
						font-size: 26rpx;
						margin-top: 8rpx;
						padding: 2rpx 20rpx;
						border-radius: 20rpx;
						white-space: nowrap;
					}

					.active {
						color: #FA6060;
						background-color: #FFFFFF;
					}
				}
			}
		}

		.limitList {
			background-color: #FFFFFF;
			border-radius: 20rpx;
			padding: 32rpx;
			position: relative;
			z-index: 20;
			margin-top: 48rpx;

			.limit_title {
				font-size: 28rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 32rpx;
			}

			.limitItem {
				padding: 32rpx 0;
				display: flex;

				&:not(:last-child) {
					border-bottom: 1px solid #F5F5F5;
				}

				.shopImage {
					width: 224rpx;
					height: 224rpx;
					flex-shrink: 0;
					margin-right: 20rpx;
					border-radius: 10rpx;
				}

				.shopInfo {
					display: flex;
					flex: 1;
					flex-direction: column;
					justify-content: space-between;
					font-size: 24rpx;
					.shopName {
						font-size: 32rpx;
						color: #0B0B0B;
						font-weight: bold;
						text-overflow: ellipsis;
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					.shopPrice {
						display: flex;
						align-items: center;

						.newPrice {
							color: #DC4444;
							display: flex;
							align-items: center;

							.dec {
								transform: rotate(0.8);
								transform-origin: left;
							}

							.light {
								font-size: 40rpx;
								font-family: Bahnschrift_SemiBold;
							}

							margin-right: 8rpx;
						}

						.oldwPrice {
							color: #979797;
							text-decoration: line-through;
						}
					}
				}



				.number {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.number-left {
						.showNumber {
							display: flex;
							align-items: center;
							transform: rotate(0.8);
							transform-origin: left;
							color: #707070;

							.nowNumber {
								color: #121212;
								margin: 0 8rpx;
							}
						}

						.line {
							width: 272rpx;
							height: 16rpx;
							border-radius: 20rpx;
							background-color: #FFEAED;
							position: relative;
							overflow: hidden;
							margin-top: 8rpx;

							.activeline {
								border-radius: 20rpx;
								position: absolute;
								top: 0;
								left: 0;
								height: 100%;
								background-color: #DC4444;
								z-index: 8;
							}
						}
					}

					.number-btn {
						background: #DC4444;
						border-radius: 10rpx;
						color: white;
						padding: 8rpx 20rpx;

						&:active {
							background: #d14141;
						}
					}
					.nothing {
						background: #d6d6d6;
						color: #707070;
						&:active {
							background: #d6d6d6;
						}
					}
				}
			}
		}
	}
</style>
