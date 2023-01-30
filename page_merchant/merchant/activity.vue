<template>
	<view class="activity">
		<view class="navigation">
			<view class="stabar" :style="{ height: statusBarHeight + 10 + 'px' }"></view>
			<view class="topTitle">活动广场</view>
			<tool-tar :hideFiltrate="true"></tool-tar>
			<view class="goods_list">
				<goods-item v-for="(item,index) in orderList" :key="index" :item="item"/>
			</view>
		</view>
	</view>
</template>

<script>
	import ToolTar from '../components/toolbar/toolbar.vue'
	import GoodsItem from '../components/goodsItem/goodsItem.vue'
	export default {
		data() {
			return {
				type:1,// 0 限时 1 推荐
				statusBarHeight:0,
				keyword:'',
				filtrate: ['智能排序', '位置距离', '商圈归属', '价格高低'],
				optionList:[
					[{name:'直线距离近→远',value:0},{name:'好评优先',value:1},{name:'低价优先',value:2},{name:'高价优先',value:3}],
					[{name:'500米内',value:500},{name:'1公里内',value:1000},{name:'2公里内',value:2000},{name:'4公里内',value:4000},{name:'8公里内',value:8000},{name:'10公里内',value:10000}],
					[],
					[{name:'￥0-150',value:[0, 150]},{name:'￥150-300',value:[150, 300]},{name:'￥300-450',value:[300, 450]},{name:'￥450-600',value:[450, 600]},{name:'￥600-1000',value:[600, 1000]},{name:'￥1000以上',value:[1000, 1100]}]
				],
				orderList:[{
					distance:'225m',
					label:'本帮菜 朝阳广场',
					merchantType:1, // 商家类型 0酒店 1美食 2娱乐 3积分
					merchantName:'肥姐美食(朝阳广场店)',
					goodsName:'狗肉火锅套餐',
					costs:'￥89',
					score:'5.0',
					createTime:'2022.11.11 20:00:00',
					orderNo:'4599651215115815151',
					picture:'/static/logo.png',
					itemType:2, // 组件类型 0订单设计样式 1首页样式 2活动广场样式
					sold:122,
					capita:'106',
					underline_price:'100'
				},
				{
					distance:'225m',
					label:'本帮菜 朝阳广场',
					merchantType:1, // 商家类型 0酒店 1美食 2娱乐 3积分
					merchantName:'肥姐美食(朝阳广场店)',
					goodsName:'狗肉火锅套餐',
					costs:'￥89',
					score:'5.0',
					createTime:'2022.11.11 20:00:00',
					orderNo:'4599651215115815151',
					picture:'/static/logo.png',
					itemType:2, // 组件类型 0订单设计样式 1首页样式 2活动广场样式
					sold:122,
					capita:'106',
					underline_price:'100'
				},
				{
					distance:'225m',
					label:'本帮菜 朝阳广场',
					merchantType:1, // 商家类型 0酒店 1美食 2娱乐 3积分
					merchantName:'肥姐美食(朝阳广场店)',
					goodsName:'狗肉火锅套餐',
					costs:'￥89',
					score:'5.0',
					createTime:'2022.11.11 20:00:00',
					orderNo:'4599651215115815151',
					picture:'/static/logo.png',
					itemType:2, // 组件类型 0订单设计样式 1首页样式 2活动广场样式
					sold:122,
					capita:'106',
					underline_price:'100'
				}
				]
			};
		},
		onLoad(option) {
			this.type = option.type
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		components:{
			ToolTar,GoodsItem
		},
		methods:{
			
		}
	}
</script>
<style>
	page{
		background: #F6F6F6;
	}
</style>
<style lang="less" scoped>
.activity{
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
}
</style>
