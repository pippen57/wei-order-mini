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
    popupShow:false,
    popupTrolleyShow:false,
    totalCartCount: 0,
    popupObj:{},
    // 购物车数据
    trolleyList:[{
        id:"221111",
        productName:"臊子面",
        pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
        imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
        point:"",
        count:1,
        price:"15",
        sold_num:"834"
    },{
        id:"221112",
        productName:"老陕炸酱面",
        pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
        imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
        point:"",
        count:1,
        price:"14",
        sold_num:"894"
    },{
        id:"221113",
        productName:"油泼面",
        pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
        imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
        point:"",
        count:1,
        price:"9.9",
        sold_num:"1894"
    },{
        id:"221111",
        productName:"臊子面",
        pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
        imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
        point:"",
        count:1,
        price:"15",
        sold_num:"834"
    },{
        id:"221112",
        productName:"老陕炸酱面",
        pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
        imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
        point:"",
        count:1,
        price:"14",
        sold_num:"894"
    },{
        id:"221113",
        productName:"油泼面",
        pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
        imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
        point:"",
        count:1,
        price:"9.9",
        sold_num:"1894"
    }],
    // 接口返回的商品数组
    navList: [{
        id:'11223',
        categoryName:"拌面",
        children:[{
            id:"221111",
            productName:"臊子面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point:"",
            count:1,
            price:"15",
            sold_num:"834"
        },{
            id:"221112",
            productName:"老陕炸酱面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point:"",
            count:1,
            price:"14",
            sold_num:"894"
        },{
            id:"221113",
            productName:"油泼面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point:"",
            count:1,
            price:"9.9",
            sold_num:"1894"
        }
        ]
    },
    {
        id:'11224',
        categoryName:"汤面",
        children:[{
            id:"112241",
            productName:"特色酸汤面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point:"",
            count:1,
            price:"9",
            sold_num:"834"
        },{
            id:"112242",
            productName:"酱香牛肉汤面",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point:"",
            count:1,
            price:"18",
            sold_num:"894"
        }
        ]
    },
    {
        id:'11225',
        categoryName:"小吃",
        children:[{
            id:"112251",
            productName:"老陕酱牛肉",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point:"",
            count:1,
            price:"29",
            sold_num:"834"
        },{
            id:"112252",
            productName:"凉皮",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point:"",
            count:1,
            price:"7",
            sold_num:"594"
        },{
            id:"112252",
            productName:"牛肉馅饼",
            pic: "https://peng.pippen.top/wei-order/20221011/f57b64e2e7fa4e9cb659713ac2452b23.jpeg",
            imgs:"https://peng.pippen.top/wei-order/20221011/cf726f84b91a4a19a80619a34860cf79.jpeg",
            point:"",
            count:1,
            price:"5",
            sold_num:"394"
        }
        ]
    }
    ],


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
  // 获取系统的高度信息
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight / 2
      }
    })
  },
  onCounterChange(e){
    this.data.popupObj.count= e.detail.count
    this.setData({
        popupObj: this.data.popupObj
    })
  },
  onOut(){
    wx.showToast({
      title: '超出限制',
    });
  },
  /**
   * 查看商品详情
   */
  onCategory(e){
      console.log(e);
    this.setData({
        popupObj:e.currentTarget.dataset.select,
        popupShow:true
    })
  },
  /**
   * 添加购物车
   */
  addShoppingTrolley(e){
    console.log(e.currentTarget.dataset.add);
    this.data.totalCartCount++
    console.log(this.data.totalCartCount);
    this.data.trolleyList.push(e.currentTarget.dataset.add)
    this.setData({
        totalCartCount: this.data.totalCartCount++,
        popupShow:false,
        trolleyList: this.data.trolleyList
    })
  },
  /**
   * 点击购物车
   */
  onTrolley() {
    this.setData({
        popupTrolleyShow:true
    })
  },
  /**
   * 结算
   */
  onGoCloseAccount(){
    wx.navigateTo({
        url: '/pages/order/order',
        success: function(res) {
          // 通过 eventChannel 向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
        }
      })
  }

})
