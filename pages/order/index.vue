<template>
	<view class="order">
		<view class="navigation">
			<view class="stabar" :style="{ height: statusBarHeight + 10 + 'px' }"></view>
			<view class="topTitle">订单</view>
			<tool-tar :keyword="keyword" @searchKey="searchMerchant" :hideBack="true" :hideFiltrate="true" :showText="showText"></tool-tar>
			<view class="typeList">
				<view :class="['type_item',{choose:choosed == item.value}]" v-for="(item,index) in typeList" :key="index"
					@click="changeType(item.value)">
					{{item.name}}
				</view>
			</view>
			<view class="goods_list">
				<goods-item v-for="(item,index) in orderList" :key="index" :item="item" @toPath="toDetail"/>
			</view>
		</view>
		<view style="height: 160rpx;"></view>
		<TarBar :current="2"></TarBar>
	</view>
</template>

<script>
	import ToolTar from '../../components/toolbar/toolbar.vue'
	import GoodsItem from '../../components/goodsItem/goodsItem.vue'
	import TarBar from '../../components/tarbar/tarbar.vue'
	export default {
		data() {
			return {
				statusBarHeight:0,
				keyword:'',
				orderList:[
				// 	{
				// 	merchantType:0, // 商家类型 0酒店 1美食 2娱乐 3积分
				// 	merchantName:'肥姐美食(朝阳广场店)',
				// 	goodsName:'狗肉火锅套餐',
				// 	costs:'￥89',
				// 	createTime:'2022.11.11 20:00:00',
				// 	orderStatusText:'待支付',
				// 	picture:'/static/logo.png',
				// 	itemType:0, // 组件类型 0订单设计样式 1首页样式 2活动广场样式
				// }
				],
				showText:'商品名称',
				choosed:0,
				typeList: [{
					value:0,
					name:'普通订单'
				},{
					value:1,
					name:'积分订单'
				}],
				pageNo: 1,
				total: 10,
				overContent: true, // 节流
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		onShow() {
			this.orderList = []
			if(this.choosed == 0){
				this.getOrderList()
			}else{
				this.getIntegralOrder()
			}
		},
		components:{
			ToolTar,GoodsItem,TarBar
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.pageNo++;
				if(this.choosed == 0){
					this.getOrderList()
				}else{
					this.getIntegralOrder()
				}
			}
		},
		methods:{
			// 获取订单列表
			async getOrderList(){
				let res = await this.$get('/merchant/order/page',{
					current:this.pageNo,
					size:10,
					searchKey:this.keyword
				})
				uni.showLoading({
					title: '加载中'
				})
				// console.log('订单列表',res)
				if(res.code == 200){
					uni.hideLoading()
					this.overContent = true;
					this.total = res.data.total
					res.data.records.map(d=>{
						d.itemType = 0
						d.costs = '￥'+ d.realTotalMoney / 100
						d.createTime = d.createTime.replace(/-/g,'.')
						d.picture = d.goodsPicture
						d.orderStatusText = d.orderState == 11?'支付超时'
						: d.orderState == 10?'待支付'
						: d.orderState == 20?'待确认'
						: d.orderState == 21?'确认超时'
						: d.orderState == 30?'待核销'
						: d.orderState == 40?'已核销':'已取消'
						
					})
					
					this.orderList = this.orderList.concat(res.data.records)
				}else{
					uni.hideLoading()
					this.pageNo--;
					this.overContent = true;
				}
			},
			async getIntegralOrder(){
				let res = await this.$get('/integral/order/page',{
					current:this.pageNo,
					size:10,
					searchKey:this.keyword
				})
				uni.showLoading({
					title: '加载中'
				})
				// console.log('积分订单列表',res)
				if(res.code == 200){
					uni.hideLoading()
					this.overContent = true;
					this.total = res.data.total
					res.data.records.map(d=>{
						d.itemType = 0
						d.merchantType = 4
						d.picture = d.goodsPicture
						d.costs = d.goodsIntegral + '积分'
						d.createTime = d.createTime.replace(/-/g,'.')
						d.orderStatusText = d.orderState == 1?'支付超时'
						: d.orderState == 10?'待发货'
						: d.orderState == 20?'已发货'
						: d.orderState == 30?'已完成':'未支付'
						
					})
					
					this.orderList = this.orderList.concat(res.data.records)
				}else{
					uni.hideLoading()
					this.pageNo--;
					this.overContent = true;
				}
			},
			changeType(index) {
				if(this.choosed == index) return
				this.choosed = index
				this.pageNo = 1
				this.overContent = true
				this.orderList = []
				if(this.choosed == 0){
					this.showText = '商品名称'
					this.getOrderList()
				}else{
					this.showText = '积分商品名称'
					this.getIntegralOrder()
				}
			},
			searchMerchant(value){
				this.keyword = value
				this.orderList = []
				this.pageNo = 1
				this.total = 10
				this.overContent = true
				this.getOrderList();
			},
			toDetail(item){
				// console.log('数据',item)
				if(this.choosed == 0){
					uni.navigateTo({
						url:`/pages/order/orderDetail?id=${item.id}&startTime=${item.startTime}&endTime=${item.endTime}`
					})
				}else{
					uni.navigateTo({
						url:`/pages/shop/orderDetail?id=${item.id}`
					})
				}
			}
		}
	}
</script>
<style>
	page{
		background: #F6F6F6;
	}
</style>
<style lang="less" scoped>
.order{
	.navigation {
		width: 100%;
		.stabar{
			background-color: white;
		}
		.topTitle {
			font-weight: bold;
			text-align: center;
			padding-bottom: 20rpx;
			background-color: white;
		}
		.goods_list{
			padding: 0 28rpx;
			box-sizing: border-box;
		}
	}
	
	.typeList {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		.type_item {
			color: #979797;
			font-size: 30rpx;
			padding: 10rpx 20rpx;
			border-radius: 20px;
			white-space: nowrap;
			background-color: #e5e5e5;
			text-align: center;
			width: 40%;
		}
	
		.choose {
			color: #FFFFFF;
			background-color: #3173FF;
			font-weight: bold;
		}
	}
}
</style>
