<script>
	export default {
		globalData: {
			test: false,
			statusBarHeight: 0,
		},
		created() {
			let that = this;
			wx.getSystemInfo({ //GetSystemInfo函数用于获取当前系统的信息。
				success(res) {
					that.$options.globalData.statusBarHeight = res.statusBarHeight;
					//model中包含着设备信息
					const model = res.model;
					// console.log("手机信息res----" + res.model, res);
					if (/iPhone X/i.test(model)) {
						that.$options.globalData.test = true;
					} else if (/iPhone 11/i.test(model)) {
						that.$options.globalData.test = true;
					} else if (
						/iphone\sx/i.test(model) ||
						(/iphone/i.test(model) && /unknown/.test(model)) ||
						/iphone\s11/.test(model)
					) {
						that.$options.globalData.test = true;
					} else {
						that.$options.globalData.test = false;
					}
			 },
			});
		},
		onLaunch: function(options) {
			// console.log('App Launch',options)
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
</style>

<style lang="less" >
	/*每个页面公共css */
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	image {
		image-rendering: -moz-crisp-edges;
		image-rendering: -o-crisp-edges;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
		-ms-interpolation-mode: nearest-neighbor;
	}

	.oneHide {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.twoHide {
		overflow: hidden; //超出隐藏
		text-overflow: ellipsis; //溢出用省略号显示
		display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
		// 控制行数
		-webkit-line-clamp: 2; //超出两行隐藏
		-webkit-box-orient: vertical; // 从上到下垂直排列子元素
		//（设置伸缩盒子的子元素排列方式）
	}
	
	.row_fc{
		display: flex;
		align-items: center;
	}
	
	.model{
		width: 100vw;
		height: 100vh;
		background-color: rgba(255, 255, 255, 0.8);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		.model_content{
			display: flex;
			flex-direction: column;
			position: absolute;
			top: 40%;
			left: 50%;
			transform: translate(-50%,-50%);
			.model_img{
				width: 280rpx;
				height: 280rpx;
			}
			.model_btn{
				background-color: #0A142A;
				color: #FAE4A7;
				border-radius: 20px;
				padding: 10rpx 40rpx;
				margin-top: 120rpx;
				font-size: 50rpx;
			}
		}
	}
</style>
