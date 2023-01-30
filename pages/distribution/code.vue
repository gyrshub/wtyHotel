<template>
	<!-- 分销码 -->
	<view class="code">
		<view class="mycode">
			<view class="userInfo">
				<image class="userImage" :src="userInfo.avatar"></image>
				<view>{{roleName}}</view>
			</view>
			<image v-if="roleType == 4" style="width: 480rpx;height: 480rpx;" src="https://jiudian-1313125514.cos.ap-guangzhou.myqcloud.com/jiudianxiangmu%2FstopUse.png"></image>
			<view v-if="roleType == 4" style="color: #707070;font-size: 32rpx;padding-bottom: 48rpx;">已停用</view>
			<image v-if="roleType == 1 || roleType == 2 || roleType == 3" class="codeImage" :src="userInfo.userTypeApplyVO.qrCode"></image>
			<view v-if="roleType == 1 || roleType == 2 || roleType == 3" style="color: #707070;font-size: 24rpx;padding-bottom: 48rpx;">扫描上方二维码</view>
		</view>
		<view class="explain">
			<view class="explain-title">说明：</view>
			<view class="explain-content" v-if="roleType == 2 || roleType == 3">
				成为分销商后，客户或朋友扫描其专属推广二维码关注并注册，客户或朋友在平台充值或消费，推广者均可获得相应的佣金。
			</view>
			<view class="explain-content" v-if="roleType == 1">
				成为商家后，普通用户扫描其专属商户码将会自动提交分销商审核，商家在后台同意后该用户将会成为商家的分销商。
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:'',
				roleType:1,// 申请状态（-1:驳回 0:待审核 1:商家 2:商家业务员 3:平台业务员 4:停用）
				roleName:'',
			};
		},
		created() {
			this.getUser()
		},
		methods:{
			async getUser(){
				let res = await this.$get('/user/getInfo')
				if(res.code == 200){
					this.userInfo = res.data
					this.roleType = this.userInfo.userTypeApplyVO.state
					
					this.roleName = this.roleType == 1? this.userInfo.userTypeApplyVO.merchantName
					: this.roleType == 2? this.userInfo.userTypeApplyVO.salesmanName
					: this.roleType == 3? this.userInfo.userTypeApplyVO.salesmanName : '被停用'
				}
			}
		}
	}
</script>
<style>
	page{
		background-color: #F5F5F5;
		overflow: hidden;
	}
</style>
<style lang="less" scoped>
.code{
	padding: 0 32rpx;
	.mycode{
		border-radius: 20rpx;
		background-color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 160rpx;
		.userInfo{
			color: #0B0B0B;
			font-size: 32rpx;
			margin-top: -80rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.userImage{
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				margin-bottom: 8rpx;
			}
		}
		.codeImage{
			width: 480rpx;
			height: 480rpx;
			margin: 48rpx 0;
		}
	}
	.explain{
		margin-top: 48rpx;
		.explain-title{
			font-size: 28rpx;
			color: #121212;
		}
		.explain-content{
			font-size: 26rpx;
			color: #707070;
			margin-top: 16rpx;
		}
	}
}
</style>
