<template>
	<!-- 底部导航栏 -->
	<view class="tarbar">
		<view class="tarbarItem" v-for="(item,index) in list" :key="index" @click="toPath(item.pagePath)">
			<image v-if="current == index" class="tarbarIcon" :src="item.selectedIconPath"></image>
			<image v-if="current != index" :class="['tarbarIcon',{smallIcon:index == 2 || index == 4}]" :src="item.iconPath"></image>
			<view :class="['name',{active:current == index}]">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"tarbar",
		props:{
			current:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				list: [{
						"iconPath": "/static/home.png",
						"pagePath": "/pages/index/index",
						"selectedIconPath": "/static/chooed.png",
						"text": "首页"
					},
					{
						"iconPath": "/static/collect1.png",
						"pagePath": "/pages/collection/index",
						"selectedIconPath": "/static/chooed.png",
						"text": "收藏"
					},
					{
						"iconPath": "/static/order.png",
						"pagePath": "/pages/order/index",
						"selectedIconPath": "/static/chooed.png",
						"text": "订单"
					},
					{
						"iconPath": "/static/shop.png",
						"pagePath": "/pages/shop/index",
						"selectedIconPath": "/static/chooed.png",
						"text": "积分商城"
					},
					{
						"iconPath": "/static/my.png",
						"pagePath": "/pages/my/index",
						"selectedIconPath": "/static/chooed.png",
						"text": "我的"
					}
				]
			};
		},
		methods:{
			toPath(url){
				let page = getCurrentPages()
				if('/'+page[page.length-1].route == url)return
				uni.switchTab({
					url:url
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.tarbar{
	width: 100%;
	height: 120rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: rgb(247, 247, 250);
	padding: 20rpx 0;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 50;
	.tarbarItem{
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		.tarbarIcon{
			width: 64rpx;
			height: 60rpx;
			margin-bottom: 4rpx;
		}
		.smallIcon{
			width: 52rpx;
		}
		.name{
			font-size: 28rpx;
			color: rgb(153, 153, 153);
		}
		.active{
			color: #FB8146;
		}
	}
}
</style>