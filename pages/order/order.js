// pages/order/order.js
var http = require("../../utils/http");
var utils = require("../../utils/util")
var { shopStorageKey } = require("../../utils/config")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trolleyList: [],
    remark: '',
    totalCount: 0,
    totalMoney: 0.0,
    mobile: null,
    peisongType: 'ts',
    diningTime: "立即",
    shops:null,
    currentDate: new Date().getHours() + ':' + (new Date().getMinutes() % 10 === 0 ? new Date().getMinutes() : Math.ceil(new Date().getMinutes() / 10) * 10),
    minHour: new Date().getHours(),
    minMinute: new Date().getMinutes(),
    formatter(type, value) {
      if (type === 'hour') {
        return `${value}点`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 10 === 0);
      }
      return options;
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  getshopInfo() {
    const shopInfo = wx.getStorageSync(shopStorageKey)
    if (shopInfo) {
      this.setData({
        shops: shopInfo,
        shopIsOpened: utils.checkIsOpened(shopInfo.openTime)
      })
      this.preOrder()
    } else {
    //   var _this = this
    //   http.shopList(_this, app.globalData.long, app.globalData.lat, null, r => {
    //     console.log(r);
    //     if (r.code == 0 && r.data.length > 0) {
    //       var shopInfo = r.data[0];
    //       shopInfo.kml = (r.data[0].kml / 1000).toFixed(2)
    //       wx.setStorageSync(shopStorageKey, shopInfo)
    //       _this.setData({
    //         shops: shopInfo,
    //         shopIsOpened: this.checkIsOpened(shopInfo.openTime)
    //       })
    //     } else {
    //       wx.showToast({
    //         title: '暂无开通门店—'
    //       })
    //     }
    //   });
    wx.navigateTo({
      url: '/pages/shop/select?type=pay',
    })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  diningTimeChange(a) {
    const selectedHour = a.detail.getColumnValue(0).replace('点', '') * 1
    if (selectedHour == new Date().getHours()) {
      let minMinute = new Date().getMinutes()
      if (minMinute % 10 !== 0) {
        minMinute = minMinute / 10 + 1
      }
      this.setData({
        minMinute
      })
    } else {
      this.setData({
        minMinute: 0
      })
    }
  },
  selected(e) {
    const peisongType = e.currentTarget.dataset.pstype
    this.setData({
      peisongType
    })
    wx.setStorageSync('peisongType', peisongType)
    // this.createOrder()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取
    
    this.setData({
      peisongType: wx.getStorageSync('peisongType') ? wx.getStorageSync('peisongType') : 'ts'
    })
    this.getshopInfo()
  },
  preOrder() {
    http.request({
      url: "/order/pre_order/"+ this.data.shops.id,
      method: "GET",
      callBack: result => {
        this.setData({
          trolleyList: result.data.prodList,
          totalCount: result.data.totalCount,
          totalMoney: result.data.totalMoney,
          mobile: result.data.userPhone
        })
      }
    })
  },

  // 备注
  remarkChange(e) {
    console.log(e);
    this.data.remark = e.detail.value
  },
  /**
   * 确认付款 并吊起微信支付
   */
  confirmOrder() {
    if (this.data.submitLoding) return
    const mobile = this.data.mobile
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    if (!this.data.diningTime) {
      wx.showToast({
        title: '请选择取餐时间',
        icon: 'none'
      })
      return
    }
    if (!this.data.shops.id) {
      wx.showModal({
        title: '请选择门店',
        content: '',
        complete: (res) => {
          if (res.cancel) {

          }

          if (res.confirm) {

          }
        }
      })
      return
    } else {
      wx.showModal({
        title: '请确认下单门店',
        content: '您选择的门店：' + this.data.shops.shopName,
        cancelText: "选择门店",
        confirmText: "确认下单",
        complete: (res) => {
          if (res.cancel) {
            wx.navigateTo({
              url: '/pages/shop/select',
            })
          }

          if (res.confirm) {
            this.setData({
              submitLoding: true
            })
            wx.showToast({
              title: '正在提交订单.',
              icon: 'loading'
            })
            http.request({
              url: "/order",
              method: "POST",
              data: {
                shopId: this.data.shops.id,
                remarks: this.data.remark,
                mealType: this.data.peisongType == 'ts' ? 1 : 2,
                mealTime: this.data.diningTime
              },
              callBack: result => {
                wx.hideToast()
                if (result.code != 0) {
                  this.setData({
                    submitLoding: false
                  })
                  wx.showToast({
                    title: result.msg,
                    icon:"error"
                  })
                  return
                }
                wx.requestPayment({
                  timeStamp: result.data.timeStamp,
                  nonceStr: result.data.nonceStr,
                  package: result.data.packageValue,
                  signType: 'RSA',
                  paySign: result.data.paySign,
                  success(res) {
                    console.log(res);
                    wx.redirectTo({
                      url: '/pages/orderInfo/orderInfo'
                    })
                  },
                  fail(res) {
                    console.log(res);
                    wx.redirectTo({
                      url: '/pages/orderInfo/orderInfo'
                    })
                    this.setData({
                      submitLoding: false
                    })
                  }
                })
              }
            })
          }
        }
      })
    }

  },
  bindTextAreaBlur(e) {
    console.log(e.detail.value);
    this.setData({
      remarks: e.detail.value
    })
  },
  diningTimeShow() {
    this.setData({
      diningTimeShow: true
    })
  },
  diningTimeHide() {
    this.setData({
      diningTimeShow: false
    })
  },
  diningTimeConfirm(e) {
    this.setData({
      diningTime: e.detail
    })
    this.diningTimeHide()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.setData({
      trolleyList: [],
      totalCount: 0,
      totalMoney: 0.0
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})