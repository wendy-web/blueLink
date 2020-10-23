var t = getApp(), a = t.requirejs("core"),s = t.requirejs("wxParse/wxParse");
Page({
  data: {
    title: '',
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    a.post('service/common_problem',{id:options.id },
      res => {
        s.wxParse("wxParseData", "html", res.common_problem.content, that, "5")
        that.setData({
          title: res.common_problem.title,
          content: res.common_problem.content
        })
    });
    // a.post("service/common_problem",{id:options.id },function (data) {
    //   console.log(data.common_problem.content);
    //   s.wxParse("wxParseData", "html", data.common_problem.content, this, "5");
    //   that.setData({
    //     title: data.common_problem.title,
    //     content: data.common_problem.content
    //   })
    // })
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