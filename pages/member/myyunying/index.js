var t = getApp(),
  e = t.requirejs("core");
Page({
  data: { 
    level: "1",
    page: 1,
    list: [],
    loaded: !1,
    loading: !0, 
  },
  onLoad: function () {
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
        title: "我的运营中心"
      }), delete e.error, e.show = !0, t.setData(e)
    })
  },
  getList: function () {
    var t = this;
    t.setData({
      loading: !0
    }),e.get("member/team", {
      page: t.data.page,
      level: t.data.level
    }, function (res) {
      var e = res.result;
      console.log(e)
      var a = {
        loading: !1,
        total: e.total,
        pagesize: e.pagesize
      };
      e.list.length > 0 && (a.page = t.data.page + 1, a.list = t.data.list.concat(e.list), e.list.length < e.pagesize && (a.loaded = !0)), t.setData(a)
    }, this.data.show)
  },
  // 团队成员
  getTeamList:function(){
    console.log("tuandui")
    var t = this;
    // get_on_team get_team_list
    e.get("member/team/get_on_team", {
      // page: t.data.page,
      // level: t.data.level
    }, function (e) {
      console.log(e)
      console.log(e.result.list)
      var a = {
        loading: !1,
        total: e.total
      };
      e.result.list.length > 0 && (a.list = e.result.list), t.setData(a)
    }, this.data.show)
  },
  myTab: function (t) {
    var a = this,
      i = e.pdata(t).level;
    if(i==1 || i==2){
      a.setData({
        level: i,
        page: 1,
        list: [],
        loading: !0
      }), a.getList();
    }else{
      a.setData({
        level: i,
        page: 1,
        list: []
      }), a.getTeamList();
    }
  }
})