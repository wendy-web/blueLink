// pages/shouye/pintuan/pt_invitation/py_invitation.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    teamid: '',
    orderid: '',
    info:'',
    userId : '',     //用户id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user = t.getCache('userinfo');
    console.log(user);
    console.log(options);
    this.setData({
      teamid: options.teamid,
      orderid: options.orderid,
      userId : user.id
    })
    this.getInfo();
  },

  getInfo : function(){
    e.get('/groups/team/detail',
    {
      teamid: this.data.teamid,   // 参团id
      orderid: this.data.orderid     // 订单id
    },
    res=>{
      console.log(res);
      this.setData({
        info: res.result
      })
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  share:function(){
    wx.navigateTo({
      url: '/pages/shouye/pintuan/pintuanShare/pintuanShare?teamid='+ this.data.teamid,
    })
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
  onShareAppMessage: function (res) {
    // console.log(res);
    return {
      title: this.data.info.shopshare.title,
      imageUrl: this.data.info.shopshare.imgUrl,
      path: '/pages/shouye/pintuan/pintuanShare/pintuanShare?teamid=' + this.data.teamid +'&mid=' + this.data.userId,
      success : function(res){
        console.log(res);
      }
    }
  },

  showBuyModal() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 800,
      /**
        * http://cubic-bezier.com/ 
        * linear 动画一直较为均匀
        * ease 从匀速到加速在到匀速
        * ease-in 缓慢到匀速
        * ease-in-out 从缓慢到匀速再到缓慢
        * 
        * http://www.tuicool.com/articles/neqMVr
        * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
        * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
        */
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(1000).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showModalStatus: true
    })
    setTimeout(() => {
      animation.translateY(0).step();
      this.setData({
        animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
      })
      // console.log(this)
    }, 200)
  },

  hideBuyModal() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
      console.log(this)
    }.bind(this), 200)
  },
})