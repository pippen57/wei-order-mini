var {
    request
} = require("request.js");
var config = require("config.js");

export const https = (options) => {
    return request(options.url, options.data, options.method || 'get')
}

/**
 * 用户登录
 */
export function login(code) {
    return request('/login?code=' + code, {}, 'post')
}
/**
 * 获取用户手机号
 * @param {String} code code
 */
export function phoneNumber(code) {
    return request('/wx/phone?code='+code)
}

export function userInfo(data) {
    return request('/user_info',data,'POST')
}
/**
 * 获取店铺列表
 * @param {String} longitude  经度
 * @param {String} latitude   纬度
 * @param {String} shopName   店铺名
 */
export function shopList(longitude, latitude, shopName) {
    return request("/shop", {
        shopName: shopName,
        longitude: longitude,
        latitude: latitude
    }, "POST")

}

/**
 * 根据店铺Id 获取店铺信息
 * @param {Long} id 店铺Id
 */
export function shopById(longitude, latitude, id) {
    return request("/shop/" + id, {
        longitude: longitude,
        latitude: latitude
    }, "POST")
}
/**
 * 根据店铺Id 获取分类
 * @param {Long} id 店铺Id
 */
export function categoryAll(id) {
    return request("/product/category_all/" + id, {}, "GET")
}
/**
 * 获取当前用户在这个店铺的购物车列表
 * @param {Long} id 店铺Id
 */
export function getTrolleyByShopId(id) {
    return request("/cart/" + id)
}
/**
 * 根据店铺Id和分类Id获取产品列表
 * @param {Long} shopId 店铺Id
 * @param {Long} categoryId 分类Id
 */
export function getProductByCategoryId(shopId, categoryId) {
    return request("/product/list/" + shopId + "/" + categoryId)
}

/**
 * 清空当前店铺购物车
 * @param {Long} shopId 店铺Id
 */
export function clearCartItem(shopId) {
    return request("/cart/" + shopId, {}, "DELETE")
}

/**
 * 添加购物车
 * @param {Object} data 参数
 */
export function addShoppingTrolley(data) {
    return request("/cart", data, "POST")
}
/**
 * 购物车数量变更
 * @param {Object} data 参数
 */
export function cartStepChange(data) {
    return request("/cart", data, "PUT")
}

/**
 *  预下单
 * @param {Long} shopId 店铺ID
 */
export function previaOrder(shopId) {
    return request("/order/pre_order/" + shopId, {}, "GET")
}

/**
 * 提交订单
 * @param {Object} data 数据
 */
export function confirmOrder(data) {
    return request("/order", data, "POST")
}

/**
 * 获取订单列表
 */
export function orderList() {
    return request("/order")
}
/**
 * 取消订单
 * @param {Object} data 数据
 */
export function cencelOrder(data) {
    return request("/order/cencel_order", data, "GET")
}

/**
 * 订单支付
 * @param {String} orderNumber 订单编号
 */
export function orderPay(orderNumber) {
    return request("/order/pay/" + orderNumber)
}
/**
 * 删除订单
 * @param {Long} orderId 订单Id
 */
export function deleteOrder(orderId) {
    return request("/order?orderId=" + orderId, {}, "DELETE")
}