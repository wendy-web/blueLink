var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
// pages/shouye/pintuan/ptOrder/ptOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    xianshow : true,
    titleshow : true,
    info : '',
    pick_class: '',
    express_class: '',
    discount : '',
    isClose: true,
    address: '',
    pickAddress: '',
    huoAddress: '',
    allPrice: '',
    allInfo: '',
    endPrice: '',
    freight : null,
    _freight : null,
    payType: [
      {
        id: 0,
        name: '微信支付',
        type: 'wechat',
        imgSrc: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/wechatPay.png',
        checked: false
      },
      {
        id: 1,
        name: '余额支付',
        type: 'credit',
        imgSrc: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/yue_ldw.png',
        checked: false
      }
    ],
    goodsid : '',
    takeid : '',
    id : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsid: options.goodsid,
      id : options.id
    });
    this.getOrderInfo();
  },

  getOrderInfo: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    })
    e.get('/take/create', {
      goodsid : this.data.goodsid
    }, res => {
      wx.hideLoading();
      console.log(res);
      if (res.status == 0) {
        wx.showModal({
          title: '提示',
          content: res.result.message,
          success(res) {
            if (res.confirm) {
              wx.navigateBack()
            } else if (res.cancel) {
              wx.navigateBack()
            }
          }
        })
      }

      that.setData({
        info: res.goods,
        endPrice: res.goods.marketprice,
        discount: res.discount,
        takeid: res.take_id
      });
      //满十元免运费
      if (Number(res.goods.marketprice) >= 10){
        that.setData({
          freight:0
        });
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

  //选择支付
  checkboxChange: function (e) {
    // console.log(e);
    var _index = e.currentTarget.dataset.index;
    console.log(_index);
    var _payType = this.data.payType;
    _payType.forEach(item => {
      if (_index == item.id) {
        if (item.checked) {
          item.checked = false
        } else {
          item.checked = true
        }
      } else {
        item.checked = false
      }
    });
    this.setData({
      payType: _payType
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //支付
  gotoPay: function () {
    var _payType = this.data.payType;
    var d = this.data;
    var data = {
      paytype: '',                        //支付类型
      pick_type: '',                        //提货方式
      addressid : '',                       //地址id
      pick_id : '',                         //提货网点、活动网点
      goodsid: this.data.goodsid,                    //商品id
    }
    console.log(_payType);
    // return
    //判断是否选中支付方式
    for (var i = 0; i < _payType.length; i++) {
      if (_payType[i].checked) {
        if (_payType[i].type == 'wechat'){
          data.paytype = 1
        }else{
          data.paytype = 2
        }
        // data.paytype = _payType[i].type;
        break
      }
      else {
        wx.showToast({
          title: '请选择支付方式',
          icon: 'none',
          duration: 2000
        })
      }
    }

    if (!this.data.address && !this.data.pickAddress && !this.data.huoAddress) {
      wx.showToast({
        title: '请选择提货方式',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (this.data.address) {
      data.pick_type = 1;
      data.addressid = this.data.address.id;
    } else if (this.data.pickAddress) {
      data.pick_type = 2;
      data.pick_id = this.data.pickAddress.id;
    } else {
      data.pick_type = 3;
      data.pick_id = this.data.huoAddress.id;
    }
    console.log(data);
    // return
    //支付方式和提货方式有了就调接口，缺一个下面操作不执行
    if (data.paytype && data.pick_type) {
      // console.log('支付');
      wx.showLoading({
        title: '加载中',
        icon: 'loading'
      })
      //这个接口如果是微信支付的话是获取时间戳秘钥等配置信息，反之则直接余额支付
      e.post('/take/create/submit', data, res => {
        wx.hideLoading();
        console.log(res);
        var orderid = res.order.orderid;
        // return
        if (data.paytype == 1) {
          // console.log(res);
          if (res.error == 0) {
            //微信支付
            wx.requestPayment(
              {
                'timeStamp': res.wechat.payinfo.timeStamp,
                'nonceStr': res.wechat.payinfo.nonceStr,
                'package': res.wechat.payinfo.package,
                'signType': res.wechat.payinfo.signType,
                'paySign': res.wechat.payinfo.paySign,

                'success': function (res) {
                  console.log(res);
                  // wx.showToast({
                  //   title: '支付成功',
                  // })
                  //判断是发起的还是参与的
                  e.get('/take/create/check_pay',{
                    goodsid : d.goodsid,
                    orderid : orderid,
                    take_id : d.takeid,
                    price : d.allPrice
                  },res=>{
                    console.log(res);
                    if(res.take_record.take_type == 0){
                      wx.navigateTo({
                        url: '/pages/shouye/gratis_jie/free/invitation/invitation?take_id=' + res.take_record.take_id + '&price=' + d.allPrice + '&id=' + d.id,
                      })
                    }
                  })
                  // wx.navigateTo({
                  //   url: '/pages/shouye/gratis_jie/free/invitation/invitation',
                  // })
  
                },
                'fail': function (res) {
                  wx.showToast({
                    title: '支付失败',
                  })
                  console.log('fail:' + JSON.stringify(res));
                },
                'complete': function (res) { }
              }
            );
          } else {
            // wx.showToast({
            //   title: res.result.message,
            // })
            // e.get('/groups/orders/order_chack', {
            //   orderid: res.result.order.orderid
            // }, i => {
            //   console.log(i);
              
            // })
          }
        } else {
          console.log(res);
          if (res.error != 0) {
            //余额支付失败
            wx.showToast({
              title: res.message,
            })
          } else {
            //余额支付成功
            wx.showToast({
              title: res.message,
            });
            if(res.take_record.take_type == 0){
              //发起的，去分享页面
              wx.navigateTo({
                url: '/pages/shouye/gratis_jie/free/invitation/invitation?take_id=' + res.take_record.take_id + '&price=' + d.allPrice +'&id=' + d.id,
              })
            }else{
              //参与的，去订单页面
            }
          }
        }
      });
    }




    // wx.navigateTo({
    //   url: '/pages/shouye/pintuan/pt_invitation/py_invitation',
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var pickAddress, address, huoAddress;
    console.log(this.data.index);
    if (this.data.index == 1) {
      //提货点返回的
      pickAddress = t.getCache('pickAddress');
      address = '';
      huoAddress = '';
    }
    else if (this.data.index == 0) {
      //快递地址返回的
      address = t.getCache("orderAddress");
      pickAddress = '';
      huoAddress = '';
    } else if(this.data.index == 2) {
      //线下活动点返回的
      address = '';
      pickAddress = '';
      huoAddress = t.getCache('huoAddress');
    }else{

    }

    if (address != ""){
      if (Number(this.data.info.marketprice)>=10){
        this.setData({
          freight : 0,
          allPrice: this.data.info.marketprice
        })
      }else{
        this.setData({
          freight: this.data.discount.freight,
          allPrice: Number(this.data.info.marketprice) + Number(this.data.discount.freight)
        })
      }
    } else {
      this.setData({
        freight: 0,
        allPrice: this.data.info.marketprice
      })
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