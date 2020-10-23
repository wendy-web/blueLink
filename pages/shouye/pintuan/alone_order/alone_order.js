// pages/shouye/pintuan/alone_order/alone_order.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    orderid : '',
    info : '',
    allPrice : '',
    status: '',
    logistics:'',
    urge:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid : options.orderid
    });
    this.getInfo();

  },  


  getInfo: function(){
    wx.showLoading({
      title: '加载中',
    })
    e.get('/groups/orders/detail',{
      orderid : this.data.orderid
    },res=>{
      wx.hideLoading();
      console.log(res);
      //计算总价
      var _allPrice = Number(res.result.order.freight) + Number(res.result.order.realprice);
      var _status,
        _logistics,
        _urge;
      switch(res.result.order.status){
        case '-1' :
        case '-1':
          _status = '已取消';
          _logistics = false;
          _urge = false;
          break;
        case '0':
          _status = '待付款';
          _logistics = false;
          _urge = false;
          break;
        case '1':
          _status = '待发货';
          _logistics = false;
          _urge = true;
          break;
        case '2':
          _status = '待收货';
          _logistics = true;
          _urge = false;
          break;
        case '3':
          _status = '已收货';
          _logistics = false;
          _urge = false;
          break;
      }
      this.setData({
        info : res.result,
        allPrice : _allPrice,
        status : _status,
        logistics: _logistics,
        urge: _urge
      });
    });

  },
  

  copyBtn: function (e) {
    var that = this;
    console.log()
    wx.setClipboardData({
      data: that.data.info.order.orderno,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },


  urge: function () {
    e.post('/groups/orders/urge_delivery', {
      orderid: this.data.orderid
    }, res => {
      console.log(res);
      wx.showToast({
        title: res.result.message,
      })
    });
  },

  express:function(){
    wx.navigateTo({
      url: '/pages/groups/orders/express?id=' + this.data.info.order.id + '&expresscom=' + this.data.info.order.expresscom + '&expresssn=' + this.data.info.order.expresssn
    })
  },


  again : function(){
    wx.navigateTo({
      url: '/pages/shouye/pintuan/pintuan?id='+ this.data.info.good.id,
    })
  },

  refund: function () {
    var teamid = this.data.teamid;
    var orderid = this.data.info.order.id;
    wx.navigateTo({
      url: '/pages/groups/refund/index?teamid=' + teamid + '&orderid=' + orderid,
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

  }
})