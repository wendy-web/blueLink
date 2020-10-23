// pages/shouye/gratis_jie/free/free.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({

  /**
   * 页面的初始数据
   * 分享者进来判断是否已经登录，take_id先存全局变量或缓存
   */
  data: {
    id : '',
    info : '',
    take_id : '',   //是分享带过来的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id : options.id,
      take_id : options.take_id
    });
    t.setCache("take_id", {take_id : options.take_id}, 7200),

    this.getinfo();
  },

  goto:function(){
    console.log(t.getCache('userinfo'));
    if (t.getCache('userinfo')){
      wx.navigateTo({
        url: '/pages/shouye/gratis_jie/free/freeOrder/freeOrder?goodsid=' + this.data.info.tgid + '&id=' + this.data.id,
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '您还未登录授权',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.switchTab({
              url: '/pages/member/index/index',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  getinfo(){
    wx.showLoading();
    e.get('/take/detail',{
      goodid : this.data.id,

    },res=>{
      wx.hideLoading();
      console.log(res);
      this.setData({
        info : res.good
      })
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