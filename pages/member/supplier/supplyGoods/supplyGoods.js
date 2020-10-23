// pages/shouye/pintuan/pintuan.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery")), s = t.requirejs("wxParse/wxParse");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',  //屏幕高度
    heads: '',   //开团是1 参团是0
    showModalStatus: false,   //规格弹出框
    id: '',      //拼团商品id
    goods: '',     //拼团商品数据
    team_ing: '',     //拼团列表数据
    total_team_ing: '',   //拼团列表 多少人在拼团
    timeLeft: "",   // 剩下的时间（天时分秒）
    page: 1,
    list: '',   //购买记录列表
    goodsInfo: '', //商品规格
    attributeList: [],
    shopId: '',  //商品组合规格id
    str: '',
    shopType: '',  //商品购买类型  单独买or拼团买
    isfavorite: '',
    share_mid: ''     //分享者的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    var that = this;
    that.setData({
      id: options.id,
      team_ing: ''
    })
    // that.getRecord();
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.windowHeight);
        that.setData({
          height: res.windowHeight
        });
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!that.data.id) return;
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    });
    e.post("goods/get_detail",{ id: that.data.id }, res => {
        wx.hideLoading();
        // console.log(res.goods);
        var id = res.goods.id;
        // console.log(id)
        that.setData({
          goods: res.goods,
          price: res.goods.marketprice
        });
        s.wxParse("wxParseData", "html", res.goods.content, that, "5")
        that.getShopOption(id);
      })

  },
  //继续拼车
  onShowOption:function(){
    this.showBuyModal();
  },
  //立即拼车
  zhuangouwuche:function(){
    wx.navigateTo({
      url: '/pages/member/supplier/gouwuche/index'
    })
  },
  showBuyModal() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      /**
        * http://cubic-bezier.com/ 
        * linear 动画一直较为均匀
        * ease 从匀速到加速在到匀速
        * ease-in 缓慢到匀速
        * ease-in-out 从缓慢到匀速再到缓慢
        * 
        * http://www.tuicool.com/articles/neqMVr
        * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
        * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
        */
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showModalStatus: true
    })
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
      })
      // console.log(this)
    }, 200)
  },

  hideBuyModal() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
      // console.log(this)
    }.bind(this), 200)
  },

  /**获取商品规格 */
  getShopOption: function (id) {

    if (!this.data.goodsInfo) {
      e.get('/goods/get_picker', {
        id: id
      }, res => {
        // console.log(res);
        if (res.specs.length==0){
          this.setData({
            wuguige: 1,
          })
        }
        res.specs.forEach(item => {
          // wx.hideLoading();
          item.items.forEach(i => {
            i.sele = false
          })
        });
        this.setData({
          goodsInfo: res,
        })
      })
    }
  },
  /**点击每一个规格修改选择状态 */
  sele: function (e) {
    var that = this;
    var _id = e.currentTarget.dataset.id;  //选中的规格id
    var _specs = e.currentTarget.dataset.specs;   //哪一种规格分类
    // console.log(_specs);
    var _goodsInfo = that.data.goodsInfo;
    // console.log(_goodsInfo);
    for (var i = 0; i < _goodsInfo.specs.length; i++) {
      if (_goodsInfo.specs[i].title === _specs.title) {
        for (var j = 0; j < _goodsInfo.specs[i].items.length; j++) {
          //判断点击的规格项
          if (_goodsInfo.specs[i].items[j].id == _id) {
            //已经选中的了就取消选中状态
            if (_goodsInfo.specs[i].items[j].sele) {
              _goodsInfo.specs[i].items[j].sele = false;
            } else {
              //如果未选就给选中状态
              _goodsInfo.specs[i].items[j].sele = true;
            }
          } else {
            _goodsInfo.specs[i].items[j].sele = false;
          }
        }
      }
    }
    that.setData({
      goodsInfo: _goodsInfo
    });
    // console.log(that.data.goodsInfo);
    //重新计算修改后的信息
    that.changeGoodsInfo();
    var str;
    var myType = typeof that.data.checkedVal;
    //拼接规格 
    if (myType == 'object') {
      var info = that.data.checkedVal;
      // console.log(info);
      str = info.join("+");
      // console.log(str);
      //str 与  goods.options每一个组合对象的title做匹配
      for (var i = 0; i < that.data.goodsInfo.options.length; i++) {
        var obj = that.data.goodsInfo.options[i];
        // console.log(obj);
        if (str == obj.title) {
          // 把匹配到的组合id，组合价格保存到全局的data
          that.setData({
            shopId: obj.id,
            price: obj.marketprice
          });
        }
      }
    } else {
      that.setData({
        shopId: ''
      });
    }

  },
  changeGoodsInfo: function () {
    var that = this;
    var seleArr = that.getCheckedSpecValue();
    // console.log(seleArr);
    var _checkedVal = seleArr.filter(n => {
      if (n.item_title) {
        return true
      } else {
        return false
      }
    }).map(v => {
      return v.item_title
    });
    // console.log(_checkedVal);
    if (_checkedVal.length == seleArr.length) {
      that.setData({
        checkedVal: _checkedVal
      });
    } else {
      that.setData({
        checkedVal: '请选择全部规格'
      })
    }

  },
  /**返回选择结果 */
  getCheckedSpecValue: function () {
    var that = this;
    var specsArr = [];   //存放各种选中的规格对象
    var _goodsInfoSpecs = that.data.goodsInfo.specs;   /*选中和没选中的都在这儿了，接下来吧选中的洗出来 */
    for (var i = 0; i < _goodsInfoSpecs.length; i++) {
      /**存放选中的规格对象 */
      var seleObj = {
        title: _goodsInfoSpecs[i].title,   //那种规格
        item_title: ''                     //什么样的规格
      }
      for (var j = 0; j < _goodsInfoSpecs[i].items.length; j++) {
        if (_goodsInfoSpecs[i].items[j].sele) {
          seleObj.item_title = _goodsInfoSpecs[i].items[j].title;
        }
      }
      specsArr.push(seleObj);
    }
    return specsArr;   //洗好的数据都在这个数组了 return出去
  },
  /**点击确定去订单页 */
  optionsPay: function () {
    var that = this;
    var _id = that.data.id;
    var _optionid = that.data.shopId;  //规格组合id
    var wuguige = that.data.wuguige; //无规格 1
    console.log(_id);
    console.log(_optionid);

    if (_optionid){
      e.get('supplier/cart/add_cart', { goodsid: _id, optionid: _optionid}, res => {
        console.log(res);
        if(res.error==0){
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 2000
          })
          that.hideBuyModal();
        }
      })
    }else{
      if (wuguige==1){
        e.get('supplier/cart/add_cart', { goodsid: _id }, res => {
          console.log(res);
          if (res.error == 0) {
            wx.showToast({
              title: res.message,
              icon: 'success',
              duration: 2000
            })
            that.hideBuyModal();
          }
        })
      }else{
        wx.showToast({
          title: '请选择规格',
          icon: 'success',
          duration: 2000
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
  },

})