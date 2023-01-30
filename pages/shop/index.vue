<template>
	<view class="order">
		<view class="navigation">
			<view class="stabar" :style="{ height: statusBarHeight + 10 + 'px' }"></view>
			<view class="topTitle">积分商城</view>
			<scroll-view class="type" scroll-x="true">
				<view class="typeList">
					<view :class="['type_item',{choose:choosed == item.value}]" v-for="(item,index) in typeList" :key="index"
						@click="changeType(item.value)">
						{{item.name}}
					</view>
					<view style="width: 20rpx;"></view>
				</view>
			</scroll-view>
			<view class="goods_list">
				<view class="shop_item" v-for="(item,index) in goodsList" :key="index" @click="toPath(item)">
					<view class="shop_itemBg"></view>
					<image class="shop_img" :src="item.picture"></image>
					<view class="shop_info">
						<view class="info_content">
							<view class="name">
								{{item.goodsName}}
							</view>
							<view class="stock" style="justify-content: space-between;">
								库存：{{item.stock}}
							</view>
							<view class="cost">
								{{item.costs}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 160rpx;"></view>
		<TarBar :current="3"></TarBar>
	</view>
</template>

<script>
	import TarBar from '../../components/tarbar/tarbar.vue'
	export default {
		data() {
			return {
				statusBarHeight: 0,
				keyword: '',
				typeList: [{
					value:0,
					name:'权益类'
				},{
					value:1,
					name:'生活日化类'
				},{
					value:2,
					name:'家用电器类'
				},{
					value:3,
					name:'数码科技类'
				},{
					value:4,
					name:'其它类'
				}],
				goodsList: [
					// {
					// 	goodsType: 0, // 0 纯积分 1 纯钱 2积分+钱
					// 	goodsName: '姚子泉清碧油画一张',
					// 	stock: 10,
					// 	costs: '4000积分',
					// 	picture: '/static/logo.png',
					// }
				],
				choosed:0,
				current:1,
				total:10,
				overContent:true,// 加载节点
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		onShow() {
			this.goodsList = []
			this.getCategory()
		},
		components: {
			TarBar
		},
		methods: {
			async getCategory(){
				let res = await this.$get('/dev/dict/subordinate/list',{
					dictValue:'INTEGRAL_GOODS_CATEGORY'
				})
				// console.log('积分商品分类',res)
				if(res.code == 200){
					let array = []
					this.choosed = res.data[0].id
					for(let i=0;i<res.data.length;i++){
						let obj = {
							value:res.data[i].id,
							name:res.data[i].dictLabel
						}
						array.push(obj)
					}
					this.typeList = array
					this.getIntegralList()
				}
			},
			async getIntegralList(){
				let res = await this.$get('/integral/goods/page',{
					current:this.current,
					size:10,
					categoryId:this.choosed
				})
				// console.log('积分商品',res)
				if(res.code == 200){
					this.overContent = true
					this.total = res.data.total
					res.data.records.map(d=>{
						d.goodsType = 0
						d.costs = d.goodsIntegral + '积分'
						d.picture = d.goodsPicture
					})
					this.goodsList = this.goodsList.concat(res.data.records)
				}else{
					this.current--;
					this.overContent = true
				}
			},
			changeType(index) {
				if(this.choosed == index) return
				this.choosed = index
				this.current = 1
				this.overContent = true
				this.goodsList = []
				this.getIntegralList()
			},
			toPath(item){
				if(item.stock > 0){
					uni.navigateTo({
						url:`/pages/shop/detail?id=${item.id}`
					})
				}else{
					uni.showToast({
						title:'该商品库存不足',
						icon:'none'
					})
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
	.order {
		.navigation {
			width: 100%;

			.stabar {
				background-color: white;
			}

			.topTitle {
				font-weight: bold;
				text-align: center;
				padding-bottom: 20rpx;
				background-color: white;
			}

			.type {
				// overflow: auto;
				background-color: #FFFFFF;
				border-bottom: 1px solid #e8e8e8;
				padding: 10rpx 24rpx;
				box-sizing: border-box;

				.typeList {
					display: flex;

					.type_item {
						color: #979797;
						font-size: 30rpx;
						padding: 10rpx 20rpx;
						border-radius: 20px;
						white-space: nowrap;
						margin-right: 20rpx;
						background-color: #e5e5e5;
					}

					.choose {
						color: #FFFFFF;
						background-color: #3173FF;
						font-weight: bold;
					}
				}
			}

			.goods_list {
				padding: 0 28rpx;
				box-sizing: border-box;

				.shop_item {
					position: relative;
					display: flex;
					margin-top: 30rpx;
					padding: 10rpx 20rpx 24rpx 20rpx;
					box-sizing: border-box;
					overflow-x: hidden;

					.shop_itemBg {
						width: 100%;
						height: 82%;
						background: #FFFFFF;
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

						.info_content {
							flex: 1;
							font-size: 24rpx;
							overflow: hidden;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							margin-top: 12%;

							.name {
								font-size: 32rpx;
								font-weight: bold;
								color: #081831;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

							.stock {
								font-size: 24rpx;
								color: #979797;
							}

							.cost {
								font-size: 28rpx;
								color: #FF0000;
								font-weight: bold;
							}
						}
					}
				}
			}
		}
	}
</style>
