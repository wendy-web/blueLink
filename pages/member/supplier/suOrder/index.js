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
    payType: [
      {
        id: 0,
        name: '微信支付',
        type: '1',
        imgSrc: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/wechatPay.png',
        checked: false,

      },
      {
        id: 1,
        name: '余额支付',
        type: '2',
        imgSrc: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/yue_ldw.png',
        checked: false
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   _id: options.id,
    //   _optionid: options._optionid,
    //   _type: options._type,
    //   _heads: options._heads,
    //   _share_mid: options.share_mid,
    //   _teamid: options.teamid
    // });
    // console.log(options);
    this.getOrderInfo();
  },

  getOrderInfo: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    })
    e.get('supplier/create', {
      // heads: that.data._heads,
      // type: that.data._type,
      // id: that.data._id,
      // teamid: that.data._teamid,
      // optionid: that.data._optionid,
      // share_mid: that.data._share_mid
    }, res => {
      wx.hideLoading();
      console.log(res);
      // if (res.status == 0) {
      //   wx.showModal({
      //     title: '提示',
      //     content: res.result.message,
      //     success(res) {
      //       if (res.confirm) {
      //         wx.navigateBack()
      //       } else if (res.cancel) {
      //         wx.navigateBack()
      //       }
      //     }
      //   })
      // }
      // var _deduction = that.data.deduction;
      // _deduction.forEach(item => {
      //   if (item.id == 0) {
      //     item.price = res.result.goods.deduct;
      //   }
      //   else {
      //     item.price = res.result.goods.deduct_vip;
      //   }
      // });
      // var allPrice = Number(res.result.goods.freight) + Number(res.result.price);
      // var heji = parseFloat(res.pay_price) + parseFloat(res.discount.freight)
      if (res.total_price>200){
        that.setData({
          total_price: res.total_price, //商品总金额
          endPrice: res.pay_price 
        })
      }else{
        that.setData({
          total_price: res.total_price, //总金额
          endPrice: res.pay_price
        })
      }
      that.setData({
        // allInfo: res.result,
        // allPrice: allPrice,
        // endPrice: allPrice,
        // deduction: _deduction
        // address: res.address,
        goods: res.goods,
        pay_price: res.pay_price, //实付金额 
        total_deduct_vip: res.total_deduct_vip, //总抵扣金额
        discount: res.discount, //运费 //满额免邮
      });
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
  // 商家备注
  myevent:function(e){
    console.log(e.detail)
    var remark = e.detail;
    this.setData({
      remark: remark
    })
  },
  // 选择抵扣
  check: function (e) {
    console.log(e);
    var that = this;
    var _price = e.currentTarget.dataset.price; //总金额
    var _deduction = this.data.deduction;
    var _endPrice = this.data.endPrice;
    _deduction.forEach(item => {
        if (item.checked) {
          item.checked = false;
          _price = e.currentTarget.dataset.price;
        } else {
          item.checked = true;
          var total_deduct_vip = that.data.total_deduct_vip; //抵扣金额
          var jiage = Number(_price) - Number(total_deduct_vip) 
          _price = jiage > 0 ? jiage : _price;
        }
  
    });
    this.setData({
      deduction: _deduction,
      endPrice: _price
    });
    console.log(this.data.deduction);
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
    // console.log(this.data.payType)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  gotoping:function(){
    wx.navigateTo({
      url: '/pages/member/supplier/index',
    })
  },
  //支付
  gotoPay: function () {
    var _payType = this.data.payType;
    var remark = this.data.remark;
    var data = {
      paytype: '',                        //支付类型 （1微信 2余额）
      addressid: '',                        //地址id
      deduct_type: '',                     //折扣
      remark: remark,   //商家备注
    }
    console.log(_payType)
    //判断是否选中支付方式
    for (var i = 0; i < _payType.length; i++) {
    //   console.log(_payType[i].checked);
      if (_payType[i].checked) {
          data.paytype = _payType[i].type;
      }
    }
    if (!data.paytype){
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 选择地址
    if (!this.data.address) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (this.data.address) {
      // data.pick_type = 1;
      data.addressid = this.data.address.id;
    } 
    // 折扣方式
    for (var i = 0; i < this.data.deduction.length; i++) {
      if (this.data.deduction[i].checked) {
        data.deduct_type = 1;

      }else{
        data.deduct_type = 0;
      }
    }
    e.post('supplier/create/submit', data, res => {

      // console.log(res);
      // return
      if (data.paytype == '1') {
        // console.log(res);
        if (res.error == 0) {
          var orderid = res.order.orderid;
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
                wx.showToast({
                  title: '支付成功',
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/member/supplier/dingdanzhifu/index?orderid=' + orderid,
                  })
                }, 2000)
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/member/supplier/index',
                  })

                }, 2000)
                console.log('fail:' + JSON.stringify(res));
              },
              'complete': function (res) { }
            }
          );
        } else {
          wx.showToast({
            title: res.message,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/member/supplier/index',
            })

          }, 2000)
        }
      } else {
        console.log(res);
        // return;
       
        if (res.error == 0) {
          var orderid = res.order.orderid;
          //余额支付成功
          wx.showToast({
            title: res.message,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/member/supplier/dingdanzhifu/index?orderid=' + orderid,
            })

          }, 2000)
        } else {
          //余额支付失败
          wx.showToast({
            title: res.message,
          });
          setTimeout(function(){
            wx.navigateTo({
              url: '/pages/member/supplier/index',
            })
            
          },2000)
        }
      }
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var pickAddress, address;
    console.log(this.data.index);
    if (this.data.index == 1) {
      //提货点返回的
      pickAddress = t.getCache('pickAddress');
      address = '';
    }
    else if (this.data.index == 0) {
      //快递地址返回的
      address = t.getCache("orderAddress");
      pickAddress = '';
    } else {
      address = t.getCache("orderAddress");
      pickAddress = t.getCache('pickAddress');
    }
    var pick_class = pickAddress ? true : false;
    var express_class = address ? true : false;
    this.setData({
      address: address,
      pickAddress: pickAddress,
      pick_class: pick_class,
      express_class: express_class,
      show:false
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