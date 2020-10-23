var t = getApp(), a = t.requirejs("core");
Page({
  data: {
    hostUrl: t.globalData.ImgUrl,
    cate: "",
    page: 1, 
    loading: !1, 
    loaded: !1,
    list: [],
    active: 0,
    broadImg: ''
  },
  onLoad: function (t) {
    this.getList()
    this.setData({
      broadImg: this.data.hostUrl + 'index/iconLive0' + this.data.active + '.jpg'
    })
  },
  myTab: function (t) {
    // var e = this, i = a.pdata(t).cate;
    // e.setData({ cate: i, page: 1, list: [] }),
    var new_ingex = t.currentTarget.dataset.type
    var e = this, i = a.pdata(t).cate;
    e.setData({
      active: new_ingex,
      broadImg: this.data.hostUrl + 'index/iconLive0' + new_ingex + '.jpg'
    })
    e.setData({ cate: i }),e.getList(i);
  },
  getList: function (n) {
    var t = this;
    a.loading(), this.setData({ loading: !0 }),
      a.get("goods/category/get_lift_goods", { ccate:n}, function (e) {
        console.log(e);
        var i = {
          ccates: e.ccates,
          goods : e.goods,
          pcate_detail: e.pcate_detail,
          total: e.total,
          pagesize: e.pagesize,
          pcate: e.pcate
        }
        t.setData(i)
        a.hideLoading()
      })
  }, 
  // 下拉加载请求的接口
  getxiala:function(){
    var t = this;
    var ccates = t.data.ccates;
    var pcate = t.data.pcate;
    var goods = t.data.goods;
    var page = t.data.page + 1;
    a.loading(), this.setData({ loading: !0 }),
      a.get("goods/category/get_goods_list", { ccate: ccates, pcate: pcate, page:page }, function (e) {
      console.log(e);
      var i = {
        goods: goods.concat(e.goods),
        total: e.total,
        pagesize: e.pagesize,
        page:e.page
      }
      t.setData(i);
      a.hideLoading();
    })
  },
  onReachBottom: function () {
    console.log(333333)
    this.data.loaded || this.data.goods.length == this.data.total || this.getxiala()
  }

})
