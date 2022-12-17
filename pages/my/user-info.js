const app = getApp()
var {
    phoneNumber,
    userInfo
} = require("../../utils/api");
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
import Notify from '@vant/weapp/notify/notify';
var config = require("../../utils/config.js");


Page({
    data: {
        avatarUrl: defaultAvatarUrl,
        name: null,
        phone: null,
        theme: wx.getSystemInfoSync().theme,
    },
    onLoad() {
        wx.onThemeChange((result) => {
            this.setData({
                theme: result.theme
            })
        })
        this.getUserInfo()
    },
    getUserInfo(){
        var userInfo = wx.getStorageSync(config.userStorageKey)
        if(userInfo){
            this.setData({
                avatarUrl: userInfo.avatar,
                name: userInfo.username,
                phone: userInfo.mobile,
            })
        }else{
            this.setData({
                users: null
            })
        }
    },
    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail
        var _this = this
        wx.uploadFile({
            url: config.domain + '/file/upload', //仅为示例，非真实的接口地址
            filePath: avatarUrl,
            name: 'file',
            header: {
                'token':  wx.getStorageSync(config.tokenStorageKey)
              },
            success(res) {
                const data = res.data
                var d = JSON.parse(data)
                console.log(data);
                if(d.code==0){
                    _this.setData({
                        avatarUrl: d.data.src,
                    })
                } else {
                    wx.showToast({
                      title: d.msg,
                      icon:"none"
                    })
                }
               
            }
        })
        // this.setData({
        //     avatarUrl,
        // })
    },
    formInputnameChange(e) {
        this.setData({
            name: e.detail.value
        })
    },
    getPhoneNumber(e) {
        console.log(e.detail.code)
        phoneNumber(e.detail.code).then(res => {
            this.setData({
                phone: res.data.purePhoneNumber
            })
        })
    },
    subUserInfo() {
        if (!this.data.phone) {
            Notify("请输入手机号");
            return
        }
        if (!this.data.avatarUrl) {
            Notify("请选择头像");
            return
        }
        var data = {
            name: this.data.name,
            phone: this.data.phone,
            avatarUrl: this.data.avatarUrl
        }
        userInfo(data).then(res => {
            if(res.code == 0) {
                wx.showToast({
                  title: '修改成功',
                  icon:'none'
                })
                wx.setStorageSync(config.userStorageKey, res.data)
                wx.navigateBack({
                  delta: 1,
                })
            } else {
                Notify('用户信息修改失败')
            }
           
        })
    }
})