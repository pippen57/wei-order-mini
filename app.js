//app.js
var {login} = require('utils/api.js')
var config = require("utils/config.js");
App({
  onLaunch: async function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
        success: res => {
            login(res.code).then(result =>{
                if (result.code == 0) {
                    wx.setStorageSync(config.tokenStorageKey, result.data.token); //把token存入缓存，请求接口数据时要用
                    wx.setStorageSync(config.userStorageKey, result.data.user)
                } else {
                    wx.showToast({
                        title: result.msg,
                        icon: "error"
                    });
                }
            }).catch(function (reason) {
                console.log('rejected');
                console.log(reason);
                wx.showToast({
                    title: "服务器出了点小差",
                    icon: "error"
                });
            });
        }
    })

    wx.getLocation({
      type: 'wgs84', 
      success: (res) => {
         console.log(res)
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