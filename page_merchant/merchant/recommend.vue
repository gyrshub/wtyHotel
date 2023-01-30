<template>
	<!-- 精品推荐页面 -->
	<view class="recommend">
		<view class="recommend_title">
			推荐列表
		</view>
		<view class="limitItem" v-for="(item,index) in shopList" :key="index" @click="toBuy(item)">
			<image class="shopImage" :src="item.goodsPicture"></image>
			<view class="shopInfo">
				<view class="shopName">{{item.goodsName}}</view>
				<view class="shopPrice">
					<view class="newPrice">
						<view class="dec">推荐价</view>
						￥
						<view class="light">{{item.boutiquePrice}}</view>
					</view>
					<view class="oldwPrice">￥{{item.goodsPrice}}</view>
				</view>
				<view class="number">
					<view :class="['number-btn',{nothing:item.stock == 0}]">{{item.stock != 0?'马上抢':'已售罄'}}</view>
				</view>
			</view>
		</view>
		<view style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"
			v-if="shopList.length === 0">
			<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shopList: [],
				total: 10,
				overContent: true,
				pageNo: 1,
				startTime:'',
				endTime:'',
			};
		},
		onShow() {
			this.shopList = []
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
				let res = await this.$get('/merchant/boutique/page', {
					current: this.pageNo,
					size: 10,
					latitude:'23.009475',
					longitude:'113.122532',
				})
				uni.showLoading({
					title: '加载中...'
				})
				// console.log('推荐商品', res)
				if (res.code == 200) {
					uni.hideLoading()
					this.overContent = true;
					this.total = res.data.total
					res.data.records.map(d => {
						d.goodsPrice = d.goodsPrice / 100
						d.boutiquePrice = d.boutiquePrice / 100
					})
					this.shopList = this.shopList.concat(res.data.records)
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
			async toBuy(item) {
				if (item.stock == 0) {
					uni.showToast({
						title: '该商品已无库存',
						icon: "none",
					})
					return
				}
				let goodDetail = JSON.parse(JSON.stringify(item))
				goodDetail.boutiquePrice = goodDetail.boutiquePrice * 100
				goodDetail.goodsPrice = goodDetail.goodsPrice * 100
				uni.setStorageSync('activity',JSON.stringify(goodDetail))
				if(item.merchantType == 0){
					uni.navigateTo({
						url: `/page_merchant/merchant/hotelOrder?id=${item.id}&type=1&startTime=${this.startTime}&endTime=${this.endTime}`
					})
				}else{
					uni.navigateTo({
						url:`/page_merchant/merchant/stealOrder?id=${item.id}&type=1&startTime=${this.startTime}&endTime=${this.endTime}`
					})
				}
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
	.recommend {
		padding: 0 32rpx;
		.recommend_title{
			font-size: 32rpx;
			margin: 20rpx 0;
			font-weight: bold;
		}
		.limitItem {
			padding: 32rpx;
			display: flex;
			margin-top: 32rpx;
			background-color: white;
			border-radius: 20rpx;

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
				flex-direction: row-reverse;

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
				}
			}

			
		}
	}
</style>
