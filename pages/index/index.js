//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    list:[
        {
            pagePath:"/pages/index/index",
            text:"首页",
            iconPath:"/icons/index.png",
            selectedIconPath:"/icons/index-selected.png"
        },
        {
            pagePath:"/pages/my/my",
            text:"我的",
            iconPath:"/icons/my.png",
            selectedIconPath:"/icons/my-selected.png"
        }
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
