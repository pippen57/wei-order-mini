// pages/my/my.js
var http = require("../../utils/http.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        users:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    loginUser(){
        http.getToken();
        this.getUserInfo()

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
        this.getTabBar().init();
         this.getUserInfo()
    },
    getUserInfo(){
        var userInfo =  wx.getStorageSync('user')
        if(userInfo){
            this.setData({
                users: userInfo
            })
        }else{
            this.setData({
                users: null
            })
        }
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