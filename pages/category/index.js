// pages/category/index.js
var http = require("../../utils/http");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      peisongType:'ts'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.categories()
      
    },
  categories(){
    http.request({
      url: "/product/category_all/"+"1588058446765236226",
      method: "get",
      callBack: result => {
        this.setData({
          categories: result.data,
          categorySelected: result.data[0]
        })
        this.products()
      }
  })
  },
  categoryClick(e) {
    const index = e.currentTarget.dataset.idx
    const categorySelected = this.data.categories[index]
    this.setData({
      categorySelected,
      scrolltop: 0
    })
    this.products()
  },
  products(){
    console.log(this.data.categorySelected);
    http.request({
      url: "/product/list/"+"1588058446765236226/"+this.data.categorySelected.id,
      method: "get",
      callBack: result => {
        console.log(result);
        this.setData({
          goods: result.data
        })
      }
  })
  },


  // 显示分类和商品数量徽章
  processBadge() {
    const categories = this.data.categories
    const goods = this.data.goods
    const shippingCarInfo = this.data.shippingCarInfo
    if (!categories) {
      return
    }
    if (!goods) {
      return
    }
    categories.forEach(ele => {
      ele.badge = 0
    })
    goods.forEach(ele => {
      ele.badge = 0
    })
    if (shippingCarInfo) {
      shippingCarInfo.items.forEach(ele => {
        if (ele.categoryId) {
          const category = categories.find(a => {
            return a.id == ele.categoryId
          })
          if (category) {
            category.badge += ele.number
          }
        }
        if (ele.goodsId) {
          const _goods = goods.find(a => {
            return a.id == ele.goodsId
          })
          if (_goods) {
            _goods.badge += ele.number
          }
        }
      })
    }
    this.setData({
      categories,
      goods
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