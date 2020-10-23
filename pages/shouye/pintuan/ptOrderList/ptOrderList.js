// pages/shouye/pintuan/ptOrderList/ptOrderList.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({
  data: {
    index : 0,
    list : ''
  },
  onLoad: function (options) {
    this.getList(0);
  },

  tab : function(e){
    console.log(e.currentTarget.dataset.index);
    var _index = e.currentTarget.dataset.index;
    this.setData({
      index : _index,
      list : ''
    });
    this.getList(_index);
  },

  getList: function (success){
    wx.showLoading({
      title: '加载中',
    })
    e.post('/groups/team/get_list',{
      success: success
    },res=>{
      wx.hideLoading();
      console.log(res.result.list);
      if(success == 1 || success == 3){
        res.result.list.forEach(item=>{
          switch (item.status){
            case '-1' :
              item.statusData = '已取消';
              break;
            case '0':
              item.statusData = '待付款';
              break;
            case '1':
              item.statusData = '待发货';
              break;
            case '2':
              item.statusData = '待收货';
              break;
            case '3':
              item.statusData = '已收货';
              break;
          }
        });
      } else if (success == 0){
        res.result.list.forEach(item=>{
          item.statusData = '拼团进行中'
        });
      }else if(success == 2){
        res.result.list.forEach(item => {
          item.statusData = '拼团已失败'
        })
      }
      this.setData({
        list: res.result.list
      });
    });
  },

  gotoOrder : function(e){
    console.log(e.currentTarget.dataset);
    var teamid = e.currentTarget.dataset.teamid;
    var _type = this.data.index;   //订单类型根据index：0进行 1成功 -1失败 -2单买
    console.log(_type);
    if(_type == 0){
      wx.navigateTo({
        url: '/pages/shouye/pintuan/pintuanShare/pintuanShare?teamid=' + teamid,
      })
    }else if(_type == 1){
      wx.navigateTo({
        url: '/pages/shouye/pintuan/pt_success/pt_success?teamid=' + teamid,
      })
    }else if(_type == -2){
      wx.navigateTo({
        url: '/pages/shouye/pintuan/alone_order/alone_order?orderid=' + e.currentTarget.dataset.orderid,
      })
    }else if(_type == -1){
      wx.navigateTo({
        url: '/pages/shouye/pintuan/pt_ fail/pt_ fail?teamid=' + teamid,
      })
    }
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