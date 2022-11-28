// pages/order/order.js
var http = require("../../utils/http");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trolleyList: [],
    remarks: '',
    totalCount: 0,
    totalMoney: 0.0,
    mobile: null,
    peisongType: 'ts',
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
    this.preOrder()
    this.setData({
      peisongType: wx.getStorageSync('peisongType')?wx.getStorageSync('peisongType'):'ts'
    })
  },
  preOrder() {
    http.request({
      url: "/order/pre_order",
      method: "GET",
      callBack: result => {
        console.log(result);
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
    remarkChange(e){
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
        shopId: "1588058446765236226",
        remarks: this.data.remarks,
        mealType: this.data.peisongType == 'ts' ? 1 : 2,
        mealTime: this.data.diningTime
      },
      callBack: result => {
        console.log(result);
        wx.hideToast()
        if(result.code!=0){
          this.setData({
            submitLoding: false
          })
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