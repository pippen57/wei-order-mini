// pages/order/order.js
var utils = require("../../utils/util")
var { shopStorageKey } = require("../../utils/config")
import Notify from '@vant/weapp/notify/notify';


var {
    previaOrder,confirmOrder
} = require("../../utils/api");
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
    preId: null,
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
    previaOrder(this.data.shops.id).then(result => {
        this.setData({
          trolleyList: result.data.prodList,
          totalCount: result.data.totalCount,
          totalMoney: result.data.totalMoney,
          mobile: result.data.userPhone,
          preId: result.data.preId
        })
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
    wx.requestSubscribeMessage({
        tmplIds: ['yu6v-lTeeNRb3f-1uP1DCBPUaRKvG3vUfSapQsIHCt8','mVlOcEfdt-VujaF_fcZN4Vgty37tkXND1TXw478lUyM'],
        complete:res=> {
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
            if (!this.data.preId) {
                wx.showModal({
                    title: '提示',
                    content: '支付超时，请重下单',
                    showCancel:false,
                    success (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/category/index',
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
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
              this.setData({
                submitLoding: true
              })
              wx.showToast({
                title: '正在提交订单.',
                icon: 'loading'
              })
              var data = {
                  shopId: this.data.shops.id,
                  remarks: this.data.remark,
                  mealType: this.data.peisongType == 'ts' ? 1 : 2,
                  mealTime: this.data.diningTime,
                  preId: this.data.preId
                }
              confirmOrder(data).then(result => {
                  wx.hideToast()
                  if (result.code != 0) {
                    this.setData({
                      submitLoding: false
                    })
                    Notify(result.msg);
                    return
                  }
                  wx.requestPayment({
                    timeStamp: result.data.timeStamp,
                    nonceStr: result.data.nonceStr,
                    package: result.data.packageValue,
                    signType: 'RSA',
                    paySign: result.data.paySign,
                    success(res) {
        
                      wx.redirectTo({
                        url: '/pages/orderInfo/orderInfo'
                      })
                    },
                    fail(res) {
                      wx.redirectTo({
                        url: '/pages/orderInfo/orderInfo'
                      })
                      this.setData({
                        submitLoding: false
                      })
                    }
                  })
              })
            }
        }
    })
    

  },
  bindTextAreaBlur(e) {
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