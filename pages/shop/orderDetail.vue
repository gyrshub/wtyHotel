<template>
	<view class="payOrder">
		<view class="goods_content">
			<view class="content_top">
				<image class="img" :src="goodsObj.goodsPicture"></image>
				<view class="goods_info">
					<view class="goods_name">{{goodsObj.goodsName}}</view>
					<view class="goods_money">
						<view>
							{{goodsObj.goodsType == 0?goodsObj.goodsIntegral+'积分':goodsObj.goodsType == 1? goodsObj.goodsPrice +'元':goodsObj.goodsIntegral+'积分+'+goodsObj.goodsPrice +'元'}}
						</view>
						<view class="step">
							<view class="value">
								{{goodsObj.number}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="content_btm">
				<span class="price">{{costIntegral}}积分</span>小计
			</view>
		</view>
		<view class="payDetail">
			<view class="title">
				订单明细:
			</view>
			<view class="payDetail_item">
				<view class="item_left">
					<image class="integral_icon" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610951058676183042.pngg"></image>
					订单状态
				</view>
				<view class="">{{goodsObj.orderState == 1?'支付超时':goodsObj.orderState == 10?'待发货':goodsObj.orderState == 20?'已发货':goodsObj.orderState == 30?'已完成':'待支付'}}</view>
			</view>
			<view class="payDetail_item" v-if="goodsObj.goodsType != 0">
				<view class="item_left">
					<image class="integral_icon" src="/static/money.png" mode=""></image>
					会员卡余额
				</view>
				<view class="">{{userInfo.money}}元</view>
			</view>
			<view class="line"></view>
			<view class="payDetail_item" style="flex-direction: row-reverse;" v-if="goodsObj.goodsType != 1">
				<view class="">
					{{costIntegral == 0?'0': '-' + costIntegral}}积分
				</view>
				<view class="payDetail_text">
					支付积分
				</view>
			</view>
			<view class="payDetail_item" style="flex-direction: row-reverse;" v-if="goodsObj.goodsType != 0">
				<view>
					{{costMoney == 0?'0': '-' + costMoney}}元
				</view>
				<view class="payDetail_text">
					支付余额(现金)
				</view>
			</view>
		</view>

		<view class="sendWay">
			<view class="chooseType">
				<view style="font-weight: bold;margin-right: 40rpx;">
					获取方式:
				</view>
				<view class="radionList">
					<view class="radion_item" v-for="(item,index) in radioList" :key="index">
						<view class="text">
							{{item.name}}
						</view>
						<view class="cricle">
							<view class="cricle_content" v-if="goodsObj.exchangeType == item.value"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="sendWay_item" v-if="goodsObj.timeRange">
				<view style="width: 20%;flex-shrink: 0;">
					地址提醒
				</view>
				<view class="sendWay_text">
					{{goodsObj.timeRange}}
				</view>
			</view>
			<view class="sendWay_item" v-if="goodsObj.trackingNumber">
				<view style="width: 20%;flex-shrink: 0;">
					物流编号
				</view>
				<view class="sendWay_text">
					{{goodsObj.trackingNumber}}
				</view>
			</view>
			
			<view class="sendWay_item">
				<view style="width: 20%;flex-shrink: 0;">
					地址：
				</view>
				<view class="sendWay_text">
					{{goodsObj.contactAddress}}
				</view>
			</view>
			<view class="sendWay_item">
				<view style="width: 20%;flex-shrink: 0;">
					联系人：
				</view>
				<view class="sendWay_text">
					{{goodsObj.contactName}}
				</view>
			</view>
			<view class="sendWay_item">
				<view style="width: 20%;flex-shrink: 0;">
					联系方式：
				</view>
				<view class="sendWay_text">
					{{goodsObj.contactPhone}}
				</view>
			</view>
		</view>
		<view style="height: 130rpx;"></view>
		<view class="bottom_style" v-if="goodsObj.exchangeType == 0 && goodsObj.orderState == 20">
			<view class="bottom_btn" @click="sumbitOrder">确定收货</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId:'',
				id:'',
				costIntegral: 0,
				costMoney: 0,
				columns:[],
				radioList:[
					{
					name:'自提',
					value:1
				},{
					name:'邮寄',
					value:0
				}
				],
				userInfo: {
					integral: 0,
					money: 0
				},
				goodsObj: {
					goodsPicture: '',
					goodsName: '',
					number: 1,
					orderState:0,// 订单状态（0未支付 1支付超时 10待发货 20已发货 30已完成）
					exchangeType:0,// 0邮寄 1自提
					goodsType: 0, // 0 纯积分 1 纯钱 2积分+钱
					goodsIntegral: 0,
					goodsPrice: 0,
					timeRange:'',
					trackingNumber:'',
					contactAddress:'',
					contactName:'',
					contactPhone:'',
				},
			};
		},
		created() {
			// this.getUserInfo()
		},
		onLoad(options) {
			this.id = options.id
			this.getDetail()
		},
		methods: {
			// 获取积分订单详情
			async getDetail(){
				let res = await this.$get('/integral/order/detail',{
					id:this.id
				})
				// console.log('订单详情',res)
				if(res.code == 200){
					this.goodsObj = res.data
					this.goodsObj.goodsType = 0 
					this.goodsObj.number = this.goodsObj.exchangeNum
					this.costIntegral = this.goodsObj.realTotalIntegral
					this.costMoney = this.goodsObj.realTotalMoney / 100
					// exchangeType
					this.goodsObj.goodsPrice = this.goodsObj.goodsMoney / 100
				}
			},
			// 确定收货
			async sumbitOrder(){
				let that = this
				uni.showModal({
					title:'温馨提示',
					content:'是否确定收货?',
					success:async(res)=> {
						if(res.confirm){
							let res = await that.$post('/integral/order/confirm',{
								orderId:that.goodsObj.id,
								userId:that.userId
							})
							if(res.code == 200){
								uni.showToast({
									title:'确认成功',
									icon:'none',
									mask:true,
									success() {
										setTimeout(()=>{
											uni.switchTab({
												url:'/pages/my/index'
											})
										},1000)
									}
								})
							}
						}
					}
				})
			},
			goback(){
				uni.switchTab({
					url:'/pages/shop/index'
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F6F6F6;
		;
	}
</style>
<style lang="less" scoped>
	.payOrder {
		padding: 0 16rpx;

		.goods_content {
			color: #3D3D3D;
			padding: 16rpx 26rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			border-radius: 20rpx;

			.content_top {
				display: flex;

				.img {
					width: 120rpx;
					height: 120rpx;
					border-radius: 20rpx;
					flex-shrink: 0;
					margin-right: 24rpx;
				}

				.goods_info {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					flex: 1;

					.goods_name {
						font-size: 30rpx;
						font-weight: bold;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.goods_money {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 24rpx;
						color: #FF0000;
						font-weight: bold;

						.step {
							display: flex;
							align-items: center;
							font-size: 40rpx;
							color: #3D3D3D;

							.value {
								margin: 0 20rpx;
							}

							.stepIcon {
								width: 36rpx;
								height: 36rpx;
							}
						}
					}
				}
			}

			.content_btm {
				display: flex;
				flex-direction: row-reverse;
				font-size: 28rpx;
				align-items: center;
				margin-top: 20rpx;

				.price {
					font-size: 36rpx;
					color: #FF0000;
					font-weight: bold;
					margin-left: 20rpx;
				}
			}
		}

		.payDetail {
			color: #3D3D3D;
			border-radius: 20rpx;
			background-color: #FFFFFF;
			padding: 10rpx 26rpx;
			box-sizing: border-box;
			margin-top: 20rpx;
			font-size: 32rpx;

			.title {
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.line {}

			.payDetail_item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.item_left {
					display: flex;
					align-items: center;

					.integral_icon {
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
					}
				}
				.result{
					font-weight: bold;
				}
			}

			.line {
				width: 100%;
				height: 1px;
				background-color: #D8D8D8;
				margin: 20rpx 0;
			}
		}
		
		.sendWay{
			background-color: #FFFFFF;
			padding: 10rpx 26rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			margin-top: 20rpx;
			font-size: 28rpx;
			.chooseType{
				display: flex;
				align-items: center;
				padding-bottom: 18rpx;
				border-bottom: 1px solid #D8D8D8;
				.radion{
					width: 32rpx;
					height: 32rpx;
				}
				.radionList{
					display: flex;
					align-items: center;
					.radion_item{
						display: flex;
						align-items: center;
						margin-right: 40rpx;
						.text{
							margin-right: 20rpx;
						}
						.cricle{
							width: 34rpx;
							height: 34rpx;
							border-radius: 50%;
							border: 1px solid #FFBD27;
							position: relative;
							.cricle_content{
								width: 20rpx;
								height: 20rpx;
								border-radius: 50%;
								background-color: #FFBD27;
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-54%, -54%);
							}
						}
					}
				}
			}
			.sendWay_item{
				margin-top: 18rpx;
				display: flex;
				align-items: center;
				.sendWay_text{
					margin-left: 20rpx;
				}
			}
			
		}
		
		.bottom_style {
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			background: #FFFFFF;
			padding: 26rpx 30rpx;
			box-sizing: border-box;

			.bottom_btn {
				text-align: center;
				font-size: 40rpx;
				color: #FAE4A7;
				background-color: #0A142A;
				border-radius: 20rpx;
				padding: 12rpx 60rpx;
				box-sizing: border-box;

				&:active {
					background-color: #050b18;
					color: #c7b685;
				}
			}
		}
	}
	
</style>
