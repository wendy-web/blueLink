var t = getApp(), a = t.requirejs("core");
Page({
  data: {
    cate: "",
    page: 1,
    loading: !1,
    loaded: !1,
    list: [],
    approot: t.globalData.approot,
    btn: "reginer",
    subtn: "shengqing",
    libiao:[],
    paihang:[],
    paihangList:[],
    guan:'1' 
  },
  onLoad: function (t) { 
    this.getList('1','1') 
  },
  myTab: function (t) {
    var e = this, i = a.pdata(t).cate;
    console.log(i)
    e.getList(i,1);
  },
  getList: function (member_type, type) {
    console.log(member_type, type,'传递过去的值')
    var t = this;
    a.hideLoading(), this.setData({ loading: !0, cate: member_type, guan: type}),
        a.get("member/ranking", { member_type: member_type, type: type }, function (e) {
        console.log(e);
        let paihanglist = [e.list[1], e.list[0], e.list[2]];
        var i = {}; e.list.length > 0, i.list = e.list, i.paihang = paihanglist, t.setData(i), a.hideLoading();
 
        console.log(t.data.paihang);
        console.log(t.data.list);
        // var i = { loading: !1, total: e.total, pagesize: e.pagesize, closecenter: e.closecenter }; e.list.length > 0 && (i.page = t.data.page + 1, i.list = t.data.list.concat(e.list),
        //   e.list.length < e.pagesize && (i.loaded = !0)), t.setData(i), a.hideLoading()
      })
  }, 
  onReachBottom: function () {
    // this.data.loaded || this.data.list.length == this.data.total || this.getList()
  },
  // 季度排行
  guangjun:function(t){
    var e = this;
    var i ={}, guan = a.pdata(t).guan, cate = e.data.cate;
    i.guan = guan, e.setData(i);
    console.log(cate);
    e.getList(cate, guan);
  }
})
