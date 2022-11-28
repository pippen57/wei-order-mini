// pages/shop/select.js
var http = require("../../utils/http");
var utils = require("../../utils/util")
Page({

    /**
     * 页面的初始数据
     */
    data: {
      lat: null,
      long: null,
      searchValue: null,
      shops:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.setData({
        type: options.type
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      var _this = this 
      wx.getLocation({
          type: 'gcj02',
          success(res) {
            _this.setData({
              lat: res.latitude,
              long: res.longitude
            })
            _this.shopList()
          }
      })
      
    },
    searchChange(event){

      this.setData({
        searchValue: event.detail.value
      })
    },
    shopList(){
      http.request({
        url: "/shop",
        method: "POST",
        data:  {
          shopName:this.data.searchValue
        },
        callBack: result => {
            console.log(result);
            result.data.forEach(ele => {
              var kml = utils.getDistance(this.data.lat, this.data.long, ele.shopLat, ele.shopLng)
              ele.distance = kml
            })
            this.setData({
              shops: result.data
            })
        }
    })
    },
    search(event){
      console.log('search')
      this.setData({
        searchValue: event.detail.value
      })
      this.shopList()
    },
    goShop(e){
      console.log(e);
      const idx = e.currentTarget.dataset.idx    
      wx.setStorageSync('shopInfo', this.data.shops[idx])
      if (this.data.type == 'index') {
        wx.setStorageSync('refreshIndex', 1)
      }
      // if (this.data.type == 'pay') {
      //   wx.navigateBack()
      // } else {
      //   wx.switchTab({
      //     url: '/pages/category/index'
      //   })
      // }
      wx.navigateBack()
      
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

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