/**
 * @desc    API请求接口类封装
 * @author  Aquan
 * @date    2019年7月29日17:38:06
 */
const app = getApp();
var config = require("config.js");

/**
 * POST请求API
 * @param  {String}   url         接口地址
 * @param  {String}   token       请求接口时的Token
 * @param  {Object}   params      请求的参数
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
async function requestPostApi(url,  params, sourceObj, successFun, failFun, completeFun) {
    await requestApi(url,  params, 'POST', sourceObj, successFun, failFun, completeFun)
}

/**
 * GET请求API
 * @param  {String}   url         接口地址
 * @param  {String}   token       请求接口时的Token
 * @param  {Object}   params      请求的参数
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
async function  requestGetApi(url,  params, sourceObj, successFun, failFun, completeFun) {
   await requestApi(url,  params, 'GET', sourceObj, successFun, failFun, completeFun)
}

/**
 * 请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {String}   method      请求类型
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
async function requestApi(url, params, method, sourceObj, successFun, failFun, completeFun) {
    if (method == 'POST') {
        // var contentType = 'application/x-www-form-urlencoded'
        var contentType = 'application/json'
    } else {
        var contentType = 'application/json'
    }
    wx.request({
        url: config.domain + url,
        method: method,
        data: params,
        header: { 
            'Content-Type': contentType
        },
        success: function (res) {
            typeof successFun == 'function' && successFun(res.data, sourceObj);
        },
        fail: function (res) {
            typeof failFun == 'function' && failFun(res.data, sourceObj)
        },
        complete: function (res) {
            typeof completeFun == 'function' && completeFun(res.data, sourceObj)
        }
    })
}


/**
 * 封装微信的request
 * form: 'application/x-www-form-urlencoded'
 */
async function request(url, data = {}, method = "GET", contentType = 'json') {
    return new Promise(function(resolve, reject) {
      wx.request({
        url: config.domain + url,
        data: data,
        method: method,
        header: {
          'Content-Type': contentType.toLowerCase() == 'json' ? "application/json" : "application/x-www-form-urlencoded",
          'token':  wx.getStorageSync('token')
        },
        success: function(res) {
          if (res.statusCode == 200) {
            if (res.data.code == 10020 || res.data.code == 10021) {
                wx.showModal({
                    title: '提示',
                    content: '您需要登录后才能正常使用哦！点击确认跳转登录页面。',
                    success: function (res) {
                        if (res.confirm) {
                            wx.removeStorageSync(config.tokenStorageKey)
                            wx.removeStorageSync(config.userStorageKey)
                            wx.switchTab({
                              url: '/pages/my/my',
                            })
                        } else {
                            console.log('用户点击取消');
                        }
        
                    }
                })

                reject(res.data.msg);
            }else {
                resolve(res.data);
            }
            
          }else if (res.statusCode == 500) {
            wx.showToast({
                title: "服务器出了点小差",
                icon: "none"
            });
        } else if (res.statusCode == 400) {
            wx.showToast({
                title: res.data,
                icon: "none"
            })

        } else {
            wx.showToast({
              title: "服务器出了点小差",
              icon: "none"
            })
            reject(res.errMsg);
          }
        },
        fail: function(err) {
          reject(err)
        }
      })
    });
  }
  

module.exports = {
    requestPostApi,
    requestGetApi,
    request: request
}
