// pages/shouye/gratis_jie/bargain/helpBargain/helpBargain.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery")), s = t.requirejs("wxParse/wxParse");
Page({
  data: {
    show: false
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      selfId : options.shopid
    });
    this.getinfo();
  },
  getinfo() {
    wx.showLoading({
      title: '加载',
    })
    e.get('/bargain/bargain', {
      id: this.data.id
    }, res => {
      wx.hideLoading();
      s.wxParse("wxParseData", "html", res.result.account_set.rule, this, "5")
      console.log(res)
      this.setData({
        info: res.result
      })
    });
  },

  //自己开
  self(){
    wx.navigateTo({
      url: '/pages/shouye/gratis_jie/bargain/bargain?id=' + this.data.selfId,
    })
  },
  //帮砍
  help(){
    wx.showLoading();
    e.post('/bargain/bargain',{
      ajax : 151,
      id : this.data.id,
      mid : ''
    },res=>{
      wx.hideLoading();
      console.log(res);
      if(res.data == 0){
        this.setData({ show : true })
      }else{
        wx.showToast({
          title: res.result.data,
          icon: 'none'
        })
      }
    })
  },
  close(){
    this.setData({
      show : false,
    });
  }
})