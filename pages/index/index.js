//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,

        bnrUrl: ['https://peng.pippen.top//pippen/ohr.adansoniagrandidieri_zh-cn1154912052_1920x1080_1593104400551.jpg'],
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onShow() {
        this.getTabBar().init();
    },
    imageLoad: function (e) { //获取图片真实宽度
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比
            ratio = imgwidth / imgheight;
        console.log(imgwidth, imgheight)
        //计算的高度值
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight;
        var imgheights = this.data.imgheights;
        //把每一张图片的对应的高度记录到数组里
        imgheights[e.target.dataset.id] = imgheight;
        this.setData({
            imgheights: imgheights
        })
    },
    bindchange: function (e) {
        // console.log(e.detail.current)
        this.setData({
            current: e.detail.current
        })
    },
    //事件处理函数
    onNaviCard(e) {
        let {
            title,
            navigatemark
        } = e.target.dataset;
        if (navigatemark === 'diancan') {
            wx.navigateTo({
                url: '/pages/category/index',
                success: function (res) {
                    // 通过 eventChannel 向被打开页面传送数据
                    res.eventChannel.emit('acceptDataFromOpenerPage', {
                        data: 'test'
                    })
                }
            })
        } else if (navigatemark === 'saoma') {
            wx.scanCode({
                onlyFromCamera: true,
                success(res) {
                    console.log(res)
                }
            })
        }
        console.log(title, navigatemark);
    },
    onLoad: function () {

    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})