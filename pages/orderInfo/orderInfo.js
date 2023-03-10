// pages/orderInfo/orderInfo.js
var {
    orderList,
    cencelOrder,
    orderPay,
    deleteOrder
} = require("../../utils/api");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
        orderLoading: true
    },
    async orderListHandler() {
        await orderList().then(result => {
            result.data.list.forEach(ele => {
                if (ele.order.status == 1) {
                    ele.order.statusStr = '待付款'
                }
                if (ele.order.status == 3 && ele.order.isPayed == 1) {
                    ele.order.statusStr = '支付成功'
                }
                if (ele.order.status == 4) {
                    if (ele.order.closeType == 1) {
                        ele.order.statusStr = '超时未支付'
                    }
                    if (ele.order.closeType == 4) {
                        ele.order.statusStr = '买家取消'
                    }

                }
            })
            this.setData({
                orderLoading: false,
                orderList: result.data.list,
                total: result.data.total
            })
        })
    },

    toIndexPage() {
        wx.redirectTo({
            url: '/pages/category/index',
        })
    },
    /**
     * 关闭订单
     */
    cencelOrderHandler(e) {
        const id = e.currentTarget.dataset.id
        var _that = this
        wx.showModal({
            title: '确定要取消该订单吗？',
            content: '',
            success: function (res) {
                if (res.confirm) {
                    cencelOrder({
                        orderId: id
                    }).then(result => {
                        if (result.code == 0) {
                            wx.showToast({
                                title: '取消订单成功',
                                icon: 'success'
                            })
                        }
                        _that.orderListHandler()
                    })

                } else {
                    console.log('用户点击取消');
                }

            }
        })
    },
    toPayTap(e) {
        const orderNumber = e.currentTarget.dataset.ordernumber
        var _that = this
        wx.showModal({
            title: '确定要支付该订单吗？',
            content: '',
            success: function (res) {
                if (res.confirm) {
                    orderPay(orderNumber).then(result => {
                        wx.requestPayment({
                            timeStamp: result.data.timeStamp,
                            nonceStr: result.data.nonceStr,
                            package: result.data.packageValue,
                            signType: 'RSA',
                            paySign: result.data.paySign,
                            success(res) {
                              _that.orderListHandler()
                            },
                            fail(res) {
                              _that.orderListHandler()
                            }
                        })
                    })
                } else {
                    console.log('用户点击取消');
                }

            }
        })
    },
    /**
     * 删除订单
     */
    deleteOrderHandler(e) {
        const id = e.currentTarget.dataset.id
        const that = this
        wx.showModal({
            title: '提示',
            content: '确定要删除该订单吗？',
            success: function (res) {
                if (res.confirm) {
                    deleteOrder(id).then(result => {
                        if (result.code == 0) {
                            wx.showToast({
                                title: '删除订单成功',
                                icon: 'success'
                            })
                        }
                        that.orderListHandler()
                    })

                } else {
                    console.log('用户点击取消');
                }

            }
        })

    },
    callShop(e) {
        console.log(e);
        const shop = e.currentTarget.dataset.shop
        if (shop) {
            wx.makePhoneCall({
                phoneNumber: shop.tel,
            })
        }

    },
    toDetails(e) {
        const order = e.currentTarget.dataset.order
        console.log(order);
        wx.navigateTo({
            url: '/pages/order-details/index',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    console.log(data)
                },
                someEvent: function (data) {
                    console.log(data)
                }
            },
            success: function (res) {
                // 通过 eventChannel 向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: order
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.orderListHandler()
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