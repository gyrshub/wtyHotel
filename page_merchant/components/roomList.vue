<template>
	<view class="roomList">
		<view class="roomItem" v-for="(item,index) in detailList" :key="index">
			<view class="title" :style="{backgroundColor: item.bgcolor}">
				{{item.title}}
			</view>
			<view class="content">
				<view class="content_item" v-for="(goods,number) in item.content" :key="number">
					{{goods.name}}
					<view class="label" v-if="goods.label">
						( <span style="color: #2972DE;">{{goods.label}}</span> )
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"roomList",
		props:{
			detailList:{
				type:Array,
				default:[{
					title:"标题",// 标题
					bgcolor:"#FFF8F1",// 标题背景颜色
					content:[{
						name:'瓶装水',// 显示左边内容
						label:'免费',// lLabel 显示左边蓝色字体 
					},
					{
						name:'咖啡壶',
					},
					{
						name:'用餐区',
					}]
				}]
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less" scoped>
.roomList{
	font-size: 26rpx;
	color: #707070;
	padding: 36rpx 32rpx;
	background-color: white;
	font-family: PingFangSC-Regular, PingFang SC;
	.roomItem{
		border-bottom: 2rpx solid #F2F2F2;
		display: flex;
		padding: 28rpx 0;
		&:last-child{
			border-bottom: 0;
		}
		.title{
			width: 100rpx;
			height: 100rpx;
			border-radius: 10rpx;
			color: #121212;
			font-size: 28rpx;
			margin-right: 32rpx;
			text-align: center;
			padding: 12rpx 22rpx;
			box-sizing: border-box;
			font-weight: bold;
		}
		.content{
			flex: 1;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.content_item{
				width: 48%;
				margin-bottom: 12rpx;
				display: flex;
			}
		}
	}
}
</style>