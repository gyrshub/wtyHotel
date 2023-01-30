<template>
	<view class="shop_item" @click="toPath(item)">
		<view class="shop_itemBg" :style="{backgroundColor:backGround}"></view>
		<image @click="toPath(item)" class="shop_img" :src="item.picture"></image>
		<view class="shop_info">
			<view class="info_top" v-if="item.itemType == 1 || item.itemType == 2">
				<view class="info_distance oneHide">
					<image class="info_topIcon" src="@/static/locate1.png" mode=""></image>
					<view class="oneHide">
						{{item.distance}}
					</view>
				</view>
				<view class="info_topLabel oneHide">
					{{item.label}}
				</view>
			</view>
			<view class="info_top" v-if="item.itemType == 0">
				<view class="orderNo">
					订单状态:{{item.orderStatusText}}
				</view>
			</view>
			
			<!-- 订单样式 -->
			<view class="info_content" v-if="item.itemType == 0">
				<view class="info_title">
					<image class="info_icon" v-if="item.merchantType == 4" :src="imageList[3]"></image>
					<image class="info_icon" v-if="item.merchantType < 4"  :src="imageList[item.merchantType]"></image>
					<view class="titleText">
						{{item.goodsName}}
					</view>
				</view>
				<view class="info_item" v-if="item.merchantType < 4">
					<view class="info_merchantName">
						{{item.merchantName}}
					</view>
				</view>
				<view class="info_item" v-if="item.merchantType == 4">
					<view class="info_cost">
						{{item.costs}}
					</view>
				</view>
				<view class="info_item" style="justify-content: space-between;">
					<view class="time">
						{{item.createTime}}
					</view>
					<view class="info_price" v-if="item.merchantType < 4">
						{{item.costs}}
					</view>
				</view>
			</view>
			<!-- 首页样式 -->
			<view class="info_content" v-if="item.itemType == 1">
				<view class="info_title">
					<view class="titleText">
						{{item.merchantName}}
					</view>
				</view>
				<view class="info_item" style="justify-content: space-between;">
					<view class="sold">
						已售:{{item.sold}}
					</view>
					<view class="score">
						{{item.score}}
					</view>
				</view>
				<view class="info_item" style="justify-content: space-between;">
					<view class="member">
						会员专享
					</view>
				</view>
			</view>
			
			<!-- 活动广场样式 -->
			<view class="info_content" v-if="item.itemType == 2">
				<view class="info_title">
					<!-- <image class="info_icon" :src="imageList[item.merchantType]"></image> -->
					<view class="titleText">
						{{item.goodsName}}
					</view>
				</view>
				<view class="info_cow">
					<view class="cow_item" style="justify-content: space-between;width: 70%;">
						<view class="cow_left">
							<view class="sold">
								已售:{{item.sold}}
							</view>
						</view>
						<view class="cow_merchantName">
							{{item.merchantName}}
						</view>
					</view>
					<view class="cow_item" style="align-items: center;width: 30%;">
						<view class="info_price">
							{{item.costs}}
						</view>
						<view class="underline_price">
							{{item.underline_price}}
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
			backGround:{
				type:String,
				default:'#FFFFFF'
			},
			item:{
				type:Object,
				default:{
					merchantType:0, // 商家类型 0酒店 1美食 2娱乐 3积分
					merchantName:'肥姐美食(朝阳广场店)',
					goodsName:'【双人餐】狗肉火锅套餐',
					costs:'￥89',
					createTime:'2022.11.11 20:00:00',
					orderStatusText:'待支付',
					picture:'/static/logo.png',
					itemType:0, // 组件类型 0订单设计样式 1首页样式 2活动广场样式
					capita:'106',
					underline_price:'86'
				}
			}
		},
		data() {
			return {
				imageList:[
					'/static/hotel.png',
					'/static/food.png',
					'/static/recreation.png',
					'/static/coin.png'
				]
			};
		},
		methods:{
			toPath(item){
				this.$emit('toPath',item)
			}
		}
	}
</script>

<style lang="less" scoped>
	.shop_item {
		position: relative;
		display: flex;
		margin-top: 30rpx;
		padding: 10rpx 20rpx 24rpx 20rpx;
		box-sizing: border-box;
		overflow-x: hidden;
		z-index: 10;
		.shop_itemBg {
			width: 100%;
			height: 82%;
			// background: #FFFFFF;
			border-radius: 20rpx;
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: -1;
		}

		.shop_img {
			width: 230rpx;
			height: 230rpx;
			border-radius: 12px;
			margin-right: 26rpx;
			flex-shrink: 0;
			box-shadow: 3px 2px 7px 2px rgba(100, 100, 100, 0.5);
		}

		.shop_info {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			height: 230rpx;
			.info_top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #979797;
				
				.orderNo{
					font-size: 24rpx;
					transform: scale(0.9);
					transform-origin: left center;
				}
				.info_distance {
					display: flex;
					align-items: center;
					font-size: 26rpx;
					width: 48%;
					.info_topIcon {
						width: 20rpx;
						height: 24rpx;
						margin-right: 10rpx;
						flex-shrink: 0;
					}
				}

				.info_topLabel {
					width: 50%;
					font-size: 22rpx;
				}
			}

			.info_content {
				flex: 1;
				font-size: 24rpx;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.info_title {
					font-size: 32rpx;
					font-weight: 600;
					color: #3D3D3D;
					margin-top: 18rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.info_icon{
						width: 28rpx;
						height: 30rpx;
						margin-right: 14rpx;
					}

					.titleText {
						flex: 1;
						margin-right: 20rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				.info_item {
					color: #081831;
					margin-top: 8rpx;
					display: flex;
					align-items: center;
					.info_merchantName{
						color: #3D3D3D;
						font-size: 24rpx;
						overflow: hidden;
						font-weight: 600;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.info_cost{
						color: #FF0000;
						font-size: 40rpx;
						font-weight: bold;
					}
					.time{
						color: #979797;
						transform: scale(0.8);
						transform-origin: left center;
					}
					
					
					.score {
						font-weight: bold;
						color: #FFE8CE;
						border-radius: 0 8px 0 8px;
						background: #081831;
						padding: 10rpx 8rpx;
					}

					.member{
						font-family: MiSans;
						border-radius: 12px;
						padding: 2rpx 4rpx;
						color: #081831;
						border: 1px solid #081831;
					}
				}
				.info_cow{
					flex: 1;
					display: flex;
					justify-content: space-between;
					margin-top: 40rpx;
					.cow_item{
						display: flex;
						flex-direction: column;
						.cow_left{
							display: flex;
							justify-content: space-between;
						}
						.cow_merchantName{
							color: #3D3D3D;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
					}
				}
			}
		}
	}
	.underline_price{
		text-decoration: line-through;
		color: #979797;
		font-size: 24rpx;
	}
	.info_price {
		font-size: 40rpx;
		font-weight: 600;
		color: #FF0000;
		white-space: nowrap;
		overflow: hidden;
	}
	
	.sold {
		color: #C3A326;
	}
	
	.capita {
		color: #979797;
	}
</style>
