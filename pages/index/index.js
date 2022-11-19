//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShow() {
		this.getTabBar().init();
	},
  //事件处理函数
  onNaviCard(e) {
    let {
      title,
      navigatemark
    } = e.target.dataset;
    if(navigatemark==='diancan'){
        wx.navigateTo({
            url: '/pages/category/index',
            success: function(res) {
              // 通过 eventChannel 向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
            }
          })
    } else if(navigatemark ==='saoma'){
        wx.scanCode({
            onlyFromCamera: true,
            success (res) {
              console.log(res)
            }
          })
    }
    console.log(title,navigatemark);
  },
  onLoad: function () {
  
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
