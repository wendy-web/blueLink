// pages/shouye/pick_up_point/pick_up_point.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lat: '', //韦度
    lng: '', //经度
    list: '',
    index: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressDetail();
  },

  getAddressDetail: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',// 参考系
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log("纬度=" + latitude + " 经度=" + longitude);
        that.setData({
          lat: latitude,
          lng: longitude
        });
        that.getInfo();
      }
    })
  },

  getInfo: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading'
    })
    e.get('order/under_shop', {
      latitude: this.data.lat,
      longitude: this.data.lng
    }, res => {
      wx.hideLoading();
      console.log(res);
      this.setData({
        list: res.list
      });
    });
  },

  select: function (s) {
    var i = e.pdata(s).index;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      index: 2
    })
    t.setCache("huoAddress", this.data.list[i], 30), wx.navigateBack({ delta: 1 })
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