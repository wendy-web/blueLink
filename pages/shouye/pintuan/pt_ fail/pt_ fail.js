// pages/shouye/pintuan/pt_ fail/pt_ fail.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamid : '',
    info: '',
    status : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      teamid : options.teamid
    });
    console.log(this.data.teamid);
    this.getInfo();
  },

  getInfo : function(){
    wx.showLoading({
      title: '加载中',
    })
    e.get("/groups/team/detail",{
      teamid : this.data.teamid
    },res=>{
      wx.hideLoading();
      console.log(res);
      this.setData({
        info : res.result,
        allPrice: Number(res.result.myorder.realprice) + Number(res.result.myorder.freight),
        status : res.status
      })
    });
  },

  //继续开团
  buyGroup : function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否继续开团',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.showLoading({
            title: '支付中',
          })
          e.post('/groups/orders/continue_group', {
            orderid: that.data.info.myorder.id
          }, res => {
            wx.hideLoading();
            console.log(res);
            if(res.status == 1){
              wx.showToast({
                title: res.result.message,
                duration: 2000
              })
              wx.navigateTo({
                url: '/pages/shouye/pintuan/pt_invitation/py_invitation?orderid=' + that.data.info.myorder.id + '&teamid=' + that.data.teamid,
              })
            }else {
              wx.showToast({
                title: res.result.message,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }

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

  },

  refund: function () {
    var teamid = this.data.teamid;
    var orderid = this.data.info.myorder.id;
    wx.navigateTo({
      url: '/pages/groups/refund/index?teamid=' + teamid + '&orderid=' + orderid,
    })
  },


  buycontinue : function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否继续单买',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.showLoading({
            title: '支付中',
          })
          e.post('/groups/orders/group_file_alone',{
            orderid : that.data.info.myorder.id
          },res=>{
            wx.hideLoading();
            console.log(res);
            wx.showToast({
              title: res.result.message,
              icon: 'none',
              duration: 2000
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }

    })
  }
})