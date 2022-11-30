//app.js
var http = require("utils/http.js");
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    http.getToken();
    wx.getLocation({
      type: 'wgs84', 
      success: (res) => {
        // console.log(res)
        this.globalData.lat = res.latitude
        this.globalData.long = res.longitude
      },      
      fail(e){
          wx.showModal({
            title: '出错了~',
            content: e.errMsg,
            showCancel: false
          })
      }
    })
  },
  globalData: {
    userInfo: null,
    // 纬度
    lat:null,
    // 经度
    long:null,
    // 定义全局请求队列
    requestQueue: [],
    // 是否正在进行登陆
    isLanding: true,
    // 购物车商品数量
    totalCartCount: 0
      
  }
})