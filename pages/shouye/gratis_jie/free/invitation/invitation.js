// pages/shouye/gratis_jie/free/invitation/invitation.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({
  data: {
    showModalStatus: false,
    take_id : '',
    info : '',
    price : '',
    id : ''
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      take_id: options.take_id,
      price : options.price,
      id : options.id
    })
    this.getinfo();
  },
  getinfo(){
    wx.showLoading();
    var that = this;
    e.get("/take/records/detail",{
      take_id: that.data.take_id
    },res=>{
      wx.hideLoading();
      console.log(res);
      that.setData({
        info : res
      })
    })
  },
  
  onShareAppMessage: function (res) {
    // console.log(res);
    return {
        title: this.info.detail.title,
        imageUrl: this.info.detail.thumb,
        path: '/pages/shouye/gratis_jie/free/free?id=' + this.data.id +'take_id=' + this.data.take_id,
        success: function (res) {
          console.log(res);
        }
    }
  },

  showBuyModal() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
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
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showModalStatus: true
    })
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
      })
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