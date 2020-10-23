var t = getApp(), a = t.requirejs("core");
Page({
  data: {
    callBool:false,
    telephone: 0,
    work_time: 0,
    common_problem: []
  },
  phoneHandle(){
    this.setData({
      callBool: !this.data.callBool
    })
  },
  freeTell: function(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.telephone,
    })
  },
  onLoad: function (options) {

  },
  onReady: function () {
    var that = this;
    a.post("service",{},function (data) {
      that.setData({
        telephone: data.telephone,
        work_time: data.work_time,
        common_problem: data.common_problem
      })
    })
  },
  onShow: function () {
    var that = this;
    
  }
})