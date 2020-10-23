// pages/member/detailRecords/index.js
var e = getApp(), r = e.requirejs("core"), t = e.requirejs("wxParse/wxParse");
Page({
  data: {
    height: '',
    width: '',
    lists: [],
    page: 1,
    totalpage: '', 
    scrollend: false,
    bigbg: false,
    imgPic: '',
  }, 
  scroll: function (e) {
    // console.log(e) 
  },
  lower: function (e) {
    // console.log(e)
    // console.log('到底了');
    // console.log(this.data.page)
    let num = this.data.page;
    let page = num + 1;
    let status = this.data.status;
    if (this.data.totalpage > page * 10) {
      console.log('加载内容')
      this.scrollPages(page, status);
      this.setData({
        page : page
      })
    } else {
      this.setData({
        scrollend: true
      })
    }

  },
  scrollPages(page, status) {
    let that = this;
    let data = e.getCache("userinfo");
    if(that.data.vip){
      r.post("member/log/get_vip_credit1_list", {
        "page": page,
        "status": status //入账记录 
      }, function (r) {
        console.log(r)
        if (r.error == 0) {
          let lists = that.data.lists.concat(r.list);
          // console.log(lists)
          that.setData({
            lists: lists,
            totalpage: r.total,
            status: status
          })
        }
      })
    }else{
      r.post("member/log/get_credit1_list", {
        "page": page,
        "status": status //入账记录 
      }, function (r) {
        // console.log(r)
        if (r.error == 0) {
          let lists = that.data.lists.concat(r.list);
          console.log(lists)
          that.setData({
            lists: lists,
            totalpage: r.total,
            status: status
          })
          console.log(r.total)
        }
      })
    }
  },
  onLoad: function (e) {
    // console.log(e);
    if(e.vip){
      this.setData({
        vip:e.vip
      })
    }
    this.scrollPages(1, e.status);
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
      width: wx.getSystemInfoSync().windowWidth
    })
    console.log(this.data.height);
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

  }
})