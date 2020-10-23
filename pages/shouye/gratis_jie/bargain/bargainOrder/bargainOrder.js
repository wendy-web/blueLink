// pages/shouye/gratis_jie/bargain/bargainOrder/bargainOrder.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery")), s = t.requirejs("wxParse/wxParse");
Page({
  data: {
    id : '',
    info : '',
    closeStatus:false
  },
  onLoad: function (options) {
    this.setData({
      id : options.id
    });
    this.getinfo();
  },

  getinfo(){
    wx.showLoading({
      title: '加载',
    })
    e.get('/bargain/bargain',{
      id : this.data.id
    },res=>{
      wx.hideLoading();
      s.wxParse("wxParseData", "html", res.result.account_set.rule, this, "5")
      console.log(res)
      this.setData({
        info : res.result
      })
    });
  },
  zero(){
    wx.showLoading();
    e.post('/bargain/draw_goods',{
      id : this.data.id,
    },res=>{
      wx.hideLoading();
      console.log(res);
      wx.showModal({
        title: '提示',
        content: res.result.message,
      })
    })
  },

  //测试函数
  mobilize(){
    var that = this;
    wx.navigateTo({
      url: '/pages/shouye/gratis_jie/bargain/helpBargain/helpBargain?id=' + that.data.info.res.id + '&shopid=' + that.data.info.res2.id
    })
  },
  onShow: function () {

  },

  closeStatusHandle(){
    this.setData({
      closeStatus : false
    })
  },
  //  用户点击右上角分享
  onShareAppMessage: function () {
    var i = t.getCache("userinfo");
    var menbes = wx.getStorageSync("members");
    var tureid = i.id > 0;
    if(!tureid){
      i.id = menbes.id
    }
    return {
      title: this.data.info.res2.title,
      imageUrl: this.data.info.res2.images,
      path: '/pages/shouye/gratis_jie/bargain/helpBargain/helpBargain?id=' + this.data.info.res.id +'&shopid=' + this.data.info.res2.id +'&mid='+ i.id,
      success: function (res) {
        console.log(res);
      }
    }
  } 
})