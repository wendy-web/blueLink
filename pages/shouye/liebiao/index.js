var t = getApp(),
  a = t.requirejs("core"),
  e = t.requirejs("jquery");
Page({
  data: {
    icons: t.requirejs("icons"),
    isFilterShow: !1,
    listmode: "block",
    listsort: "",
    page: 1,
    loaded: !1,
    loading: !0,
    list: [],
    params: {},
    total: 0,

  },
  onLoad: function (t) {
    var c = this;
    console.log(t);
    c.setData({
      seckill_id: t.seckill_id
    })
    this.getList()
  },
  onShow: function () {

  },
  onReachBottom: function () {
    this.data.loaded || this.data.list.length == this.data.total || this.getList()
  },

  getList: function () {
    var t = this;
    t.setData({
      loading: !0
    }), t.data.params = t.data.page, a.get("goods/seckill_goods/get_list", { page: t.data.params, seckill_id: t.data.seckill_id}, function (a) {
      var e = {
        merchid: t.data.merchid,
        loading: !1,
        total: a.total
      };
      a.list || (a.list = []), a.list.length > 0 && (e.page = t.data.page + 1, e.list = t.data.list.concat(a.list), a.list.length < a.pagesize && (e.loaded = !0)), t.setData(e)
    })
  }
})