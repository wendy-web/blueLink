var t = getApp(), e = t.requirejs("core"), i = t.requirejs("biz/order");
Page({
  data: {
    code: !1,
    consume: !1,
    store: !1,
    cancel: i.cancelArray,
    cancelindex: 0,
    diyshow: {}
  },
  onLoad: function (e) {
    this.setData({
      options: e
    }),
      t.url(e), this.get_list();
  },
  onShow: function () {

    var address;
    //快递地址返回的
    address = t.getCache("orderAddress");
    if (!address) {
      return
    }
    //修改地址 返回来的获取的地址id
    var orderid = this.data.order.id;
    if (!orderid){
      return
    }
    e.get('order/order_address', {
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
      // show: false
    })
  },
  get_list: function () {
    var t = this;
    e.get("order/detail", t.data.options, function (i) {
      // console.log(i);
      0 == i.error ? (i.show = !0, t.setData(i)) : (5e4 != i.error && e.toast(i.message, "loading"), wx.redirectTo({
        url: "pages/order/index"
      }))
    })
  },
  code: function (t) {
    var i = this,
      a = e.data(t).orderid;
    e.post("verify/qrcode", {
      id: a
    }, function (t) {
      0 == t.error ? i.setData({
        code: !0,
        qrcode: t.url
      }) : e.alert(t.message)
    }, !0)
  },
  diyshow: function (t) {
    var i = this.data.diyshow,
      a = e.data(t).id;
    i[a] = !i[a],
      this.setData({
        diyshow: i
      })
  },
  close: function () {
    this.setData({
      code: !1
    })
  },
  toggle: function (t) {
    var i = e.pdata(t),
      a = i.id,
      o = i.type,
      n = {};
    n[o] = 0 == a || void 0 === a ? 1 : 0,
      this.setData(n)
  },
  phone: function (t) {
    e.phone(t)
  },
  cancel: function (t) {
    i.cancel(this.data.options.id, t.detail.value, "/pages/order/detail/index?id=" + this.data.options.id)
  },
  delete: function (t) {
    var a = e.data(t).type;
    i.delete(this.data.options.id, a, "/pages/order/index")
  },
  finish: function (t) {
    i.finish(this.data.options.id, "/pages/order/index")
  },
  refundcancel: function (t) {
    var e = this;
    i.refundcancel(this.data.options.id, function () {
      e.get_list()
    })
  },
  onShareAppMessage: function () {
    return e.onShareAppMessage()
  },
  //复制
  fuzhhi:function(t){
    var ordersn = e.pdata(t).ordersn;
    wx.setClipboardData({
      data: ordersn,
      success(res) {
        wx.getClipboardData({
          success(res) {
            // console.log(res.data) // data
          }
        })
      }
    })
  },
  //修改地址
  address:function(){
    this.setData({
      // pickAddress : '',
      isClose: false
    });
    wx.navigateTo({
      url: '/pages/member/address/select',
    })
  },
  //催发货
  cuifa:function(){
    //修改地址 返回来的获取的地址id
    var orderid = this.data.order.id;
    e.get('order/urge_delivery', {
      orderid: orderid
    }, res => {
      // console.log(res);
      var title = res.result.message;
      wx.showToast({
        title: title,
        icon: 'success',
        duration: 2000
      })
    })
  }
})