// pages/category/index.js
var http = require("../../utils/http");
var utils = require("../../utils/util")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peisongType: 'ts',
    showCartPop: false, // 是否显示购物车列表
    showGoodsDetailPOP: false, // 是否显示商品详情
    shopIsOpened: false, // 是否营业
    skuList: [],
    popupObj: {},
    defaultSku: undefined,
    selectedProp: [],
    selectedPropObj: {},
    allProperties: [],
    skuGroup: {},
    propKeys: [],
    // 购物车数据
    trolleyList: [],
    // 接口返回的商品数组
    navList: [],
    // 加入购物车数量
    selectNumber: 1,
    shops: null,
    goods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getshopInfo()
   
    this.getTrolley()
  },
  getshopInfo() {
    const shopInfo = wx.getStorageSync('shopInfo')
    if (shopInfo) {
      this.setData({
        shops: shopInfo,
        shopIsOpened: utils.checkIsOpened(shopInfo.openTime)
      })
      this.categories()
    } else {
      var _this = this
      http.shopList(_this, app.globalData.long, app.globalData.lat, null, r => {
        console.log(r);
        if (r.code == 0 && r.data.length > 0) {
          var shopInfo = r.data[0];
          shopInfo.kml = (r.data[0].kml/1000).toFixed(2)
          wx.setStorageSync('shopInfo', shopInfo)
          _this.setData({
            shops: shopInfo,
            shopIsOpened: utils.checkIsOpened(shopInfo.openTime)
          })
          this.categories()
        } else {
          wx.showToast({
            title: '暂无开通门店—'
          })
        }
      });
    }

  },



  changePeisongType(e) {
    const peisongType = e.currentTarget.dataset.type
    this.setData({
      peisongType
    })
    wx.setStorage({
      data: peisongType,
      key: 'peisongType',
    })
  },
  categories() {
    if(this.data.shops.id){
    http.request({
      url: "/product/category_all/" + this.data.shops.id,
      method: "get",
      callBack: result => {
        this.setData({
          categories: result.data,
          categorySelected: result.data[0]
        })
        this.products()
      }
    })
  } else{
    this.getshopInfo()
  }
  },
  categoryClick(e) {
    const index = e.currentTarget.dataset.idx
    const categorySelected = this.data.categories[index]
    this.setData({
      categorySelected,
      scrolltop: 0
    })
    wx.showToast({
      icon: 'loading'
    })
    this.products()
  },
  products() {
    http.request({
      url: "/product/list/" + this.data.shops.id+"/" + this.data.categorySelected.id,
      method: "get",
      callBack: result => {
        console.log("/product/list/", result);
        wx.hideToast({
          success: (res) => {},
        })
        this.setData({
          goods: result.data
        })
        this.processBadge()
      }
    })

  },
  showCartPop() {
    this.setData({
      showCartPop: !this.data.showCartPop
    })
  },
  hideCartPop() {
    this.setData({
      showCartPop: false
    })
  },
  /**
   * 显示商品规格选择
   */
  showProdDetail(e) {
    const index = e.currentTarget.dataset.idx
    console.log(index);

    this.setData({
      showGoodsDetailPOP: true
    })
    this.groupSkuProp(index)
    // this._showGoodsDetailPOP(goodsId)
    // this.goodsAddition(goodsId)
  },
  /**
   * 隐藏商品规格选择
   */
  hideProdDetail() {
    this.setData({
      showGoodsDetailPOP: false,
      selectedProperties: null,
      findSku: false,
      selectedPropObj: {},
      defaultSku: undefined,
      selectNumber: 1
    })
  },
  /**
   * 根据skuList进行数据组装
   */
  groupSkuProp: function (e) {
    var prod = e

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
    console.log("defaultSku", defaultSku);
    this.parseSelectedObjToVals();
    this.setData({
      skuGroup: skuGroup,
      allProperties: allProperties
    });
    console.log(skuGroup, allProperties);
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
    console.log("selectedProperties", selectedProperties, "findSku", findSku);
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
  /**
   * 添加购物车
   */
  addShoppingTrolley(e) {
    if (!this.data.findSku) {
      return;
    }
    if(!this.data.shops.id){
      wx.showModal({
        title: '请先选择门店',
        content: '',
        complete: (res) => {
          if (res.cancel) {
            
          }
      
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/shop/select',
            })
          }
        }
      })
      return;
    }
    var ths = this;
    var prod = e.currentTarget.dataset.add
    var params = {
      shopId: this.data.shops.id,
      productId: prod.id,
      skuId: this.data.defaultSku.id,
      quantity: this.data.selectNumber ? this.data.selectNumber : 1

    }
    http.request({
      url: "/cart",
      method: "POST",
      data: params,
      callBack: result => {
        console.log(result);
        wx.vibrateShort({
          type: 'medium'
        })
        ths.setData({
          showGoodsDetailPOP: false,

        })
        this.getTrolley()
      }
    })

  },
  /**
   * 清空购物车
   */
  clearCartItem() {
    http.request({
      url: "/cart",
      method: "DELETE",
      callBack: result => {
        this.setData({
          shippingCarInfo: {}
        })
        wx.vibrateShort({
          type: 'medium'
        })
        this.hideCartPop()
        this.getTrolley()
      }
    })
  },
  /**
   * 获取购物车数据
   */
  getTrolley() {
    http.request({
      url: "/cart",
      method: "GET",
      callBack: result => {
        console.log(result);
        var price = 0
        result.data.forEach(e => {
          price += e.sku.price * e.quantity
        })
        var shippingCarInfo = {
          number: result.data.length,
          price: price.toFixed(2),
          items: result.data
        }
        this.setData({
          shippingCarInfo: shippingCarInfo
        })
        this.processBadge()
      }
    })
  },
  onCounterChange(e) {
    this.setData({
      selectNumber: e.detail
    })
    console.log(this.data.selectNumber);
  },
  /**
   * 结算
   */
  goPay() {
    this.setData({
      shippingCarInfo: false,
      showCartPop: false
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
        if (ele.product.categoryId) {
          const category = categories.find(a => {
            return a.id == ele.product.categoryId
          })

          if (category) {
            category.badge += ele.number
          }

        }
        if (ele.product.id) {
          const _goods = goods.find(a => {
            return a.id == ele.product.id
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
  selectshop() {
    wx.navigateTo({
      url: '/pages/shop/select?type=index',
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

    this.getTrolley()
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