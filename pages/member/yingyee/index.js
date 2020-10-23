var t = getApp(),
  e = t.requirejs("core");
  const myDate = new Date()
  
Page({
  onShareAppMessage() {
    return {
      title: 'picker-view',
      path: 'page/component/pages/picker-view/picker-view'
    }
  },
  data: {
    type: "0",
    page: 1,
    list: [],
    loaded: !1,
    loading: !0, 
    total_turnover:0,
    time_total_turnover: 0,
    time_total_commission: 0,
    dayStart: myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + (myDate.getDate()-1),
    dayEnd: myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
  },
  startDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value,
      list: [],
      page: 1
    })
    
    this.getList()
  },
  endDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endTime: e.detail.value,
      list: [],
      page: 1
    })
    this.getList()
  },
  onLoad: function () {
    var that = this;
    console.log(this.data.dayStart)
    this.setData({
      startTime: that.data.dayStart,
      endTime: that.data.dayEnd
    })
    this.getSet(), this.getList()
  },
  onReachBottom: function () {
    this.data.loaded || this.data.list.length == this.data.total || this.getList()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  getSet: function () {
    var t = this;
    e.get("commission/down/get_set", {}, function (e) {
      wx.setNavigationBarTitle({
        title: "团队营业额"
      }), delete e.error, e.show = !0, t.setData(e)
    })
  },
  getList: function () {
    var t = this;
    console.log(t.data.type)
    // 自定义搜索
    if(t.data.type == -1){
      let startTime = new Date(t.data.startTime)
      startTime = startTime.getTime(startTime) / 1000 
      let endTime = new Date(t.data.endTime)
      endTime = endTime.getTime(endTime) / 1000 
      e.get("member/turnover/turnover", {
        page: t.data.page,
        type: t.data.type,
        starttime: startTime,
        endtime: endTime
      }, function (e) {
        console.log(e)
        var a = {
          total: e.total,
          pagesize: e.pagesize,
          total_turnover: e.total_turnover,
          time_total_turnover: e.time_total_turnover,
          time_total_commission: e.time_total_commission
        };
        e.list.length > 0 && (a.page = t.data.page + 1, a.list = t.data.list.concat(e.list), e.list.length < e.pagesize && (a.loaded = !0)), t.setData(a)
      }, this.data.show)
    }else{
      e.get("member/turnover/turnover", {
        page: t.data.page,
        type: t.data.type
      }, function (e) {
        console.log(e)
        var a = {
          total: e.total,
          pagesize: e.pagesize,
          total_turnover: e.total_turnover,
          time_total_turnover: e.time_total_turnover,
          time_total_commission: e.time_total_commission
        };
        e.list.length > 0 && (a.page = t.data.page + 1, a.list = t.data.list.concat(e.list), e.list.length < e.pagesize && (a.loaded = !0)), t.setData(a)
      }, this.data.show)
    }
  },
  myTab: function (t) {
    var a = this,
    i = e.pdata(t).level;
    a.setData({
      type:i,
      page: 1,
      list: []
    })
    a.getList()
  }
})