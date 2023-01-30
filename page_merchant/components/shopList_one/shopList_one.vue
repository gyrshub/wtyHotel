<template>
	<view class="shop_list">
		<view class="shop_item" v-for="(item,index) in orderList" :key="index" @click="toPath(item.url)">
			<view class="shop_itemBg"></view>
			<image class="shop_img" :src="item.picture"></image>
			<view class="shop_info">
				<view class="info_top">
					<view class="info_distance">
						<image class="info_topIcon" src="@/static/locate1.png" mode=""></image>
						{{item.distance}}
					</view>
					<view class="info_topLabel">
						{{item.label}}
					</view>
				</view>
				<view class="info_content">
					<view class="info_title">
						<view class="titleText">
							{{item.merchantName}}
						</view>
						<image @click.stop="changeCollect(item,index)" v-if="item.collection" class="collect" src="@/static/collect_ed.png"></image>
						<image @click.stop="changeCollect(item,index)" v-if="!item.collection" class="collect" src="@/static/collect.png"></image>
					</view>
					<view class="info_item">
						<view class="score">
							{{item.score}}
						</view>
						<view class="sold">
							已售:{{item.salesNum}}
						</view>
					</view>
					<view class="info_item goods" v-for="(goods,number) in item.goodsList" :key="number">
						<view class="goods_left">
							<image class="coupon_icon" src="@/static/welfare.png" mode=""></image>
							{{goods.goodsName}}
						</view>
						<view class="goods_price">
							￥{{goods.price}}元
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			orderList:{
				type:Array,
				default:[]
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			changeCollect(item,index){
				this.$emit('changeCollect',item.collection,index)
			},
			toPath(url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.shop_list{
			padding: 0 40rpx 0 14rpx;
			.shop_item{
				position: relative;
				display: flex;
				margin-top: 30rpx;
				padding: 10rpx 20rpx 24rpx 20rpx;
				box-sizing: border-box;
				overflow-x: hidden;
				.shop_itemBg{
					width: 100%;
					height: 82%;
					background: #FFFFFF;
					border-radius: 20rpx;
					position: absolute;
					left: 0;
					bottom: 0;
					z-index: -1;
				}
				.shop_img{
					width: 230rpx;
					height: 230rpx;
					border-radius: 12px;
					margin-right: 26rpx;
					flex-shrink: 0;
					box-shadow: 3px 2px 7px 2px rgba(100, 100, 100, 0.5);
				}
				.shop_info{
					flex: 1;
					overflow: hidden;
					.info_top{
						display: flex;
						justify-content: space-between;
						align-items: center;
						color: #979797;
						.info_distance{
							display: flex;
							align-items: center;
							font-size: 26rpx;
							.info_topIcon{
								width: 20rpx;
								height: 24rpx;
								margin-right: 10rpx;
							}
						}
						.info_topLabel{
							font-size: 22rpx;
						}
					}
					.info_content{
						font-size: 24rpx;
						overflow: hidden;
						.info_title{
							font-size: 32rpx;
							font-weight: 600;
							color: #3D3D3D;
							margin-top: 18rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.titleText{
								flex: 1;
								margin-right: 20rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
						.info_item{
							color: #081831;
							margin-top: 8rpx;
							font-weight: 600;
							display: flex;
							align-items: center;
							.score{
								font-weight: bold;
								color: #FFE8CE;
								border-radius: 0 8px 0 8px;
								background: #081831;
								padding: 10rpx 8rpx;
							}
							.sold{
								width: 35%;
								white-space: nowrap;
								color: #C3A326;
								margin: 0 26rpx 0 20rpx;
							}
							.capita{
								color: #979797;
								width: 35%;
								white-space: nowrap;
							}
							.goods_left{
								width: 75%;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								.coupon_icon{
									width: 32rpx;
									height: 20rpx;
									margin-right: 10rpx;
								}
							}
							.goods_price{
								color: #FF0000;
								white-space: nowrap;
								overflow: hidden;
							}
						}
						.goods{
							display: flex;
							justify-content: space-between;
						}
						.collect{
							width: 36rpx;
							height: 36rpx;
							flex-shrink: 0;
						}
					}
				}
			}
		}
</style>
