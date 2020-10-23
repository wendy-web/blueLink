// pages/home_new/gratis_jie/gratis_jie.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({ 
  /**
   * 页面的初始数据
   */
  data: {
    // btns: ["红包兑换", "众券兑换", "零元秒杀","一带一免单"],
    btns: ["红包兑换", "零元秒杀","一带一免单", "众券兑换"],
    active: 0,//控制当前显示的div
    coupon:0,
    idx_switch : 0,
    idx_switch_lyms: 0,
    idx_switch_yde: 0,
    page : 1,         //红包商品页数
    pageRecord: 1,     //红包记录列表页数
    lymsPage : 1 ,    //0元秒杀页数
    lymsRecord: 1,      //0元记录页数
    ydePage : 1,      //一带二商品页数
    ydeRecord : 1,    //一带二记录页数


    exchangeList: [],    //红包兑换商品列表
    exchangeRecord: [],   //红包兑换记录列表
    lymsList:[],   //零元秒杀商品列表
    lymsRecordList:[],   //0元秒杀记录列表
    ydeList : [],         //一带二商品列表
    ydeRecordList:[],     //一带二记录列表
    exchangeflag : true,
    lymsFlag : true,
    ydeFlag : true,
    windowHeight : ''

  },
  toggle: function (e) {
    console.log(e.currentTarget.dataset.index)
    var new_ingex = e.currentTarget.dataset.index
    if (new_ingex==1){
      this.setData({
        lymsList: []
      })
      this.getlymsList();
      this.setData({
        coupon:1
      })
    } else if (new_ingex == 0){
      this.setData({
        coupon: 0
      })
    } else if (new_ingex == 2) {
      this.setData({
        ydeList: []
      })
      this.getYdeList();
      this.setData({
        coupon: 2
      })
    } else if (new_ingex == 3) {
      this.setData({
        coupon: 3
      })
    }
    this.setData({
      //设置active的值为用户点击按钮的索引值
      active: e.currentTarget.dataset.index,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getExchangeList(this.data.page);
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })

  },
  //红包兑换的tab切换
  tab_switch: function(i){
    console.log(i.currentTarget.dataset.tabindex);
    this.setData({
      idx_switch: i.currentTarget.dataset.tabindex
    });
    if (i.currentTarget.dataset.tabindex == 0 ){
      this.setData({
        page : 1,
        exchangeList : []
      })
      this.getExchangeList(this.data.page);
      this.setData({
        exchangeflag : true
      });
    }else{
      this.setData({
        pageRecord:1,
        exchangeRecord : []
      });
      this.getExchangeRecord();
      this.setData({
        exchangeflag : false
      });
    }
  },
  //零元秒杀下的tab切换
  tab_switch_lyms : function(i){
    console.log(i.currentTarget.dataset.tabindex);
    this.setData({
      idx_switch_lyms: i.currentTarget.dataset.tabindex
    });
    if (i.currentTarget.dataset.tabindex == 0) {
      this.setData({
        lymsPage : 1,
        lymsList :[]
      });
      this.getlymsList(this.data.lymsPage);
      this.setData({
        lymsFlag: true,
      });
    } else {
      this.setData({
        lymsRecord: 1,
        lymsRecordList: []
      });
      this.getLymsRecordList();
      this.setData({
        lymsFlag: false
      });
    }
  },
  //一带二的tab切换
  tab_switch_yde: function(i){
    this.setData({
      idx_switch_yde: i.currentTarget.dataset.tabindex
    });
    if (i.currentTarget.dataset.tabindex == 0) {
      this.setData({
        ydePage: 1,
        ydeList: []
      });
      this.getYdeList(this.data.ydePage);
      this.setData({
        ydeFlag: true,
      });
    } else {
      //获取一带二记录的
      this.setData({
        ydeRecord: 1,
        ydeRecordList: []
      });
      this.getYdeRecord();
      this.setData({
        ydeFlag: false
      });
    }
  },

  //零元秒杀商品
  getlymsList : function(p){
    wx.showLoading({
      title: '加载中',
    })
    e.get('/bargain',{
      page: this.data.lymsPage
    },res=>{
      wx.hideLoading();
      console.log(res);
      if (res.result.goods.length == 0) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
      var list = this.data.lymsList.concat(res.result.goods);
      this.setData({
        lymsList: list
      })
      console.log(this.data.lymsList)
      console.log('----------------')
    })
  },
  //0元秒杀记录
  getLymsRecordList : function(){
    wx.showLoading({
      title: '加载中',
    })
    e.get('/bargain/act',{
      page : this.data.lymsRecord
    },res=>{
      console.log(res);
      wx.hideLoading();
      if (res.result.goods.length == 0) {
        wx.showToast({
          title: '没有更多记录',
          icon: 'none'
        })
      }
      var list = this.data.lymsRecordList.concat(res.result.goods);
      this.setData({
        lymsRecordList: list
      });
    });
  },

  //红包兑换商品
  getExchangeList : function(p){
    wx.showLoading({
      title: '加载中',
    })
    e.get('/creditshop/lists/getlist',{
      page : this.data.page
    },res=>{
      wx.hideLoading();
      console.log(res);
      if (res.result.list.length == 0) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
      var list = this.data.exchangeList.concat(res.result.list);
      this.setData({
        exchangeList: list
      });
    });
  },
  //红包兑换记录
  getExchangeRecord:function(){
    e.get('/creditshop/creditlog/getlist', {
      page: this.data.pageRecord
    }, res => {
      console.log(res);
      if (res.result.list.length == 0){
        console.log('kon');
        wx.showToast({
          title: '没有更多记录',
          icon: 'none'
        })
      }
      var list = this.data.exchangeRecord.concat(res.result.list);
      this.setData({
        exchangeRecord: list
      });
    })
  },
  //一带二商品列表
  getYdeList: function(){
    wx.showLoading({
      title: '加载中',
    })
    e.get('/take', {
      page: this.data.ydePage
    }, res => {
      wx.hideLoading();
      console.log(res);
      if (res.list.length == 0) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
      var list = this.data.ydeList.concat(res.list);
      this.setData({
        ydeList: list
      })
      console.log(this.data.ydeList)
      console.log('*********')
    })
  },
  //一带二记录
  getYdeRecord: function(){
    wx.showLoading();
    e.get('/take/records/get_log',{
      page: this.data.ydeRecord
    },res=>{
      console.log(res);
      wx.hideLoading();
      if (res.list.length == 0) {
        console.log('kon');
        wx.showToast({
          title: '没有更多记录',
          icon: 'none'
        })
      }
      var list = this.data.ydeRecordList.concat(res.list);
      this.setData({
        ydeRecordList: list
      });
    })
  },
  

  //上拉更多
  loadMore :function(){
    if(this.data.coupon == 0){
      console.log('红包兑换的上拉');
      if (this.data.idx_switch == 0){
        var n=1;
        console.log('商品加载更多');
        this.setData({
          page : Number(this.data.page) + Number(n)
        });
        this.getExchangeList();

      }else{
        console.log('记录加载更多');
        var n = 1;
        this.setData({
          pageRecord: Number(this.data.pageRecord) + Number(n)
        });
        this.getExchangeRecord();
      }
    }else if(this.data.coupon == 1){
      console.log('众卷兑换的上拉');
    }else if(this.data.coupon == 2){
      console.log('零元秒杀的上拉');
      if (this.data.idx_switch_lyms == 0){
        var n=1
        this.setData({
          lymsPage: Number(this.data.lymsPage) + Number(n)
        });
        this.getlymsList();
      }else{
        var n = 1;
        this.setData({
          lymsRecord: Number(this.data.lymsRecord) + Number(n)
        })
        this.getLymsRecordList();
      }
    }else{
      console.log('一带二的上拉');
      if (this.data.idx_switch_yde == 0) {
        var n = 1
        this.setData({
          ydePage: Number(this.data.ydePage) + Number(n)
        });
        this.getYdeList();
      } else {
        var n = 1;
        this.setData({
          ydeRecord: Number(this.data.ydeRecord) + Number(n)
        })
        this.getYdeRecord();
      }
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

  },


  gotoRecord(e){
    console.log(e);
    if (e.currentTarget.dataset.status == "0"){
      console.log(e.currentTarget.dataset.price);
      wx.navigateTo({
        url: '/pages/shouye/gratis_jie/free/invitation/invitation?take_id=' + e.currentTarget.dataset.takeid + '&price=' + e.currentTarget.dataset.price,
      })
    } else if (e.currentTarget.dataset.status == 1 || e.currentTarget.dataset.status == 2){
      console.log(e.currentTarget.dataset.status);
      wx.navigateTo({
        url: '/pages/shouye/gratis_jie/free/successful/successful?takeId=' + e.currentTarget.dataset.takeid,
      })
    }
  },

  //0元记录去下一级
  viewrecord(e){
    console.log(e.currentTarget.dataset.nowprice);
    if (e.currentTarget.dataset.nowprice==0){
      wx.navigateTo({
        url: '/pages/shouye/gratis_jie/bargain/bargainOrder/bargainOrder?id=' + e.currentTarget.dataset.id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/shouye/gratis_jie/bargain/bargainOrder/bargainOrder?id=' + e.currentTarget.dataset.id
      })
    }
  }
})