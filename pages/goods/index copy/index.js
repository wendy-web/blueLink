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
    allcategory: [],
    catlevel: -1, 
    opencategory: !1,
    category: {},
    category_child: [],
    category_third: [],
    filterBtns: {},
    isfilter: 0,
    list: [],
    params: {},
    total: 0,
    defaults: {
      keywords: "",
      isrecommand: "",
      ishot: "",
      isnew: "",
      isdiscount: "",
      issendfree: "",
      istime: "",
      cate: "",
      order: "",
      by: "desc",
      merchid: 0
    },
    lastcat: "",
    fromsearch: !1,
    searchRecords: []
  },
  onLoad: function(t) {
    if(t.merchid){
          this.setData({
            merchid: t.merchid
          })
    }
    if (!e.isEmptyObject(t)) {
      var a = t.isrecommand || t.isnew || t.ishot || t.isdiscount || t.issendfree || t.istime ? 1 : 0;
      this.setData({
        params: t,
        isfilter: a,
        filterBtns: t,
        fromsearch: t.fromsearch || !1
      })
    }
    this.initCategory(), t.fromsearch || this.getList(), this.getRecord()
  },
  onShow: function() {
    this.data.fromsearch && this.setFocus()
  },
  onReachBottom: function() {
    this.data.loaded || this.data.list.length == this.data.total || this.getList()
  },
  initCategory: function() {
    var t = this;
    a.get("goods/get_category", { merchid: t.data.merchid}, function(a) {
      t.setData({
        allcategory: a.allcategory,
        category_parent: a.allcategory.parent,
        category_child: [],
        category_third: [],
        catlevel: a.catlevel,
        opencategory: a.opencategory
      })
    })
  },
  // 获取列表
  getList: function() {
    var t = this;
    t.setData({
      loading: !0
    }), t.data.params.page = t.data.page, a.get("goods/get_list", t.data.params, function(a) {
      var e = {
        merchid: t.data.merchid,
        loading: !1,
        total: a.total
      };
      a.list || (a.list = []), a.list.length > 0 && (e.page = t.data.page + 1, e.list = t.data.list.concat(a.list), a.list.length < a.pagesize && (e.loaded = !0)), t.setData(e)
    })
  },
  changeMode: function() {
    "block" == this.data.listmode ? this.setData({
      listmode: ""
    }) : this.setData({
      listmode: "block"
    })
  },
  bindSort: function(t) {
    var a = t.currentTarget.dataset.order,
      e = this.data.params;
    if ("" == a) {
      if (e.order == a) return;
      e.order = "", this.setData({
        listorder: ""
      })
    } else if ("minprice" == a) this.setData({
      listorder: ""
    }), e.order == a ? "desc" == e.by ? e.by = "asc" : e.by = "desc" : e.by = "asc", e.order = a, this.setData({
      listorder: e.by
    });
    else if ("sales" == a) {
      if (e.order == a) return;
      this.setData({
        listorder: ""
      }), e.order = "sales", e.by = "desc"
    }
    this.setData({
      params: e,
      page: 1,
      list: [],
      loading: !0,
      loaded: !1,
      sort_selected: a
    }), this.getList()
  },
  showFilter: function() {
    this.setData({
      isFilterShow: !this.data.isFilterShow
    })
  },
  btnFilterBtns: function(t) {
    var a = t.target.dataset.type;
    if (a) {
      var s = this.data.filterBtns;
      s.hasOwnProperty(a) || (s[a] = ""), s[a] ? delete s[a] : s[a] = 1;
      var i = e.isEmptyObject(s) ? 0 : 1;
      this.setData({
        filterBtns: s,
        isfilter: i
      })
    }
  },
  bindFilterCancel: function() {
    this.data.defaults.cate = "";
    var t = this.data.defaults;
    this.setData({
      page: 1,
      params: t,
      isFilterShow: !1,
      lastcat: "",
      cateogry_parent_selected: "",
      category_child_selected: "",
      category_third_selected: "",
      category_child: [],
      category_third: [],
      filterBtns: {},
      loading: !0,
      loaded: !1,
      listorder: "",
      list: []
    }), this.getList()
  },
  bindFilterSubmit: function() {
    var t = this.data.params,
      a = this.data.filterBtns;
    for (var s in a) t[s] = a[s];
    e.isEmptyObject(a) && (t = this.data.defaults), t.cate = this.data.lastcat, this.setData({
      page: 1,
      params: t,
      isFilterShow: !1,
      filterBtns: a,
      list: [],
      loading: !0,
      loaded: !1
    }), this.getList()
  },
  bindCategoryEvents: function(t) {
    var a = t.target.dataset.id;
    this.setData({
      lastcat: a
    });
    var e = t.target.dataset.level;
    1 == e ? (this.setData({
      category_child: [],
      category_third: []
    }), this.setData({
      category_parent_selected: a,
      category_child: this.data.allcategory.children[a]
    })) : 2 == e ? (this.setData({
      category_third: []
    }), this.setData({
      category_child_selected: a,
      category_third: this.data.allcategory.children[a]
    })) : this.setData({
      category_third_selected: a
    })
  },
  bindSearch: function(t) {
    t.target;
    this.setData({
      list: [],
      loading: !0,
      loaded: !1
    });
    var a = e.trim(t.detail.value),
      s = this.data.defaults;
    "" != a ? (s.keywords = a, this.setData({
      page: 1,
      params: s,
      fromsearch: !1
    }), this.getList(), this.setRecord(a)) : (s.keywords = "", this.setData({
      page: 1,
      params: s,
      listorder: "",
      fromsearch: !1
    }), this.getList())
  },
  bindInput: function(t) {
    var a = e.trim(t.detail.value),
      s = this.data.defaults;
    s.keywords = "", s.order = this.data.params.order, s.by = this.data.params.by, "" == a && (this.setData({
      page: 1,
      list: [],
      loading: !0,
      loaded: !1,
      params: s,
      listorder: s.by,
      fromsearch: !0
    }), this.getRecord())
  },
  bindFocus: function(t) {
    "" == e.trim(t.detail.value) && this.setData({
      fromsearch: !0
    })
  },
  bindback: function() {
    wx.navigateBack()
  },
  bindnav: function(t) {
    var a = e.trim(t.currentTarget.dataset.text),
      s = this.data.defaults;
    s.keywords = a, this.setData({
      params: s,
      page: 1,
      fromsearch: !1
    }), this.getList(), this.setRecord(a)
  },
  getRecord: function() {
    var a = t.getCache("searchRecords");
    this.setData({
      searchRecords: a
    })
  },
  setRecord: function(a) {
    if ("" != a) {
      var s = t.getCache("searchRecords");
      if (e.isArray(s)) {
        var i = [];
        i.push(a);
        for (var r in s) {
          if (i.length > 20) break;
          s[r] != a && null != s && "null" != s && i.push(s[r])
        }
        s = i
      } else s = [], s.push(a);
      t.setCache("searchRecords", s)
    } else t.setCache("searchRecords", []);
    this.getRecord()
  },
  delRecord: function() {
    this.setRecord(""), this.setData({
      fromsearch: !0
    })
  },
  setFocus: function() {
    var t = this;
    setTimeout(function() {
      t.setData({
        focusin: !0
      })
    }, 1e3)
  }
})