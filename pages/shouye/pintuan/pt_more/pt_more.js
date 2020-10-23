// pages/shouye/pintuan/pt_more/pt_more.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : '',
    team_ing : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id : options.id
    })
    console.log(this.data.id);
    this.getList();
  },

  getList : function(){
    var that = this;
    e.post("/groups/goods",
      { id: that.data.id }, res => {
        wx.hideLoading();
        console.log(res.result);
        res.result.team_ing.forEach((item, index) => {
          var time = 'time_' + index;
          clearTimeout(time);
          var arr = [];
          time = setInterval(() => {
            item.timeLeft = that.getTimeLeft(item.count_down);

            that.setData({
              team_ing: res.result.team_ing,
            })
            if (item.timeLeft == "0天0时0分0秒") {
              clearInterval(time);
            }
          }, 1000);

        })

        that.setData({
          goods: res.result.goods,
          total_team_ing: res.result.total_team_ing,
          price: res.result.goods.groupsprice
        });
      }
    )
  },

  getTimeLeft: function (datetimeTo) {
    // 计算目标与现在时间差（毫秒）
    let time1 = new Date(datetimeTo).getTime();
    let time2 = new Date().getTime();
    let mss = time1 - time2;

    // 将时间差（毫秒）格式为：天时分秒
    let days = parseInt(mss / (1000 * 60 * 60 * 24));
    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((mss % (1000 * 60)) / 1000);

    return days + "天" + hours + "时" + minutes + "分" + seconds + "秒"
  },

  join: function (e) {
    // console.log(e.currentTarget.dataset.teamid);
    var teamid = e.currentTarget.dataset.teamid;
    wx.navigateTo({
      url: '/pages/shouye/pintuan/pintuanShare/pintuanShare?teamid=' + teamid,
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