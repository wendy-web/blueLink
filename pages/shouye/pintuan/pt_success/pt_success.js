// pages/shouye/pintuan/pt_success/pt_success.js 
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamid : '',
    info : '',
    allPrice : '',
    status : '',
    logistics: '',
    urge : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.teamid);
    this.setData({
      teamid : options.teamid
    });
    this.getinfo();
  },

  getinfo : function(){
    wx.showLoading({
      title: '加载中',
      icon: 'loading'
    })
    e.get('/groups/team/detail',{
      teamid : this.data.teamid
    },res=>{
      wx.hideLoading();
      console.log(res);
      var _status,
          _logistics,
          _urge;
      switch (res.result.myorder.status) {
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
        allPrice: Number(res.result.myorder.realprice) + Number(res.result.myorder.freight),
        status: _status,
        logistics: _logistics,
        urge : _urge
      })
    });
  },

  handleContact : function(e){
    console.log(e.detail.path)
    console.log(e.detail.query)
  },  
  gocenter : function() {
    wx.switchTab({
      url: '/pages/shouye/index/index'
    })
  },
  express:function(){
    wx.navigateTo({
      url: '/pages/groups/orders/express?id=' + this.data.info.myorder.id + '&expresscom=' + this.data.info.myorder.expresscom + '&expresssn=' + this.data.info.myorder.expresssn
    })
  },

  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.info.myorder.orderno,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
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
    return {
      title: '转发',
      path: '/pages/member/fenxiang/index',
      success: function (res) { }
    }

  },


  refund : function(){
    var teamid = this.data.teamid;
    var orderid = this.data.info.myorder.id;
    wx.navigateTo({
      url: '/pages/groups/refund/index?teamid='+teamid + '&orderid=' + orderid,
    })
  },

  urge : function(){
    e.post('/groups/orders/urge_delivery',{
      orderid: this.data.info.myorder.id
    },res=>{
      console.log(res);
      wx.showToast({
        title: res.result.message,
      })
    });
  }
})