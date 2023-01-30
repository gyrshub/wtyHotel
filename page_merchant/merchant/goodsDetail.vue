<template>
	<view class="goodsDetail">
		<view class="swiperContent">
			<swiper circular :autoplay="true" :interval="5000" style="height: 630rpx;">
				<swiper-item v-for="(item,index) in goodsDetail.goodsCarousel" :key="index">
					<image class="topImg" :src="item" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="goodsName">
				{{goodsDetail.goodsName}}
			</view>
			<view class="label">
				{{goodsDetail.goodsTitle}}
			</view>
			<view class="cost">
				<view class="cost_left">
					<view class="lightPrice"><span style="font-size: 40rpx;">￥</span>{{goodsDetail.goodsPrice}}</view>
					<view class="welfare">
						<view class="tag">优惠价</view>
						<view class="underline">￥{{goodsDetail.underlinedPrice}}</view>
					</view>
				</view>
				<button open-type="share" class="shareBtn">
					<image class="share_icon" src="/static/black-share.png"></image>
				</button>
			</view>
		</view>
		
		<view class="roomTool" v-if="type == 0">
			<view class="tool_item" v-for="(item,index) in toolList" :key="index">
				<image :class="['tool_img',{widthImg:index == 0 || index == 3 }]" :src="item.image"></image>
				<view>
					{{item.name}}
				</view>
			</view>
		</view>
		
		<!-- 详细列表 -->
		<view class="borderStyle" v-if="type == 0">
			<room-List :detailList="detailList"></room-List>
		</view>
		<view class="equip" v-if="type != 0">
			<view class="equip_title">
				套餐详情
			</view>
			<view v-if="type != 0" class="equip_content" v-html="goodsDetail.goodsDetails"></view>
		</view>
		
		<view style="height: 150rpx;"></view>
		<view class="boxStyle">
			<view v-if="goodsDetail.isStockInsufficient" class="box_btn" @click="toBuy">
				{{type == 0 ?'立即订':'立即购'}}
				<image class="btn_img" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610951604262858753.png"></image>
			</view>
			<view v-if="!goodsDetail.isStockInsufficient" class="box_btn">
				{{type == 0 ?'已满房':'已售罄'}}
				<image class="btn_img" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610951604262858753.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import RoomList from "../components/roomList.vue";
	export default {
		data() {
			return {
				id:'',
				type:0,// 0酒店 1非酒店类
				startTime:'',
				endTime:'',
				detailList:[],
				goodsDetail:{
					goodsTitle:'',
					merchantName:'',
					goodsName:'',
					label:'',
					underlinedPrice:'',
					goodsPrice:'',
					stock:0,
					goodsCarousel: []
				},
				toolList:[
					{
						image:'/static/bed.png',
						name:'单床'
					},
					{
						image:'/static/floor.png',
						name:'7-9层'
					},
					{
						image:'/static/area.png',
						name:'22㎡'
					},
					{
						image:'/static/wifi.png',
						name:'WIFI'
					},
					{
						image:'/static/stop.png',
						name:'停车场'
					},
					{
						image:'/static/window.png',
						name:'有窗'
					},
					{
						image:'/static/smoke.png',
						name:'禁止吸烟'
					}
				]
			};
		},
		components: {
			RoomList
		},
		onLoad(options) {
			this.type = options.type == 0 ? 0 : 1
			uni.setNavigationBarTitle({
				title:this.goodsDetail.merchantName
			})
			this.id = options.id
			this.startTime = options.startTime
			this.endTime = options.endTime
			this.getGoodDetail()
		},
		methods:{
			async getGoodDetail(){
				let res = await this.$get('/merchant/goods/detail',{
					id:this.id,
					startTime:this.startTime,
					endTime:this.endTime
				})
				// console.log('商品详情',res)
				uni.showLoading({
					title:'加载中'
				})
				if(res.code === 200){
					uni.hideLoading()
					this.goodsDetail = res.data
					this.goodsDetail.goodsPrice = this.goodsDetail.goodsPrice / 100
					this.goodsDetail.underlinedPrice = this.goodsDetail.underlinedPrice / 100
					this.goodsDetail.goodsCarousel = this.goodsDetail.goodsCarousel.split(',')
					if(this.type == 0){
						let showList1 = []
						let showList2 = []
						let roomFacilityNames = {
							title:'房间设施',
							bgcolor:'#FFF8F1'
						}
						let roomGoodsNames = {
							title:'房间物品',
							bgcolor:'#F3FFF1'
						}
						// 如果是酒店商品详情就转义
						this.goodsDetail.roomFacilityNames = JSON.parse(this.goodsDetail.roomFacilityNames)
						this.goodsDetail.roomGoodsNames = JSON.parse(this.goodsDetail.roomGoodsNames)
						// 房间设施
						for(let i =0;i<this.goodsDetail.roomFacilityNames.length;i++){
							if(this.goodsDetail.roomFacilityNames[i].checked){
								showList1.push(this.goodsDetail.roomFacilityNames[i])
							}
						}
						// 房间物品
						for(let i =0;i<this.goodsDetail.roomGoodsNames.length;i++){
							if(this.goodsDetail.roomGoodsNames[i].checked){
								showList2.push(this.goodsDetail.roomGoodsNames[i])
							}
						}
						roomFacilityNames.content = showList1
						roomGoodsNames.content = showList2
						if(showList1.length != 0){
							this.detailList = this.detailList.concat(roomFacilityNames)
						}
						if(showList2.length != 0){
							this.detailList = this.detailList.concat(roomGoodsNames)
						}
					}
					this.toolList[0].name = this.goodsDetail.bedType
					this.toolList[1].name = this.goodsDetail.floor
					this.toolList[2].name = this.goodsDetail.roomArea + '㎡'
					this.toolList[3].name = this.goodsDetail.isWifi? '有WIFI':'无WIFI'
					this.toolList[4].name = this.goodsDetail.isParking? '有停车场':'无停车场'
					this.toolList[5].name = this.goodsDetail.isWindows? '有窗':'无窗'
					this.toolList[6].name = this.goodsDetail.isSmoking? '允许吸烟':'禁止吸烟'
				}else{
					uni.hideLoading()
				}
			},
			toBuy(){
				if(this.type === 0){
					if(!this.goodsDetail.isStockInsufficient){
						uni.showToast({
							title:'房间已满房',
							icon:'none'
						})
					}else{
						uni.navigateTo({
							url:`/page_merchant/merchant/hotelOrder?id=${this.goodsDetail.id}&startTime=${this.startTime}&endTime=${this.endTime}&type=0`
						})
					}
				}else{
					if(!this.goodsDetail.isStockInsufficient){
						uni.showToast({
							title:'商品已无库存',
							icon:'none'
						})
					}else{
						uni.navigateTo({
							url:`/page_merchant/merchant/stealOrder?id=${this.goodsDetail.id}&type=0`
						})
					}
				}
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
.goodsDetail{
	padding: 0 30rpx;
	box-sizing: border-box;
	.swiperContent{
		background-color: #FFF;
		border-radius: 20rpx;
		box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.302);
		margin-top: 20rpx;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		.topImg {
			width: 100%;
			height: 100%;
			display: block;
		}
		
		.goodsName{
			font-size: 40rpx;
			color: #3D3D3D;
			font-weight: bold;
			margin-top: 20rpx;
		}
		.label{
			font-size: 24rpx;
			color: #979797;
			margin: 10rpx 0 20rpx 0;
		}
		.cost{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.cost_left{
				display: flex;
				align-items: center;
				.lightPrice{
					color: #FF0000;
					font-size: 52rpx;
					margin-right: 20rpx;
				}
				.welfare{
					    display: flex;
					    flex-direction: column;
					    align-items: center;
					.tag{
						font-size: 20rpx;
						color: #3D3D3D;
						background-color: #F4C52E;
					}
					.underline{
						font-size: 32rpx;
						color: #BCBFC4;
						text-decoration: line-through;
					}
				}
			}
			.shareBtn{
				line-height: normal;
				margin: 0;
				padding: 0;
				background-color: transparent;
				&::after{
					border: transparent;
				}
			}
			.share_icon{
				width: 48rpx;
				height: 48rpx;
			}
		}
	}
	
	.roomTool{
		display: flex;
		border-radius: 20rpx;
		padding: 20rpx 40rpx;
		box-sizing: border-box;
		background-color: #ECECEC;
		margin-top: 40rpx;
		.tool_item{
			display: flex;
			flex-direction: column;
			align-items: center;
			color: #3D3D3D;
			font-size: 20rpx;
			flex: 1;
			.tool_img{
				width: 44rpx;
				height: 44rpx;
				margin-bottom: 8rpx;
			}
			.widthImg{
				width: 52rpx;
			}
		}
	}
	.steal{
		margin: 20rpx 0;
		font-size: 32rpx;
		color: #3D3D3D;
		.steal_title{
			margin-bottom: 12rpx;
		}
		.steal_content{
			min-height: 100rpx;
			border-radius: 20rpx;
			padding: 20rpx 40rpx;
			box-sizing: border-box;
			background-color: #ECECEC;
		}
	}
	
	.borderStyle{
		margin: 30rpx 0;
	}
	
	.equip{
		margin: 30rpx 0;
		.equip_title{
			font-size: 32rpx;
			color: #3D3D3D;
		}
		.equip_content{
			margin-top: 20rpx;
			min-height: 200rpx;
		}
	}
	
	.boxStyle{
		width: 100%;
		position: fixed;
		background-color: #F6F6F6;
		padding: 20rpx 0 40rpx 0;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		.box_btn{
			width: 90%;
			color: #FAE4A7;
			font-size: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10rpx 0;
			box-sizing: border-box;
			background-color: #0A142A;
			border-radius: 20rpx;
			.btn_img{
				width: 54rpx;
				height: 54rpx;
				margin-left: 4rpx;
			}
		}
	}
}
</style>
