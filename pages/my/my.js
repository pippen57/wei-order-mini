// pages/my/my.js
var config = require("../../utils/config.js");
var {
    login
} = require("../../utils/api");
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
         wx.showLoading({
           title: '登录中.',
         })
        wx.login({
            success: res => {
                login(res.code).then(result =>{
                    wx.hideLoading()
                    if (result.code == 0) {
                        wx.setStorageSync(config.tokenStorageKey, result.data.token); //把token存入缓存，请求接口数据时要用
                        wx.setStorageSync(config.userStorageKey, result.data.user)
                        this.getUserInfo()
                        wx.showToast({
                            title: "登录成功",
                            icon: "success"
                        });
                    } else {
                        wx.showToast({
                            title: result.msg,
                            icon: "error"
                        });
                    }
                }).catch(function (reason) {
                    wx.showLoading()
                    wx.showToast({
                        title: "服务器异常",
                        icon: "error"
                    });
                });
            }
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
        this.getTabBar().init();
         this.getUserInfo()
    },
    getUserInfo(){
        var userInfo = wx.getStorageSync(config.userStorageKey)
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