var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({
  data: {
    index: '',
    pick_class: '',
    express_class : '',
    isClose: true,
    address: '',
    pickAddress : '',
    allPrice: '',
    allInfo: '',
    endPrice : '',
    deduction : [
      { 
        id: 0,
        title: '抵扣红包 ￥',
        price: '',
        checked: false,
        type : 1
      },
      {
        id:1,
        title: 'VIP消费卡：抵扣 ￥',
        price:'',
        checked: false,
        type : 2
      }
    ],
    payType : [
      {
        id:0,
        name : '微信支付',
        type: 'wechat',
        imgSrc: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/wechatPay.png',
        checked : false
      },
      {
        id:1,
        name: '余额支付',
        type: 'credit',
        imgSrc: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/yue_ldw.png',
        checked: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _id : options.id,
      _optionid: options._optionid,
      _type : options._type,
      _heads: options._heads,
      _share_mid: options.share_mid,
      _teamid : options.teamid
    });
    console.log(options._optionid);
    this.getOrderInfo();
  },

  getOrderInfo : function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    })
    console.log(that.data._optionid);
    console.log('--------')
    e.get('/groups/orders/confirm',{
      heads : that.data._heads,
      type : that.data._type,
      id : that.data._id,
      teamid: that.data._teamid,
      optionid : that.data._optionid,
      share_mid: that.data._share_mid
    },res=>{
      wx.hideLoading();
      console.log(res);
      console.log('------')
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
      var _deduction = that.data.deduction;
      _deduction.forEach(item=>{
        if(item.id == 0){
          item.price = res.result.goods.deduct;
        }
        else{
          item.price = res.result.goods.deduct_vip;
        }
      });
      var allPrice = Number(res.result.goods.freight) + Number(res.result.price);
      that.setData({
        allInfo : res.result,
        allPrice : allPrice,
        endPrice : allPrice,
        deduction: _deduction
      });
    });
  },
  //选择地址
  address : function(){
    this.setData({
      // pickAddress : '',
      isClose : false
    });
    wx.navigateTo({
      url: '/pages/member/address/select',
    })
  },

  //提货点
  pickUpPoint : function(){
    this.setData({
      // address: '',
      isClose: false
    });
    wx.navigateTo({
      url: '/pages/shouye/pick_up_point/pick_up_point',
    })
  },

  // 选择抵扣
  check: function(e){
    console.log(e);
    var _price = e.currentTarget.dataset.price;
    var _deduction = this.data.deduction;
    var _endPrice = this.data.endPrice;
   _deduction.forEach(item=>{
      if (e.currentTarget.dataset.id==item.id){
        if(item.checked){
          item.checked = false;
          _price = e.currentTarget.dataset.price;
        }else{
          item.checked = true;
          _price = _price - item.price < 0 ? 0 : _price - item.price;
        }
        console.log(item.price);
      }else{
        item.checked = false
      }
   });
    this.setData({
      deduction: _deduction,
      endPrice: _price
    });
    console.log(this.data.deduction);
  },
  //选择支付
  checkboxChange : function(e){
    // console.log(e);
    var _index = e.currentTarget.dataset.index;
    console.log(_index);
    var _payType = this.data.payType;
    _payType.forEach(item=>{
      if(_index == item.id){
        if(item.checked){
          item.checked = false
        }else{
          item.checked = true
        }
      }else{
        item.checked = false
      }
    });
    this.setData({
      payType : _payType
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //支付
  gotoPay:function(){
    var _payType = this.data.payType;
    var data = {
      paytype: '',                        //支付类型
      pick_type: '',                        //提货方式
      type : this.data._type,               //购买方式
      aid: '',                              //地址id
      partner_shop_id: '',                  //提货id
      heads: this.data._heads,              //团长标志
      id: this.data._id,                    //商品id
      optionid: this.data._optionid,        //商品规格id
      share_mid: this.data._share_mid,      //分享者id
      teamid : this.data._teamid,                          //参团id
      deduct_type : ''                      //折扣
    }

    //判断是否选中支付方式
    for(var i=0; i<_payType.length;i++){
      if(_payType[i].checked){
        data.paytype = _payType[i].type;
        break
      }
      else{
        wx.showToast({
          title: '请选择支付方式',
          icon: 'none',
          duration: 2000
        })
      }
    } 
    
    if(!this.data.address && !this.data.pickAddress){
      wx.showToast({
        title: '请选择提货方式',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.address){
      data.pick_type = 1;
      data.aid = this.data.address.id;
    }else{
      data.pick_type = 2;
      data.partner_shop_id = this.data.pickAddress.id;
    }
    for(var i=0; i<this.data.deduction.length;i++){
      if (this.data.deduction[i].checked){
        data.deduct_type = this.data.deduction[i].type;
        break;
      }
    }
    console.log(data);
    // return
    //支付方式和提货方式有了就调接口，缺一个下面操作不执行
    if (data.paytype && data.pick_type){
      // console.log('支付');
      wx.showLoading({
        title: '加载中',
        icon:'loading'
      })
      e.post('/groups/orders/confirm',data,res=>{
        wx.hideLoading();
        console.log(res);
        // return
        if (data.paytype =='wechat'){
          console.log(res);
          if(res.status == 1){
          //微信支付
            wx.requestPayment(
              {
                'timeStamp': res.result.wechat.payinfo.timeStamp,
                'nonceStr': res.result.wechat.payinfo.nonceStr,
                'package': res.result.wechat.payinfo.package,
                'signType': res.result.wechat.payinfo.signType,
                'paySign': res.result.wechat.payinfo.paySign,
                'success': function (rest) {
                  console.log(res);
                  wx.showToast({
                    title: '支付成功',
                  })
                  e.get('/groups/orders/order_chack', {
                    orderid: res.result.order.orderid
                  }, i => {
                    console.log(i);
                    if (data.type =='groups'){
                      // 开团的
                      if (i.status == 1) {
                        setTimeout(function () {
                          wx.navigateTo({
                            url: '/pages/shouye/pintuan/pt_invitation/py_invitation?orderid=' + res.result.order.orderid + '&teamid=' + res.result.order.teamid,
                          })
                        }, 500);
                      } else {
                        setTimeout(function () {
                          wx.navigateTo({
                            url: '/pages/shouye/pintuan/pt_success/pt_success?teamid=' + res.result.order.teamid,
                          })
                        }, 500);
                      }
                    }else{
                      //单独买的
                      setTimeout(() => {
                        wx.switchTab({
                          url: '/pages/shouye/index/index',
                        })
                      }, 1500);
                    }
                  })



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
          }else{
            wx.showToast({
              title: res.result.message,
            })
            e.get('/groups/orders/order_chack', {
              orderid: res.result.order.orderid
            }, i => {
              console.log(i);
              if (data.type == 'groups'){
                if (i.status == 1) {
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/shouye/pintuan/pt_invitation/py_invitation?orderid=' + res.result.order.orderid + '&teamid=' + res.result.order.teamid,
                    })
                  }, 500);
                } else {
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/shouye/pintuan/pt_success/pt_success?teamid=' + res.result.order.teamid,
                    })
                  }, 500);
                }
              }else{
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/shouye/index/index',
                  })
                }, 1500);
              }
            })
          }
        }else{
          console.log(res);
          if(res.status==0){
            //余额支付失败
            wx.showToast({
              title: res.result.message,
            })
          }else{
            //余额支付成功
            wx.showToast({
              title: res.result.message,
            });
            e.get('/groups/orders/order_chack',{
              orderid: res.result.order.orderid
            },i=>{
              console.log(data);
              if (data.type == 'groups') {
                if(i.status == 1){
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/shouye/pintuan/pt_invitation/py_invitation?orderid=' + res.result.order.orderid + '&teamid=' + res.result.order.teamid,
                    })
                  }, 500);
                }else{
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '/pages/shouye/pintuan/pt_success/pt_success?teamid=' + res.result.order.teamid,
                    })
                  }, 500);
                }
              }else{
                console.log('进来了');
                setTimeout(()=>{
                  wx.switchTab({
                    url: '/pages/shouye/index/index',
                  })
                },1500);
              }
            });
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
    var pickAddress, address;
    console.log(this.data.index);
    if(this.data.index == 1){
      //提货点返回的
      pickAddress = t.getCache('pickAddress');
      address = '';
    }
    else if(this.data.index == 0){
      //快递地址返回的
      address = t.getCache("orderAddress");
      pickAddress = '';
    }else{
      address = t.getCache("orderAddress");
      pickAddress = t.getCache('pickAddress');
    }
    var pick_class = pickAddress? true : false;
    var express_class = address? true : false;
    this.setData({
      address : address,
      pickAddress : pickAddress,
      pick_class: pick_class,
      express_class: express_class
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