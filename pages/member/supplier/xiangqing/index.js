var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    pick_class: '',
    express_class: '',
    isClose: true,
    address: '',
    pickAddress: '',
    allPrice: '',
    allInfo: '',
    endPrice: '',
    deduction: [
      {
        id: 0,
        title: 'VIP消费卡：抵扣 ￥',
        price: '',
        checked: false,
        type: 2
      }
    ],
    payType: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var c = this;
    c.setData({
      orderid:options.orderid
    })
    // console.log(options);

    this.getOrderInfo();
  },

  getOrderInfo: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    })
    var orderid = that.data.orderid;
    e.get('supplier/order/detail', {
      orderid: orderid
    }, res => {
      wx.hideLoading();
      // console.log(res);
      if (res.result.order.goodsprice > 200) {
        that.setData({
          total_price: res.result.order.goodsprice, //商品总金额
          endPrice: res.result.order.goodsprice
        })
      } else {
        that.setData({
          total_price: res.result.order.goodsprice, //总金额
          endPrice: res.result.order.price
        })
      }
      that.setData({
        // allInfo: res.result,
        // allPrice: allPrice,
        // endPrice: allPrice,
        // deduction: _deduction
        // address: res.address,
        goods: res.result.goods,
        pay_price: res.result.order.price, //实付金额 
        // total_deduct_vip: res.total_deduct_vip, //总抵扣金额
        discount: res.result.order.freight, //运费 //满额免邮
        address: res.result.order.address, //地址
        ordersn: res.result.order.ordersn, //订单编号
        createtime: res.result.order.ordersn,//下单时间
        refundstate: res.result.order.refundstate, // 0未申请退货 1已申请退货
        status: res.result.order.status, //1待发货 2已发货
        id:res.result.order.id //订单id
      });
      //判断是微信支付还是余额支付
      if (res.result.order.paytype==1){ //微信支付
        var payType = [
          {
            id: 0,
            name: '微信支付',
            type: '1',
            imgSrc: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/wechatPay.png',
            checked: true,

          }
        ];
        that.setData({
          payType: payType
        })
      }else{ //余额支付
        var payType = [
          {
            id: 1,
            name: '余额支付',
            type: '2',
            imgSrc: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/yue_ldw.png',
            checked: true
          }
        ];
        that.setData({
          payType: payType
        })
      }

    });
  },
  //选择地址
  address: function () {
    this.setData({
      // pickAddress : '',
      isClose: false
    });
    wx.navigateTo({
      url: '/pages/member/address/select',
    })
  },
  // 选择抵扣
  // check: function (e) {
  //   // console.log(e);
  //   var that = this;
  //   var _price = e.currentTarget.dataset.price; //总金额
  //   var _deduction = this.data.deduction;
  //   var _endPrice = this.data.endPrice;
  //   _deduction.forEach(item => {
  //     if (item.checked) {
  //       item.checked = false;
  //       _price = e.currentTarget.dataset.price;
  //     } else {
  //       item.checked = true;
  //       var total_deduct_vip = that.data.total_deduct_vip; //抵扣金额
  //       var jiage = Number(_price) - Number(total_deduct_vip)
  //       _price = jiage > 0 ? jiage : _price;
  //     }

  //   });
  //   this.setData({
  //     deduction: _deduction,
  //     endPrice: _price
  //   });
  //   console.log(this.data.deduction);
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //复制
  fuzhi:function(c){
    var fuzhi=  e.pdata(c).fuzhi;
    wx.setClipboardData({
      data: fuzhi,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  //修改地址
  // xiugai:function(){
  //   var orderid = this.data.orderid
  //   e.get('supplier/order/urge_delivery', {
  //     orderid: orderid
  //   }, res => {
  //     console.log(res);
  //     var title = res.result.message;
  //     wx.showToast({
  //       title: title,
  //       icon: 'success',
  //       duration: 2000
  //     })
  //   })
  // },
  //再次购买
  zaigou:function(){
    wx.navigateTo({
      url: '/pages/member/supplier/index',
    })
  },
  //催发货
  zuifahuo:function(){
    var orderid = this.data.orderid;
    e.get('supplier/order/urge_delivery', {
      orderid: orderid,
    }, res => {
      // console.log(res);
      var title = res.result.message;
      wx.showToast({
        title: title,
        icon: 'success',
        duration: 2000
      })
    })
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var address;
      //快递地址返回的
      address = t.getCache("orderAddress");
    if (!address){
        return
      }
      //修改地址 返回来的获取的地址id
      var orderid = this.data.orderid;
      e.get('supplier/order/order_address', {
        orderid: orderid,
        addressid: address.id
      }, res => {
        // console.log(res);
        var title = res.result.message;
        wx.showToast({
          title: title,
          icon: 'success',
          duration: 2000
        })
      })

    var express_class = address ? true : false;
    this.setData({
      address: address,
      express_class: express_class,
      show: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.isClose) {
      console.log('重新打开')
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    setTimeout(function () {
      that.setData({ isClose: true })
    }, 200)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})