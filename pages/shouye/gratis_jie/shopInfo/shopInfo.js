// pages/shouye/gratis_jie/shopInfo/shopInfo.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({
  /**
   * 页面的初始数据
   */ 
  data: {
    id: '',
    background: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    info : '',
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id : options.id
    });
    this.getShopList();
  },
  goCart:function(){
    // wx.navigateTo({
    //   url: '/pages/shouye/gratis_jie/order/order',
    //   // url: '/pages/member/cart/index'
    // })
    if(!this.data.type){
      wx.showToast({
        title: '请选择抵扣方式',
        icon: 'none',
        duration:2000
      })
    }else{
      wx.showLoading();
      e.post('/creditshop/create/exchange',{
        goodsid : this.data.info.goods.id,
        type: this.data.type
      },res=>{
        wx.hideLoading();
        console.log(res);
        if(res.status == 1){
          wx.showToast({
            title: res.result.message,
            duration: 3500,
            success : function(){
              wx.switchTab({
                url: '/pages/member/cart/index',
                success: function () {

                },
                fail: function (i) {
                  console.log(i)
                }
              })
            }
          })
        }
        else{
          wx.showToast({
            title: res.result.message,
            icon: 'none',
            duration: 1500
          })
        }
      });
     

    }
  },

  getShopList : function(){
    wx.showLoading({
      title: '加载中',
    })
    e.get('/creditshop/detail',{
      id : this.data.id
    },res=>{
      wx.hideLoading();
      console.log(res);
      res.result.log.forEach(item=>{
        item.starttime = item.createtime_str
      })
      this.setData({
        info : res.result
      });
    });
  },

  check :function(e){
    console.log(e);
    this.setData({
      type: e.currentTarget.dataset.type
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