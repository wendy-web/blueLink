 //作者YIFU YUANMA
var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t
  } :
  function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
  },
  e = getApp(),
  a = e.requirejs("core"),
  i = e.requirejs("foxui"),
  d = e.requirejs("biz/diyform"),
  r = e.requirejs("jquery");
Page({
  data: {
    icons: e.requirejs("icons"),
    list: {},
    goodslist: {},
    data: {
      dispatchtype: 0 
    },
    showPicker: !1,
    pvalOld: [0, 0, 0],
    pval: [0, 0, 0],
    areas: [],
    noArea: !0,
    xianshow:true,
    titleshow:false,
    index: '',
    pick_class: '',
    express_class: '',
    huo_class: '',
    isClose: true,
    address: '',
    pickAddress: '',
    huoAddress:''
  },
  onLoad: function(t) {
    console.log(t);
    var i = this,
      d = {};
      console.log(t)
    if (t.bargainid){
        this.setData({
          bargain: t.bargainid,
        })
    }
    if (t.exchangepostage){
     let allmoney =  (t.exchangepostage*100 + t.exchangeprice*100)/100
       i.setData({
         allmoney: allmoney
       })
    }else{
      let allmoney = t.exchangeprice
      i.setData({
        allmoney: allmoney
      })
    }
    this.setData({
        options: t,
        areas: e.getCache("cacheset").areas,
      }),
      e.url(t),
      a.get("order/create", i.data.options, function(t) {
      if (i.data.options.totalex==1){
        var nowmoney = t.realprice;
      }else{
        var nowmoney = t.exchangecha - i.data.options.exchangeprice;
      }
      console.log(t);
        0 == t.error ? (r.each(t.goods, function(t, e) {
          r.each(e.goods, function(t, e) { //cc_zhong 修复同一产品不同规格进购物车后只算一个商品的bug
            d[e.id + '_' + t] = e
          })
        }), i.setData({
          list: t,
          show: !0,
          goodslist: d,
          nowmoney: nowmoney,
          diyform: {
            f_data: t.f_data,
            fields: t.fields
          }
        }), e.setCache("goodsInfo", {
          goodslist: d,
          merchs: t.merchs
        }, 1800)) : (a.toast(t.message, "loading"), setTimeout(function() {
          wx.navigateBack()
        }, 1e3))
      }),
      e.setCache("coupon", "");
  },
  onShow: function() {
    //选择地址返回的，接收的参数
    var pickAddress, address, huoAddress;
    console.log(this.data.index);
    if (this.data.index == 1) {
      //提货点返回的
      pickAddress = e.getCache('pickAddress');
      address = '';
      huoAddress = '';
    }else if (this.data.index == 0) {
      //快递地址返回的
      address = e.getCache("orderAddress");
      pickAddress = '';
      huoAddress = '';
    } else {
      address = '';
      pickAddress = '';
      huoAddress = e.getCache('huoAddress');
    }
    var pick_class = pickAddress ? true : false;
    var express_class = address ? true : false;
    var huo_class = huoAddress ? true : false
    this.setData({
      address: address,
      pickAddress: pickAddress,
      huoAddress: huoAddress,
      pick_class: pick_class,
      express_class: express_class,
      huo_class: huo_class
    })


    var i = this,
      d = e.getCache("orderAddress"),
      s = e.getCache("orderShop");
    d && (
        this.setData({
          "list.address": d
        }),
        i.caculate(i.data.list)),

      s && this.setData({
        "list.carrierInfo": s
      });

    var o = e.getCache("coupon");

    "object" == (void 0 === o ? "undefined" : t(o)) && 0 != o.id ?
      (this.setData({
        "data.couponid": o.id,
        "data.couponname": o.name
      }), a.post("order/create/getcouponprice", {
        couponid: o.id,
        goods: this.data.goodslist,
        goodsprice: this.data.list.goodsprice,
        discountprice: this.data.list.discountprice,
        isdiscountprice: this.data.list.isdiscountprice
      }, function(t) {
        0 == t.error ? (delete t.$goodsarr, i.setData({
          coupon: t
        }), i.caculate(i.data.list)) : a.alert(t.message)
      }, !0)) : (this.setData({
        "data.couponid": 0,
        "data.couponname": null,
        coupon: null
      }), r.isEmptyObject(i.data.list) || i.caculate(i.data.list))

    
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
  //提货点
  pickUpPoint: function () {
    this.setData({
      // address: '',
      isClose: false
    });
    wx.navigateTo({
      url: '/pages/shouye/pick_up_point/pick_up_point',
    })
  },
  // 线下活动点
  pickUpWang: function () {
    this.setData({
      // address: '',
      isClose: false
    });
    wx.navigateTo({
      url: '/pages/shouye/huo_dong_dian/index',
    })
  },
  toggle: function(t) {
    var e = a.pdata(t),
      i = e.id,
      d = e.type,
      r = {};
    r[d] = 0 == i || void 0 === i ? 1 : 0,
      this.setData(r)
  },
  phone: function(t) {
    a.phone(t)
  },
  dispatchtype: function(t) {
    var e = a.data(t).type;
    this.setData({
        "data.dispatchtype": e
      }),
      this.caculate(this.data.list)
  },
  number: function(t) {
    var e = this,
      d = a.pdata(t),
      s = i.number(this, t),
      o = d.id,
      c = e.data.list,
      n = e.data.goodslist,
      u = 0,
      l = 0;
    r.each(c.goods, function(t, e) {
        r.each(e.goods, function(e, a) {
          a.id == o && (c.goods[t].goods[e].total = s, n[o].total = s),
            u += parseInt(c.goods[t].goods[e].total),
            l += parseFloat(u * c.goods[t].goods[e].price)
        })
      }),
      c.total = u,
      c.goodsprice = l,
      e.setData({
        list: c,
        goodslist: n
      }),
      this.caculate(c);
  },
  caculate: function(t) {
    var e = this;
    var s = {
      goods: this.data.goodslist,
      dflag: this.data.data.dispatchtype,
      addressid: this.data.list.address ? this.data.list.address.id : 0,
      pick_type:0,
      pick_id:0,
    }
    // function(a) {
    //   t.dispatch_price = a.price,

    //   // addressid: this.data.list.address ? this.data.list.address.id : 0
    // };
    console.log(this.data.address);
    console.log(this.data.pickAddress);
    console.log(this.data.huoAddress);
    if (this.data.address) {
      s.pick_type = 1;
      s.addressid = this.data.address.id;
    } else if (this.data.pickAddress) {
      s.pick_type = 2;
      s.pick_id = this.data.pickAddress.id;
    } else {
      s.pick_type = 3;
      s.pick_id = this.data.huoAddress.id;
    }
    console.log(s);
    a.post("order/create/caculate", s, function(a) {
        t.dispatch_price = a.price,
        t.enoughdeduct = a.deductenough_money,
        t.enoughmoney = a.deductenough_enough,
        t.taskdiscountprice = a.taskdiscountprice,
        t.discountprice = a.discountprice,
        t.isdiscountprice = a.isdiscountprice,
        e.data.data.deduct && (a.realprice -= a.deductcredit),
        e.data.data.deduct2 && (a.realprice -= a.deductcredit2),
        e.data.coupon && void 0 !== e.data.coupon.deductprice && (a.realprice -= e.data.coupon.deductprice),
        t.realprice = a.realprice,
        e.setData({
          list: t
        })
    }, !0)
  },
  submit: function() {
    var t = this.data,
      e = this,
      i = this.data.diyform;
    if (!t.submit) {
      if (d.verify(this, i)) {
        t.list.carrierInfo = t.list.carrierInfo || {};
        if (e.options.exchangepostage){
          var exchange=1
        }else{
           var exchange=0
        }
        
        var s = {
          id: t.options.id ? t.options.id : 0,
          goods: t.goodslist,
          giftid: "",
          gdid: t.options.gdid,
          dispatchtype: t.data.dispatchtype,
          fromcart: t.list.fromcart,
          carrierid: 1 == t.data.dispatchtype && t.list.carrierInfo ? t.list.carrierInfo.id : 0,
          // addressid: t.list.address ? t.list.address.id : 0,
          carriers: 1 == t.data.dispatchtype || t.list.isvirtual || t.list.isverify ? {
              carrier_realname: t.list.member.realname,
              carrier_mobile: t.list.member.mobile,
              realname: t.list.carrierInfo.realname,
              mobile: t.list.carrierInfo.mobile,
              storename: t.list.carrierInfo.storename,
              address: t.list.carrierInfo.address
            } :
            "",
          bargainid: e.data.bargain,
          remark: t.data.remark,
          deduct: t.data.deduct ? t.data.deduct : t.data.deduct2 ,
          // deduct2: t.data.deduct2,
          couponid: t.data.couponid,
          invoicename: t.list.invoicename,
          bargain_id: t.list.goods,
          submit: !0,
          packageid: t.list.packageid,
          diydata: t.diyform.f_data,
          exchangepostage: t.options.exchangepostage,
          exchangeprice: t.options.exchangeprice,
          exchange: exchange
        };
        // 判断是否同时选择抵扣
        if (t.data.deduct == 1 && t.data.deduct2==2 ){
          wx.showToast({
            title: '不能同时选择两种抵扣方式',
            icon: 'none',
            duration: 2000
          })
          return
        }

        if (1 == t.data.dispatchtype || t.list.isvirtual || t.list.isverify) {
          if ("" == r.trim(t.list.member.realname))
            return void a.alert("请填写联系人!");
          if ("" == r.trim(t.list.member.mobile))
            return void a.alert("请填写联系方式!");
          // s.addressid = 0
        } else if (!this.data.address && !this.data.pickAddress && !this.data.huoAddress) {
          wx.showToast({
            title: '请选择提货方式',
            icon: 'none',
            duration: 2000
          })
          return
        } else if (this.data.address) {
          s.pick_type = 1;
          s.addressid = this.data.address.id;
        } else if (this.data.pickAddress) {
          s.pick_type = 2;
          s.pick_id = this.data.pickAddress.id;
        }else{
          s.pick_type = 3;
          s.pick_id = this.data.huoAddress.id;
        }
        
        // else if (!s.addressid)
        //   return void a.alert("地址没有选择!");
        //console.log(s);
        //return void a.alert("ddd!");
        e.setData({
            submit: !0
          }),
          a.post("order/create/submit", s, function(t) {
          if (t.status == -1) {
            return void a.confirm(t.result.message,function(){
              wx.redirectTo({
                url: "/pages/order/index"
              })
            })
          }else if(e.setData({
                submit: !1
              }), 0 != t.error)
              return void a.alert(t.message);
            wx.redirectTo({
              url: "/pages/order/pay/index?id=" + t.orderid
            })
          }, !0)
      }
    }
  },
  dataChange: function(t) {
    var e = this.data.data,
      a = this.data.list;
      console.log(e);
    switch (t.target.id) {
      case "remark":
        e.remark = t.detail.value;
        break;
      case "deduct":
        e.deduct = t.detail.value ? '1':0,
          a.realprice += t.detail.value ? -a.deductmoney : a.deductmoney;
        break;
      case "deduct2":
        e.deduct2 = t.detail.value ? '2': 0,
          a.realprice += t.detail.value ? -a.deductmoney_vip : a.deductmoney_vip
    }
    this.setData({
      data: e,
      list: a
    })
  },
  listChange: function(t) {
    var e = this.data.list;
    switch (t.target.id) {
      case "invoicename":
        e.invoicename = t.detail.value;
        break;
      case "realname":
        e.member.realname = t.detail.value;
        break;
      case "mobile":
        e.member.mobile = t.detail.value
    }
    this.setData({
      list: e
    })
  },
  url: function(t) {
    var e = a.pdata(t).url;
    wx.redirectTo({
      url: e
    })
  },
  onChange: function(t) {
    return d.onChange(this, t)
  },
  DiyFormHandler: function(t) {
    return d.DiyFormHandler(this, t)
  },
  selectArea: function(t) {
    return d.selectArea(this, t)
  },
  bindChange: function(t) {
    return d.bindChange(this, t)
  },
  onCancel: function(t) {
    return d.onCancel(this, t)
  },
  onConfirm: function(t) {
    return d.onConfirm(this, t)
  },
  getIndex: function(t, e) {
    return d.getIndex(t, e)
  }
})