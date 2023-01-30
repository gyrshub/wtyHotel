<template>
	<view class="shopDetail">
		<view class="goods_info">
			<swiper class="swiper" circular :autoplay="true" :interval="5000">
				<swiper-item v-for="(item,index) in goodsObj.imageList" :key="index">
					<image style="width: 100%;height: 100%;" :src="item" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="goodsName">
				{{goodsObj.goodsName}}
			</view>
			<view class="info_item">
				<view class="stock">库存：{{goodsObj.stock}}</view>
				<view class="type">{{goodsObj.goodsType == 0?'积分兑换':goodsObj.goodsType == 1?'余额(现金)兑换':'积分+余额(现金)兑换'}}
				</view>
			</view>
			<view class="cost">
				{{goodsObj.goodsType == 0?goodsObj.goodsIntegral+'积分':goodsObj.goodsType ==1?
				goodsObj.goodsPrice+'元':goodsObj.goodsIntegral+'积分+'+goodsObj.goodsPrice+'元'}}
			</view>
		</view>
		<view class="goods_item">
			<view class="title">
				商品详情：
			</view>
			<view class="goods_detail" v-html="goodsObj.detail"></view>
		</view>
		<view class="goods_item">
			<view class="title">
				商品规格：
			</view>
			<view class="goods_rule" v-html="goodsObj.rulue"></view>
		</view>
		<view style="height: 180rpx;"></view>
		<view class="bottom_style">
			<view class="bottom_btn" @click="toDetail">
				立即兑换
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				statusBarHeight: 0,
				keyword: '',
				type: 0,
				goodsObj: {
					imageList:[''],
					goodsName: '积分商品',
					stock: 1,
					goodsType: 0, // 0 纯积分 1 纯钱 2积分+钱
					goodsIntegral: 0,
					goodsPrice: 0,
					detail: '',
					rulue: ''
				},
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		onLoad(option) {
			this.id = option.id
			this.getDetail()
		},
		methods: {
			async getDetail(){
				let res = await this.$get('/integral/goods/detail',{
					id:this.id
				})
				// console.log('商品详情',res)
				if(res.code == 200){
					this.goodsObj = res.data
					this.goodsObj.goodsType = 0
					this.goodsObj.goodsPrice = this.goodsObj.goodsPrice / 100
					this.goodsObj.detail = this.goodsObj.goodsDetails
					this.goodsObj.rulue = this.goodsObj.goodsAttr
					this.goodsObj.imageList = this.goodsObj.goodsCarousel.split(',')
				}
			},
			async toDetail() {
				let res = await this.$get('/user/getInfo')
				if(res.code == 200){
					this.userDetail = res.data
					this.userDetail.money = this.userDetail.money / 100
					if(this.goodsObj.goodsIntegral > this.userDetail.integral){
						uni.showToast({
							title:'用户积分不足',
							icon:'none'
						})
					}else{
						uni.navigateTo({
							url:`/pages/shop/payOrder?id=${this.goodsObj.id}`
						})
					}
				}
			}
		}
	}
</script>
<style>
	page {
		background: #F6F6F6;
	}
</style>
<style lang="less" scoped>
	.shopDetail {
		padding: 0 30rpx;
		box-sizing: border-box;

		.goods_info {
			padding: 24rpx 30rpx;
			border-radius: 20rpx;
			background-color: #fff;
			box-sizing: border-box;
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.5);
			color: #3D3D3D;
			.swiper{
				width: 100%;
				height: 630rpx;
			}
			.goods_img {
				width: 100%;
				height: 630rpx;
			}

			.goodsName {
				font-size: 40rpx;
				font-weight: bold;
			}

			.info_item {
				display: flex;
				align-items: center;
				margin: 26rpx 0;
				.stock {
					font-size: 24rpx;
					color: #979797;
					margin-right: 20rpx;
				}

				.type {
					font-size: 24rpx;
					transform: scale(0.85);
					transform-origin: center center;
					background: rgba(249, 226, 150, 0.5);
					padding: 8rpx 10rpx;
				}
			}

			.cost {
				font-size: 52rpx;
				color: #FF0000;
				font-weight: bold;
			}
		}
		
		.goods_item{
			font-size: 28rpx;
			color: #BCBFC4;
			margin-top: 30rpx;
			.title{
				font-size: 32rpx;
				color: #3D3D3D;
				margin-bottom: 14rpx;
			}
			.goods_detail{
				color: #081831;
				padding: 20rpx 40rpx;
				box-sizing: border-box;
				background: #ECECEC;
				border-radius: 15px 15px 15px 15px;
			}
			.goods_rule{
				
			}
		}
		
		.bottom_style{
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			padding: 28rpx 56rpx 40rpx 56rpx;
			box-sizing: border-box;
			background: #F6F6F6;
			.bottom_btn{
				text-align: center;
				font-size: 48rpx;
				color: #FAE4A7;
				background-color: #0A142A;
				border-radius: 20rpx;
				padding: 20rpx 0;
			}
		}
	}
</style>
