var t = getApp(),
  a = t.requirejs("core");
Page({
  data: {
    icons: t.requirejs("icons"),
    type: 0,
    isopen: !1,
    page: 1,
    loaded: !1,
    loading: !0,
    list: []
  },
  onLoad: function (a) {
    this.getList()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    this.data.loaded || this.data.list.length == this.data.total || this.getList()
  },
  getList: function () {
    var t = this;
    t.setData({
      loading: !0
    }), a.get("supplier/order/get_list", {
      page: t.data.page
    }, function (a) {
      console.log(a);
      var e = {
        loading: !1,
        total: a.total,
        show: !0
      };
      a.list || (a.list = []), a.list.length > 0 && (e.page = t.data.page + 1, e.list = t.data.list.concat(a.list), a.list.length < a.pagesize && (e.loaded = !0)), t.setData(e)
    })
  }
})