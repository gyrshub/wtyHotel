<template>
	<view class="search" @click="hideShow">
		<view class="navigation">
			<view class="stabar" :style="{ height: statusBarHeight + 10 + 'px' }"></view>
			<view class="topTitle">{{title}}</view>
			<tool-tar :filtrate="filtrate" :optionList="optionList" :keyword="queryForm.searchKey" @searchKey="searchMerchant" @changeType="changeType"></tool-tar>
			<shop-list :orderList="orderList" @changeCollect="changeCollect"></shop-list>
		</view>
	</view>
</template>

<script>
	import ToolTar from '../components/toolbar/toolbar.vue'
	import ShopList from '../components/shopList_one/shopList_one.vue'
	export default {
		data() {
			return {
				title:'',
				statusBarHeight:0,
				filtrate: ['智能排序', '位置距离', '商圈归属', '价格高低'],
				optionList:[
					[{name:'全部',value:''},{name:'直线距离近→远',value:1},{name:'好评优先',value:2},{name:'低价优先',value:3},{name:'高价优先',value:4}],
					[{name:'全部',value:''},{name:'500米内',value:500},{name:'1公里内',value:1000},{name:'2公里内',value:2000},{name:'4公里内',value:4000},{name:'8公里内',value:8000},{name:'10公里内',value:10000}],
					[],
					[{name:'全部',value:['', '']},{name:'￥0-150',value:[0, 150]},{name:'￥150-300',value:[150, 300]},{name:'￥300-450',value:[300, 450]},{name:'￥450-600',value:[450, 600]},{name:'￥600-1000',value:[600, 1000]},{name:'￥1000以上',value:[1000, 1100]}]
				],
				orderList:[],
				collectFlag:true,// 收藏节点
				queryForm:{
					current:1,
					size:10,
					maxPrice:'',
					minPrice:'',
					searchKey:'',
					businessDistrictId:'',
					latitude:'23.009475',// 纬度
					longitude:'113.122532',// 经度
					locationDistance:'',
					merchantType:0,
					sort:''
				},
				startTime:'',
				endTime:'',
				total:10,
				overContent:true,// 加载节点
				userId:'',
			};
		},
		onLoad(option) {
			let location = uni.getStorageSync('location')
			if(location){
				location = JSON.parse(location)
				this.queryForm.longitude = location.longitude
				this.queryForm.latitude = location.latitude
			}
			if(option.keyword){
				this.queryForm.searchKey = option.keyword
			}
			if(option.low || option.high){
				this.queryForm.maxPrice = option.high * 100
				this.queryForm.minPrice = option.low * 100
			}
			// console.log('传值',option);
			this.startTime = option.startTime
			this.endTime = option.endTime
			this.queryForm.merchantType = option.status
			switch(option.status){
				case '0':
				this.title = '酒店列表';
				break;
				case '1':
				this.title = '美食列表';
				break;
				case '2':
				this.title = '娱乐列表';
				break;
				case '3':
				this.title = '综合列表';
				break;
			}
			this.getUserInfo()
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
			this.orderList = []
			this.getListBusinessDistrict()
		},
		components:{
			ToolTar,ShopList
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.queryForm.current * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.queryForm.current++;
				this.searchMerchantList();
			}
		},
		methods:{
			async searchMerchantList(){
				let res = await this.$get('/merchant/search/page',this.queryForm)
				if(res.code == 200){
					this.overContent = true
					// console.log('商家列表',res)
					this.total = res.data.total
					res.data.records.map(d=>{
						d.score = d.score? (d.score).toFixed(1) : '5.0'
						d.picture = d.merchantPicture
						d.label = d.merchantLabelName
						if(d.locationDistance >= 1000){
							d.distance = d.locationDistance / 1000 + 'km'
						}else{
							d.distance = d.locationDistance + 'm'
						}
						d.url = `/page_merchant/merchant/merchantDetail?id=${d.id}&longitude=${this.queryForm.longitude}&latitude=${this.queryForm.latitude}&startTime=${this.startTime}&endTime=${this.endTime}`
						if(d.merchantGoodsVOList){
							d.merchantGoodsVOList.map(m=>{
								m.price = m.goodsPrice / 100
							})
							d.goodsList = d.merchantGoodsVOList
						}else{
							d.goodsList = []
						}
					})
					this.orderList = this.orderList.concat(res.data.records)
					
				}else{
					this.queryForm.current--;
					this.overContent = true
				}
			},
			async changeCollect(boolean,index){
				if(!this.collectFlag)return
				this.collectFlag = false
				let res = await this.$post('/user/collection/add',{
					userId:this.userId,
					merchantId:this.orderList[index].id,
					isCollection:!boolean
				})
				if(res.code == 200){
					this.collectFlag = true
					uni.showToast({
						title:boolean?'取消收藏成功':'收藏成功',
						icon:'none'
					})
					this.orderList[index].collection = !boolean
				}else{
					this.collectFlag = true
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
				}
			},
			// 获取商圈列表
			async getListBusinessDistrict() {
				let res = await this.$get('/dev/dict/subordinate/list',{
					dictValue:'BUSINESS_DISTRICT'
				})
				if (res.code === 200) {
					if(res.data){
						let array = [{
							value:'',
							name:'全部'
						}]
						res.data.map(d=>{
							d.value = d.id
							d.name = d.dictLabel
						})
						this.optionList[2] = array.concat(res.data)
					}
				}
			},
			searchMerchant(value){
				this.queryForm.searchKey = value
				this.orderList = []
				this.queryForm.current = 1
				this.total = 10
				this.overContent = true
				this.searchMerchantList();
			},
			changeType(index,number){
				switch(index){
					case 0:
					this.queryForm.sort = this.optionList[0][number].value
					break;
					case 1:
					this.queryForm.locationDistance = this.optionList[1][number].value
					break;
					case 2:
					this.queryForm.businessDistrictId = number == 0? "" : this.optionList[2][number].id
					break;
					case 3:
					this.queryForm.minPrice = this.optionList[3][number].value[0] * 100
					this.queryForm.maxPrice = this.optionList[3][number].value[1] * 100
					break;
				}
				this.filtrate[index] = this.optionList[index][number].name
				this.$set(this.filtrate, index, this.optionList[index][number].name)
				this.orderList = []
				this.queryForm.current = 1
				this.total = 10
				this.overContent = true
				this.searchMerchantList()
				// console.log('筛选',this.queryForm)
			},
			// 获取用户信息
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				if(res.code == 200){
					this.userId = res.data.id
					this.queryForm.userId = res.data.id
					this.searchMerchantList()
				}
			},
			hideShow(){
				if(this.$children){
					for(let i=0;i<this.$children.length;i++){
						if(this.$children[i].name == 'toolbar'){
							this.$children[i].changeType(100)
							break
						}
					}
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
.search{
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
