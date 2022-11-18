var http = require("../../utils/http");
var app = getApp();

//声明全局变量
let proListToTop = [],
    menuToTop = [],
    MENU = 0,
    windowHeight, timeoutId;
// MENU ==> 是否为点击左侧进行滚动的，如果是，则不需要再次设置左侧的激活状态
Page({

    data: {
        staticImg: app.globalData.staticImg,
        currentActiveIndex: 0,
        popupShow: false,
        totalCartPrice: 0,
        showLoading: true,
        popupTrolleyShow: false,
        totalCartCount: 0,
        skuList: [],
        popupObj: {},
        defaultSku: undefined,
        selectedProp: [],
        selectedPropObj: {},
        allProperties: [],
        skuGroup: {},
        propKeys: [],
        peisongType:'',
        // 购物车数据
        trolleyList: [{
            id: "221111",
            productName: "臊子面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs: "https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point: "",
            count: 1,
            price: "15",
            sold_num: "834"
        }, {
            id: "221112",
            productName: "老陕炸酱面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs: "https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point: "",
            count: 1,
            price: "14",
            sold_num: "894"
        }, {
            id: "221113",
            productName: "油泼面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs: "https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point: "",
            count: 1,
            price: "9.9",
            sold_num: "1894"
        }, {
            id: "221111",
            productName: "臊子面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs: "https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point: "",
            count: 1,
            price: "15",
            sold_num: "834"
        }, {
            id: "221112",
            productName: "老陕炸酱面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs: "https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point: "",
            count: 1,
            price: "14",
            sold_num: "894"
        }, {
            id: "221113",
            productName: "油泼面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs: "https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point: "",
            count: 1,
            price: "9.9",
            sold_num: "1894"
        }],
        // 接口返回的商品数组
        navList: [],


    },
    onLoad: function (e) {
        // 确保页面数据已经刷新完毕~
        setTimeout(() => {
            this.getAllRects()
        }, 20)
    },

    changeMenu(e) {
        console.log(proListToTop);
        // 改变左侧tab栏操作
        if (Number(e.target.id) === this.data.currentActiveIndex) return
        MENU = 1
        this.setData({
            currentActiveIndex: Number(e.target.id),
            rightProTop: proListToTop[Number(e.target.id)]
        })
        this.setMenuAnimation(Number(e.target.id))
    },
    scroll(e) {
        console.log(e);
        for (let i = 0; i < proListToTop.length; i++) {
            if (e.detail.scrollTop < proListToTop[i] && i !== 0 && e.detail.scrollTop > proListToTop[i - 1]) {
                return this.setDis(i)
            }
        }
        // 找不到匹配项，默认显示第一个数据
        if (!MENU) {
            this.setData({
                currentActiveIndex: 0
            })
        }
        MENU = 0
    },
    setDis(i) {
        // 设置左侧menu栏的选中状态
        if (i !== this.data.currentActiveIndex + 1 && !MENU) {
            this.setData({
                currentActiveIndex: i - 1
            })
        }
        MENU = 0
        this.setMenuAnimation(i)
    },
    setMenuAnimation(i) {
        // 设置动画，使menu滚动到指定位置。
        let self = this
        console.log(33)
        if (menuToTop[i].animate) {
            console.log(11111)
            // 节流操作
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            timeoutId = setTimeout(() => {
                console.log(12138)
                self.setData({
                    leftMenuTop: (menuToTop[i].top - windowHeight)
                })
            }, 50)
        } else {
            console.log(11)
            if (this.data.leftMenuTop === 0) return
            console.log(22)
            this.setData({
                leftMenuTop: 0
            })
        }
    },
    getActiveReacts() {
        wx.createSelectorQuery().selectAll('.menu-active').boundingClientRect(function (rects) {
            return rects[0].top
        }).exec()
    },
    getAllRects() {
        // 获取商品数组的位置信息
        wx.createSelectorQuery().selectAll('.pro-item').boundingClientRect(function (rects) {
            rects.forEach(function (rect) {
                console.log(rect)
                // 这里减去44是根据你的滚动区域距离头部的高度，如果没有高度，可以将其删去
                proListToTop.push(rect.top - 44)
            })
        }).exec()

        // 获取menu数组的位置信息
        wx.createSelectorQuery().selectAll('.menu-item').boundingClientRect(function (rects) {
            wx.getSystemInfo({
                success: function (res) {
                    console.log(res);
                    windowHeight = res.windowHeight / 2
                    // console.log(windowHeight)
                    rects.forEach(function (rect) {
                        menuToTop.push({
                            top: rect.top,
                            animate: rect.top > windowHeight
                        })
                    })
                }
            })
        }).exec()
    },
    /**
     * 根据skuList进行数据组装
     */
    groupSkuProp: function (e) {
        var prod = e.currentTarget.dataset.propduct

        var skuList = prod.skuList;
        this.setData({
            skuList: skuList
        })
        this.setData({
            popupObj: prod,
            popupShow: true
        })
        //当后台返回只有一个SKU时，且SKU属性值为空时，即该商品没有规格选项，该SKU直接作为默认选中SKU
        if (skuList.length == 1 && skuList[0].properties == "") {
            this.setData({
                defaultSku: skuList[0]
            });
            return;
        }

        var skuGroup = {}; //所有的规格名(包含规格名下的规格值集合）对象，如 {"颜色"：["金色","银色"],"内存"：["64G","256G"]}
        var allProperties = []; //所有SKU的属性值集合，如 ["颜色:金色;内存:64GB","颜色:银色;内存:64GB"]
        var propKeys = []; //所有的规格名集合，如 ["颜色","内存"]

        for (var i = 0; i < skuList.length; i++) {

            //找到和商品价格一样的那个SKU，作为默认选中的SKU
            var defaultSku = this.data.defaultSku;
            var isDefault = false;
            if (!defaultSku && skuList[i].price == prod.price) {
                defaultSku = skuList[i];
                isDefault = true;
                this.setData({
                    defaultSku: defaultSku
                });
            }

            var properties = skuList[i].properties; //如：版本:公开版;颜色:金色;内存:64GB
            allProperties.push(properties);
            var propList = properties.split(";"); // 如：["版本:公开版","颜色:金色","内存:64GB"]

            var selectedPropObj = this.data.selectedPropObj;
            for (var j = 0; j < propList.length; j++) {

                var propval = propList[j].split(":"); //如 ["版本","公开版"]
                var props = skuGroup[propval[0]]; //先取出 规格名 对应的规格值数组

                //如果当前是默认选中的sku，把对应的属性值 组装到selectedProp
                if (isDefault) {
                    propKeys.push(propval[0]);
                    selectedPropObj[propval[0]] = propval[1];
                }

                if (props == undefined) {
                    props = []; //假设还没有版本，新建个新的空数组
                    props.push(propval[1]); //把 "公开版" 放进空数组
                } else {
                    if (!this.array_contain(props, propval[1])) { //如果数组里面没有"公开版"
                        props.push(propval[1]); //把 "公开版" 放进数组
                    }
                }
                skuGroup[propval[0]] = props; //最后把数据 放回版本对应的值
            }
            this.setData({
                selectedPropObj: selectedPropObj,
                propKeys: propKeys
            });
        }
        this.parseSelectedObjToVals();
        this.setData({
            skuGroup: skuGroup,
            allProperties: allProperties
        });
    },

    //将已选的 {key:val,key2:val2}转换成 [val,val2]
    parseSelectedObjToVals: function () {
        var selectedPropObj = this.data.selectedPropObj;
        var selectedProperties = "";
        var selectedProp = [];
        for (var key in selectedPropObj) {
            selectedProp.push(selectedPropObj[key]);
            selectedProperties += key + ":" + selectedPropObj[key] + ";";
        }
        selectedProperties = selectedProperties.substring(0, selectedProperties.length - 1);
        this.setData({
            selectedProp: selectedProp
        });

        var findSku = false;
        for (var i = 0; i < this.data.skuList.length; i++) {
            if (this.data.skuList[i].properties == selectedProperties) {
                findSku = true;
                this.setData({
                    defaultSku: this.data.skuList[i],
                });
                break;
            }
        }
        this.setData({
            findSku: findSku
        });
    },
    //点击选择规格
    toChooseItem: function (e) {
        console.log(e.currentTarget.dataset);
        var val = e.currentTarget.dataset.val;
        var key = e.currentTarget.dataset.key;
        var selectedPropObj = this.data.selectedPropObj;
        selectedPropObj[key] = val;
        this.setData({
            selectedPropObj: selectedPropObj
        });
        this.parseSelectedObjToVals();
    },
    //判断数组是否包含某对象
    array_contain: function (array, obj) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == obj) //如果要求数据类型也一致，这里可使用恒等号===
                return true;
        }
        return false;
    },
    // 获取系统的高度信息
    getSystemInfo() {
        let self = this
        wx.getSystemInfo({
            success: function (res) {
                windowHeight = res.windowHeight / 2
            }
        })
    },
    onCounterChange(e) {
        this.data.popupObj.count = e.detail.count
        this.setData({
            popupObj: this.data.popupObj
        })
    },
    onOut() {
        wx.showToast({
            title: '超出限制',
        });
    },
    /**
     * 查看商品详情
     */
    onCategory(e) {
        console.log(e);
        this.setData({
            popupObj: e.currentTarget.dataset.select,
            popupShow: true
        })
    },
    /**
     * 添加购物车
     */
    addShoppingTrolley(e) {
        if (!this.data.findSku) {
            return;
        }
        var ths = this;
        var prod = e.currentTarget.dataset.add
        var params = {
            shopId: 1,
            productId: prod.id,
            skuId: this.data.defaultSku.id,
            quantity: prod.count ? prod.count : 1

        }
        http.request({
            url: "/cart",
            method: "POST",
            data: params,
            callBack: result => {
                console.log(result);
                wx.vibrateShort({type:'medium'})
                ths.setData({
                    popupShow: false,
                    totalCartCount: this.data.totalCartCount++
                })
                this.getTrolley()
            }
        })

    },
    /**
     * 点击购物车
     */
    onTrolley() {
        this.setData({
            popupTrolleyShow: true
        })
    },
    /**
     * 结算
     */
    onGoCloseAccount() {
        this.setData({
            popupTrolleyShow: false
        })
        wx.navigateTo({
            url: '/pages/order/order',
            success: function (res) {
                // 通过 eventChannel 向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: 'test'
                })
            }
        })
    },
    /**
     * 获取购物车数据
     */
    getTrolley(){
        http.request({
            url: "/cart",
            method: "GET",
            callBack: result => {
                console.log(result);
                var price = 0
                result.data.forEach(e => {
                    price += e.sku.price * e.quantity
                })
                
                this.setData({
                    trolleyList: result.data,
                    totalCartCount: result.data.length,
                    totalCartPrice: price.toFixed(2)
                })
            }
        })
    },
    /**
     * 清空购物车
     */
    clearCartItem(){
        http.request({
            url: "/cart",
            method: "DELETE",
            callBack: result => {
                this.setData({
                    trolleyList: [],
                    totalCartCount: 0,
                    totalCartPrice: 0,
                    popupTrolleyShow:false
                })
                wx.vibrateShort({type:'medium'})
                this.getTrolley()
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        http.request({
            url: "/product/list/1588058446765236226",
            method: "GET",
            callBack: result => {
                this.setData({
                    showLoading: false,
                    navList: result.data
                })
            }
        })
        this.getTrolley()
 
    },

})