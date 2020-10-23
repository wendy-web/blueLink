var e = getApp(), r = e.requirejs("core"), t = e.requirejs("wxParse/wxParse");
Page({
  data: {
    winHeight:'',
    scrHeight:'',
    member:""
  },
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        // console.log(res);
        this.setData({
          //windowHeight 为屏幕可用高度
          winHeight: res.windowHeight,
          //screenHeight 为屏幕高度
          scrHeight: res.screenHeight
        })
      }
    })
    this.getlist();
  },
  getlist:function(){
    var that = this;
    r.get("member/log", {},
      function (e) {
        wx.hideLoading()
        if (0 == e.error){
          that.setData({
            member:e
          })
        }
       
      })
  },
  useRed(){
    wx.switchTab({
      url: '/pages/shouye/index/index'
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})