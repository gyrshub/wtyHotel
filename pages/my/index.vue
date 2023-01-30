<template>
	<!-- 我的 -->
	<view class="my">
		<view class="userInfo">
			<view :style="{ height:statusBarHeight + 10 + 'px' }"></view>
			<view class="userInfo_content">
				<image class="userImg" :src="userDetail.avatar" @click="toSet"></image>
				<view class="user_item" style="flex: 1;margin-right: 10rpx;overflow: hidden;" @click="toSet">
					<view class="name">{{userDetail.nickName}}</view>
					<view class="phone">{{userDetail.phone}}</view>
				</view>
				<view class="user_item" style="width: 240rpx;">
					<view class="experience">
						{{userDetail.memberGrowthValue}}成长值
					</view>
					<view class="line">
						<view :style="{'width':`${percent}%`}" class="activeline"></view>
					</view>
					<view class="experience">
						{{needExp == 'max'?'已到达到最高等级':`升级还需${needExp}成长值`}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="toolContent">
			<view class="member" @click="toPath(`/pages/my/member?needExp=${needExp}&memberName=${userDetail.memberName}&level=${userDetail.level}&percent=${percent}&exp=${userDetail.memberGrowthValue}`)">
				<view class="grade">
					<image class="member_icon" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610945231147954177.png"></image>
					{{userDetail.memberName}}
				</view>
				<view>
					点击查看会员权益
				</view>
			</view>
			<view class="user_own boxStyle">
				<view class="own_item" @click="toPath('/pages/my/money')">
					<view class="value">{{userDetail.money}}<view class="label">元</view></view>
					<view>钱包余额</view>
				</view>
				<view class="own_item" @click="toPath('/pages/my/integral')">
					<view class="value">{{userDetail.integral}}<view class="label">积分</view></view>
					<view>积分余额</view>
				</view>
			</view>
			
			<view class="toolList boxStyle">
				<view class="title">
					常用功能
				</view>
				<view class="list">
					<view class="tool_item" @click="toPath(`/pages/my/wallet?status=0`)">
						<image class="tool_img" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610952948356935682.png" />
						<view>
							我的钱包
						</view>
					</view>
					<view class="tool_item" @click="toPath(`/pages/my/coupon`)">
						<image class="tool_img" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610950268356063234.png" />
						<view>
							优惠券
						</view>
					</view>
					<view class="tool_item" @click="toPath(`/pages/distribution/distributionApply`)" v-if="userDetail.userType == 0 &&(!userDetail.userTypeApplyVO || userDetail.userTypeApplyVO.state == -1)">
						<image class="tool_img" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610952212860563457.png" />
						<view>
							分销申请
						</view>
					</view>
					<view class="tool_item" @click="toPath(`/pages/my/hotelOccupancy`)" v-if="userDetail.userType == 0 &&(!userDetail.userTypeApplyVO || userDetail.userTypeApplyVO.state == -1)">
						<image class="tool_img" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610951846941093890.png" />
						<view>
							商家入驻
						</view>
					</view>
					<view class="tool_item" @click="toPath(`/pages/distribution/distributionOrder`)" v-if="userDetail.userType == 2 || userDetail.userType == 3">
						<image class="tool_img" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610949891074224129.png" />
						<view>
							分销管理
						</view>
					</view>
					<button open-type="contact" plain="true" class="tool_item server">
						<image class="tool_img" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610952660770287617.png" />
						<view>
							联系客服
						</view>
					</button>
					<view class="tool_item" @click="toPath(`/pages/distribution/code`)" v-if="userDetail.userType > 0">
						<image class="tool_img" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610953106964541442.png" />
						<view>
							分销码
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="loginOut">
			<view class="loginOut_btn" @click="loginOut">
				退出登录
			</view>
		</view>
		<view style="height: 160rpx;"></view>
		<TarBar :current="4"></TarBar>
	</view>
</template>

<script>
	import TarBar from '../../components/tarbar/tarbar.vue'
	export default {
		data() {
			return {
				statusBarHeight:0,
				percent:0,
				userDetail:{
					userType:'',
					nickName:'默认昵称',
					avatar:'https://zy.xry.ink/file-api/statics/2022/10/17/58db601d2aac4689a1a24ec3cf188651_20221017104246A004.png',
					money:0,
					level:0,
					memberGrowthValue:'',
					memberName:'普通会员',
					phone:'',
					integral:0,
					firstRegister:false
				},
				needExp:1001,
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		onShow() {
			this.getUserInfo();
		},
		components:{
			TarBar
		},
		methods:{
			// 获取用户信息
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				// console.log('用户信息',res)
				if(res.code == 200){
					this.userDetail = res.data
					this.userDetail.money = this.userDetail.money / 100
					this.userDetail.memberName = this.userDetail.member.memberName
					uni.setStorageSync('userInfo',JSON.stringify(this.userDetail))
					// 获取会员等级
					this.getMember()
				}
			},
			async getMember(){
				let res = await this.$get('/member/list')
				// console.log('会员列表',res)
				if(res.code == 200){
					let expArray = []
					for(let i=0;i<res.data.length;i++){
						let obj = {
							name:res.data[i].memberName,
							value:res.data[i].growthValue
						}
						expArray.push(obj)
					}
					for(let i=0;i<expArray.length;i++){
						if(this.userDetail.memberName == expArray[i].name){
							// 当前等级为最高等级时
							this.userDetail.level = i
							if((i+1) >= expArray.length){
								this.needExp = 'max'
								this.percent = 100
							}else{
								this.needExp = ((expArray[i+1].value*1000) - (this.userDetail.memberGrowthValue * 1000))/1000
								this.percent = (this.userDetail.memberGrowthValue / expArray[i+1].value).toFixed(2) * 100
							}
						}
					}
				}
			},
			toPath(url){
				uni.navigateTo({
					url:url
				})
			},
			toSet(){
				uni.navigateTo({
					url:'/pages/my/personal'
				})
			},
			loginOut(){
				uni.showModal({
					title:'温馨提示',
					content:'是否退出登录?',
					success:async(res)=> {
						if(res.confirm){
							let res = await this.$get('/user/auth/doLogout')
							// console.log('结果',res)
							if(res.code == 200){
								uni.redirectTo({
									url:'/pages/login/login'
								})
							}
						}
					}
				})
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
.my{
	.userInfo{
		padding: 0 46rpx 0 48rpx;
		height: 492rpx;
		background: url('https://zy.xry.ink/file-api/statics/2022/11/21/62bf4f9e5b814e0d9f79857653f85deb_20221121102039A467.png') no-repeat;
		background-position: 0% 0%;
		background-size: 100% 100%;
		z-index: 5;
		.userInfo_content{
			display: flex;
			margin-top: 68rpx;
			.userInfo_btn{
				background-color: transparent;
				padding: 0;
				line-height: normal;
				&::after{
					border: 0;
				}
			}
			.userImg{
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
				flex-shrink: 0;
				margin-right: 24rpx;
				border: 2px solid #E1DDAA;
			}
			.user_item{
				display: flex;
				flex-direction: column;
				justify-content: center;
				color: #535251;
				font-size: 40rpx;
				.name{
					color: #1F1F1F;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.phone{
					font-size: 32rpx;
					margin-top: 20rpx;
				}
				.experience{
					font-size: 24rpx;
					transform: scale(0.85);
					transform-origin: left center;
				}
			}
		}
	}
	.toolContent{
		padding: 0 24rpx;
		margin-top: -100rpx;
		.member{
			font-size: 24rpx;
			color: #FAE3A7;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-radius: 30px 30px 0 0;
			padding: 20rpx 80rpx;
			box-sizing: border-box;
			background: linear-gradient(90deg, #141414 0%, rgba(78,78,78,0.97) 89%);
			.grade{
				color: #1D1D1B;
				font-weight: bold;
				padding: 8rpx 16rpx;
				border-radius: 10rpx;
				font-size: 30rpx;
				display: flex;
				align-items: center;
				background-color: #FAE3A7;
				.member_icon{
					width: 48rpx;
					height: 48rpx;
					margin-right: 10rpx;
				}
			}
		}
		.user_own{
			margin-top: 20rpx;
			display: flex;
			.own_item{
				display: flex;
				flex-direction: column;
				align-items: center;
				flex: 1;
				font-size: 24rpx;
				color: #3D3D3D;
				.value{
					display: flex;
					margin-bottom: 20rpx;
					font-size: 40rpx;
					font-weight: bold;
					.label{
						font-size: 28rpx;
						transform: scale(0.85);
						transform-origin: left center;
						align-self: flex-end;
					}
				}
			}
		}
		
		.toolList{
			margin-top: 20rpx;
			.title{
				color: #3D3D3D;
				font-size: 32rpx;
			}
			.list{
				display: flex;
				flex-wrap: wrap;
				margin-top: 24rpx;
				.tool_item{
					width: 25%;
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 24rpx;
					margin-bottom: 44rpx;
					.tool_img{
						width: 60rpx;
						height: 60rpx;
						flex-shrink: 0;
						margin-bottom: 4rpx;
					}
				}
				.server{
					margin: 0;
					border: 0rpx;
					line-height: normal;
				}
			}
		}
	}
	
	.loginOut{
		display: flex;
		justify-content: center;
		margin: 40rpx 0;
		.loginOut_btn{
			text-align: center;
			font-size: 32rpx;
			width: 60%;
			background-color: #141414;
			color: #FAE3A7;
			padding: 22rpx 54rpx;
			box-sizing: border-box;
			border-radius: 40rpx;
		}
	}
	
	.boxStyle{
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 20rpx;
	}
	.line {
		width: 234rpx;
		height: 16rpx;
		border-radius: 20rpx;
		position: relative;
		overflow: hidden;
		margin-top: 8rpx;
		border: 1px solid #3C3A3A;
		.activeline {
			border-radius: 20rpx;
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			background-color: #3C3A3A;
			// background: linear-gradient(90deg, #FFAA65 0%, #FB8146 100%);
			z-index: 8;
		}
	}
}
</style>
