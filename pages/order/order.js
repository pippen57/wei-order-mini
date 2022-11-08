// pages/order/order.js
var http = require("../../utils/http");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        trolleyList:[],
        remarks:'',
        totalCount:0,
        totalMoney:0.0
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

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 获取
        this.preOrder()
    },
    preOrder(){
        http.request({
            url: "/order",
            method: "GET",
            callBack: result => {
                console.log(result);
                this.setData({
                    trolleyList: result.data.prodList,
                    totalCount:result.data.totalCount,
                    totalMoney:result.data.totalMoney
                })
            }
        })
    },
    /**
     * 确认付款 并吊起微信支付
     */
    confirmOrder(){
        http.request({
            url: "/order",
            method: "POST",
            data:{
                shopId: "1588058446765236226",
                remarks:this.data.remarks
            },
            callBack: result => {
                console.log(result);
                wx.requestPayment({
                    timeStamp: result.data.timeStamp,
                    nonceStr: result.data.nonceStr,
                    package: result.data.packageValue,
                    signType: 'RSA',
                    paySign: result.data.paySign,
                    success (res) { console.log(res);},
                    fail (res) { console.log(res);}
                  })
            }
        })
    },
    bindTextAreaBlur(e){
        console.log(e.detail.value);
        this.setData({
            remarks:e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        this.setData({
            trolleyList:[],
            totalCount:0,
            totalMoney:0.0
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