// pages/shop/select.js
var {shopList} = require('../../utils/api.js')
var { shopStorageKey } = require("../../utils/config")
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      lat: null,
      long: null,
      searchValue: null,
      shops:[],
      orderLoading:true
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
      this.shopList()
      
    },
    searchChange(event){

      this.setData({
        searchValue: event.detail.value
      })
    },
    async shopList(){
      var _this = this 
      console.log(_this,app.globalData);
      await shopList(app.globalData.long, app.globalData.lat,_this.data.searchValue).then(res=>{
        console.log(res);
        if(res.code==0){
            res.data.forEach(ele => {
                ele.kml = (ele.kml/1000).toFixed(2) // 距离保留3位小数
            })
            this.setData({
                shops: res.data,
                orderLoading:false
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
      wx.setStorageSync(shopStorageKey, this.data.shops[idx])
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