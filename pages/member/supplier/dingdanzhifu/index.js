// pages/shouye/pintuan/pt_invitation/py_invitation.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid,
    })
    this.getInfo();
  },

  getInfo: function () {
    e.get('supplier/create/pay_result',
      {
        orderid: this.data.orderid     // 订单id
      },
      res => {
        // console.log(res);
        this.setData({
          paytype: res.order.paytype,
          price: res.order.price
        })
      })
  },
  again:function(){
    wx.navigateTo({
      url: '/pages/member/supplier/index',
    })
  },
  chakan:function(){
    var orderid= this.data.orderid;     // 订单id
    wx.navigateTo({
      url: '/pages/member/supplier/xiangqing/index?orderid=' + orderid,
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
  onShareAppMessage: function (res) {
    
  },
})