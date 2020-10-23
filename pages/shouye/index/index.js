var e = getApp(), r = e.requirejs("core"), t = e.requirejs("wxParse/wxParse");
Page({
  data: {
    sort_list: [],
    active: 0,//控制当前显示的div 
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    reward:'', 
    timeId: 0,
    firsetTime: 0,
    timeListBoolHandle: true,
    searchValue: ''
  },
  // 搜索
  searchHandle(e){
    var that = this
    this.setData({
      searchValue: e.detail.value
    })
    r.post("goods/category/get_goods_title", { title: that.data.searchValue}, function (r) {
      console.log(r);
    })
  },
  sortlist:function(e){
    var type = e.currentTarget.dataset.index;
    switch(type){
      case 4:
        wx.navigateTo({
          url: "/pages/shouye/shop_list/index?type=3"
        })
        break;
      case 5:
        wx.navigateTo({
          url: "/pages/shouye/shop_list/index?type=4"
        })
        break;
      case 6: 
        wx.navigateTo({
          url: "/pages/shouye/richang/index"
        })
        break;
      case 7: 
        wx.navigateTo({
          url: "/pages/shouye/gratis_jie/gratis_jie"
        })
        break;
      default:
        wx.navigateTo({
          url: "/pages/shouye/shop_list/index?type="+ type
        })
        break;
    }
  },
  onLoad: function (e) {
    var a = this;
    // var obj = wx.getLaunchOptionsSync();
    // console.log(e);
    // a.getList();
    console.log('onLoad----')
  },
  onShow: function () {
    var a = this;
    console.log('onShow----')
    a.getList();
  },
  getList:function(){
    var n = this;
    r.get("shop_index", {}, function (r) {
      // console.log(r.seckill_time)
      if(r.error==0){
        var TimeList = r.seckill_time
        for(var i = 0;i<TimeList.length; i++){
          if(TimeList[i].open_status == 1){
            n.setData({
              timeId: TimeList[i].id,
              firsetTime: TimeList[i].id
            })
          }
        }
        // var credit1_list = [
        //   {
        //     id: 151,
        //     type: 5,//回馈
        //     num: 10
        //   },
        //   {
        //     id: 151,
        //     type: 4,//回馈
        //     num: 10
        //   },
        //   {
        //     id: 151,
        //     type: 3,//邀请
        //     num: 10
        //   },
        //   {
        //     id: 151,
        //     type: 2,//推广
        //     num: 10
        //   },
        //   {
        //     id: 151,
        //     type: 1,//拼团
        //     num: 10
        //   }
        // ]
        n.setData({ 
          advs: r.advs,
          goods: r.goods, 
          sort_list: r.navs, 
          seckill_time: r.seckill_time,
          seckill_goods: r.seckill_goods, 
          group_goods: r.group_goods,
          goods: r.goods,
          nowTimeList: []
        });
        // 红包列表
        var credit1_list = r.credit1_list
        if(credit1_list.length > 0){
          n.setData({ 
            credit1_list: credit1_list,
            credit1_list_Fist: credit1_list[0],
            credit1_list_Index: 0,
          })
          if(n.data.credit1_list_Fist.type == 5){
            // 隐藏底部
            wx.hideTabBar()
            wx.setNavigationBarTitle({
              title: ''
            })
            wx.setNavigationBarColor({
              frontColor: '#ffffff', // 必写项
              backgroundColor: '#FEA54A', // 传递的颜色值
            })
          }
        }
      }
    })
  },
  // 打开红包
  openRedHandle(event){
    var that = this;
    if(that.data.credit1_list_Fist.type == 5){
      // 隐藏底部
      wx.showTabBar()
      wx.setNavigationBarTitle({
        title: '团优优 农产品 直卖场'
      })
      wx.setNavigationBarColor({
        frontColor: '#000000', // 必写项
        backgroundColor: '#9BFC0F', // 传递的颜色值
      })
    }
    var openId =  event.currentTarget.dataset.id;
    r.post("shop_index/credit1_draw", { credit1_id: openId }, function (r) {
      console.log(r);
      wx.showToast({
        title: r.message,
        icon: 'success',
        duration: 2000
      })
      var credit1_list_Index = that.data.credit1_list_Index + 1
      that.setData({
        credit1_list_Fist: that.data.credit1_list[credit1_list_Index],
        credit1_list_Index: credit1_list_Index
      })
      console.log(credit1_list_Index)
      console.log(that.data.credit1_list_Fist)
    })
  },
  TimeSelectHandle : function(event){
    var that = this
    that.setData({
      timeId: event.currentTarget.dataset.id
    })
    if(event.currentTarget.dataset.id == this.data.firsetTime){
      that.setData({
        timeListBoolHandle: true
      })
    } else{
      that.setData({
        timeListBoolHandle: false
      })
    }
    console.log(this.data.timeListBoolHandle)
    this.getTimeList()
  },
  // 限时商品的详情
  // 进项抢购
  timeDetailHandle(event){
    var that = this;
    console.log(this.data.timeListBoolHandle)
    if(this.data.timeListBoolHandle){
      wx.navigateTo({
          url: "/pages/goods/detail/index?id=" + event.currentTarget.dataset.id
      })
    } else{
      var TimeList = that.data.seckill_time
        for(var i = 0;i<TimeList.length; i++){
          if(TimeList[i].id > that.data.timeId){
            wx.showToast({
              title: '已过期',
              icon: 'none',
              duration: 2000
            })
          } else{
            wx.showToast({
              title: '尚未开始',
              icon: 'none',
              duration: 2000
            })
          }
        }
      
    }
    // wx.navigateTo({
    //     url: "/pages/shouye/liebiao/index?seckill_id=18"
    // })
    // url="/pages/goods/detail/index?id={{item.id}}"
  },
  getTimeList: function () {
    var that = this;
    r.get("goods/seckill_goods/get_list", { seckill_id: that.data.timeId}, function (a) {
      console.log(a.list)
      that.setData({
        seckill_goods: a.list
      })
    })
  },


  //分享
  showShare: function (t) {
    var a = this;
    a.setData({
      active: "active",
      slider: "in",
      showshare: 1
    })
  },
  emptyActive: function () {
    this.setData({
      active: "",
      slider: "out",
      showshare: 0
    })
  },
  // 签到
  qiandao:function(){
    var n = this;
    r.post("sign/dosign_check", {}, function (r) {
      console.log(r);
      if (r.error == 0) {
        n.setData({
          reward: r.reward,
          showqiandao: 1
        })
      }else{
        wx.showToast({
          title: r.message,
          icon: 'none',
          duration: 2000
        })
      }
    }) 
  },
  // 成功领取
  successbtn:function(){
    var n = this;
    r.post("sign/dosign", {}, function (r) {
      if (r.error == 0) {
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 2000
        })
       
      } else {
        wx.showToast({
          title: r.message,
          icon: 'none',
          duration: 2000
        })
      }
      n.setData({
        showqiandao: 0
      })
    })
   
  },
  removebtn:function(){
    this.setData({
      showqiandao: 0
    })
  },

  // 拼团商品加载更多
  pingtuanduo:function(){
    var n = this;
    // r.post("goods/category/get_group_goods_list", {}, function (r) {
    //   console.log(r);
    //   if (r.error == 0) {
    //     wx.showToast({
    //       title: r.message,
    //       icon: 'success',
    //       duration: 2000
    //     })

    //   }
    // })
  },
  putongduo:function(){
    console.log(4444444444);
  },
  onReady: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function (t) {
    var e = getApp(),
    n = e.getCache("sysset"),
    o = n.share || {},
    i = e.getCache("userinfo"),
    a = "",
    c = n.shopname || "",
    r = n.description || "";
    var menbes = wx.getStorageSync("members");
    var tureid = i.id > 0;
    if(!tureid){
      i.id = menbes.id
    }
    // console.log("pages/shouye/index/index?" + "mid=" + i.id);
    return o.title && (c = o.title), o.desc && (r = o.desc), i && (a = i.id), t = "pages/shouye/index/index", t = -1 != t.indexOf("?") ? t + "&" : t + "?", {
      title: c,
      desc: r,
      path: t + "mid=" + a
    }
  }
})