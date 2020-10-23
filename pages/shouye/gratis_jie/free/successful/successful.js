// pages/shouye/gratis_jie/free/successful/successful.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery")), s = t.requirejs("wxParse/wxParse");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    take_id: '',  //商品id
    info: '',
    status : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      take_id: options.takeId
    });
    this.getinfo();
  },


  getinfo: function () {
    wx.showLoading({
      title: '加载',
    })
    e.get('/take/records/detail',
      {
        take_id: this.data.take_id
      },
      res => {
        s.wxParse("wxParseData", "html", res.rule, this, "5")
        console.log(res);
        wx.hideLoading();
        if (res.error != 0) {
          wx.showModal({
            title: '提示',
            content: res.result.message,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack();
              } else if (res.cancel) {
                console.log('用户点击取消');
                wx.navigateBack();
              }
            }
          })
        }
        this.setData({
          info: res,
          status : res.detail.status
        })
      });
  },



  freeSheet: function () {
    wx.showLoading({
      title: '领取中',
    })
    e.post('/take/records/receive',
      {
        take_id: this.data.take_id
      },
      res => {
        wx.hideLoading();
        console.log(res);
        wx.showToast({
          title: res.message,
        })
        if(res.error == 0){
          this.setData({
            status : 2
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

  }
})