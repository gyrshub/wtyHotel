<template>
	<view>
		<view class="toptool">
			<image v-if="hideBack == false" class="icon" src="../../static/white_back.png" @click="toBack"></image>
			<view class="search">
				<uni-easyinput class="input" prefixIcon="search" v-model="searchWord" :placeholder="showText"
				@confirm="searchCollect" @iconClick="searchCollect" @clear="searchCollect" :inputBorder="false">
					</uni-easyinput>
			</view>
		</view>
		<!-- 筛选器 -->
		<view class="filtrate" v-if="hideFiltrate == false">
			<view class="filtrate_item" v-for="(item,index) in filtrate" :key="index" @click.stop="changeType(index)">
				<view class="filtrate_text">
					{{item}}
				</view>
				<image :class="['icon',{active:Type === index}]" src="/static/arrows.png"></image>
				<view class="optionList" v-show="Type === index">
					<view class="optionItem" v-for="(option,number) in optionList[index]" :key="number" @click.stop="chooseType(index,number)">{{option.name || option}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			showText:{
				type:String,
				default:'商家名称'
			},
			keyword:{
				type:String,
				default:''
			},
			hideBack:{
				type: Boolean,
				default: false
			},
			hideFiltrate:{
				type: Boolean,
				default: false
			},
			filtrate:{
				type: Array,
				default: ['智能排序', '位置距离', '商圈归属', '价格高低']
			},
			optionList:{
				type: Array,
				default:[
					[{name:'直线距离近→远',value:1},{name:'好评优先',value:2},{name:'低价优先',value:3},{name:'高价优先',value:4}],
					[{name:'500米内',value:500},{name:'1公里内',value:1000},{name:'2公里内',value:2000},{name:'4公里内',value:4000},{name:'8公里内',value:8000},{name:'10公里内',value:10000}],
					[],
					[{name:'￥0-150',value:[0, 150]},{name:'￥150-300',value:[150, 300]},{name:'￥300-450',value:[300, 450]},{name:'￥450-600',value:[450, 600]},{name:'￥600-1000',value:[600, 1000]},{name:'￥1000以上',value:[1000, 1100]}]
				]
			}
		},
		mounted() {
			this.searchWord = this.keyword
		},
		data() {
			return {
				searchWord:'',
				Type: 100,
				name:'toolbar'
			};
		},
		methods:{
			searchCollect(){
				this.$emit('searchKey',this.searchWord)
			},
			// 筛选表功能 第index个功能的第number个
			chooseType(index,number){
				let that = this;
				this.$emit('changeType',index,number)
				this.Type = 100
			},
			// 切换筛选
			changeType(index) {
				if (this.Type === index) {
					this.Type = 100;
				} else {
					this.Type = index;
				}
			},
			toBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.toptool {
			background-color: rgb(8, 24, 49);
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12rpx 52rpx;
			.icon {
				width: 46rpx;
				height: 50rpx;
				margin-right: 48rpx;
			}
		
			.search {
				width: 100%;
				border-radius: 40px;
				overflow: hidden;
			}
		}
		.filtrate {
			display: flex;
			font-size: 28rpx;
			font-weight: bold;
			border-bottom: 1px solid #F2F2F2;
			padding: 14rpx 30rpx;
			justify-content: space-between;
			box-sizing: border-box;
			border: 1px solid #D8D8D8;
			.filtrate_item {
				display: flex;
				position: relative;
				width: 22%;
				justify-content: center;
				border-radius: 10rpx;
				background-color: #ffffff;
				align-items: center;
				.filtrate_text{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.icon {
					width: 16rpx;
					height: 10rpx;
					margin-left: 6rpx;
					flex-shrink: 0;
				}
		
				.active {
					transform: rotate(180deg);
				}
		
				&:not(:last-child) .optionList {
					left: 0;
				}
		
				&:last-child .optionList {
					right: 0;
				}
		
				.optionList {
					position: absolute;
					top: 60rpx;
					max-height: 600rpx;
					overflow-y: auto;
					padding: 10rpx 0;
					background-color: white;
					box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.5);
					z-index: 100;
		
					.optionItem {
						padding: 10rpx 20rpx;
						white-space: nowrap;
						font-weight: normal;
		
						&:active {
							background-color: #F5F5F5;
						}
					}
				}
			}
		}
</style>
