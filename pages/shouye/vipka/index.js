var e = getApp(), r = e.requirejs("core"), t = e.requirejs("wxParse/wxParse");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  getlist:function(){
    var n = this;
    r.get("member/vip_card", {}, function (r) {
      console.log(r);
      console.log(r.list[0]);
      var dataList = [];
      dataList.push(r.list[0])
      if (r.error == 0) {
        n.setData({ 
          list:r.list,
          dataList: dataList
        });
      }
    })

  },
  vk_center:function(c){
    console.log(3333333);
    var a = this, i = c.currentTarget.dataset.index;
    var list = a.data.list;
    // a.setData({
    //   list1:list[0],
    //   list2: list[1],
    //   list3: list[2]
    // })
    var dataList = [];
    dataList.push(list[i])
    if(i==0){
      a.setData({
        dataList: dataList
      })
    }else if(i==1){
      a.setData({
        dataList: dataList
      })
    }else if(i==2){
      a.setData({
        dataList: dataList
      })
    }
  },
  //立即开通
  pay: function (t) {
    var i = r.pdata(t).type,
      o = this;

    // vip卡购买
    var id = r.pdata(t).id;
    r.get("member/vip_card/buy", {id:id}, function (res) {
      // console.log(res.wechat)
      if(res.error == 0){
        o.setData({
          order: res.order,
          wechat: res.wechat
        })


        var a = o.data.wechat;
        // console.log(a);
        "wechat" == i ? r.pay(a.payinfo, function (t) {
          console.log(t);
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })

        }) : "";
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var n = this;
    n.getlist();

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