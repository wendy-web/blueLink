var t = getApp(), a = t.requirejs("core");
Page({
  data: {
    region: ["省", "市", "区"],
    addr_detail: "",
    lon_lat: "",
    applyStatus: -1
  },
  onLoad: function (t) {
    this.getApplyStatus()
  }, 
  getApplyStatus(){
    var that = this
    a.post("partner/apply_detail",{apply_type: 1}, function (data) {
      console.log(data.apply_record.status)
      if(data.apply_record){
        that.setData({
          zhanghao: data.apply_record.nickname,
          mobile: data.apply_record.telephone,
          addr_detail: data.apply_record.address,
          applyStatus: data.apply_record.status
        })
      }
    }) 
  },
  //获取准确地址
  chose_location: function (g) {
    var r = this;
    wx.chooseLocation({
      success: function (t) {
        // console.log(t);
        var e = t.longitude + "," + t.latitude, a = t.address, n = r.data.region, i = "", o = a, s = new RegExp("(.*?省)(.*?市)(.*?区)", "g"), l = s.exec(o);
        null == l && null == (l = (s = new RegExp("(.*?省)(.*?市)(.*?市)", "g")).exec(o)) && null == (l = (s = new RegExp("(.*?省)(.*?市)(.*县)", "g")).exec(o)) || (n[0] == l[1] && n[1] == l[2] && n[2] == l[3] || wx.showToast({
          title: "省市区信息已同步修改",
          icon: "none"
        }), n[0] = l[1], n[1] = l[2], n[2] = l[3], i = a.replace(l[0], ""));
        var u = i + t.name, c = "";
        r.setData({
          region: n,
          lon_lat: e,
          addr_detail: u
        });
        console.log(r.data.region);
        console.log(r.data.lon_lat);
        console.log(r.data.addr_detail);
      }
    });
  },
  inputChange(t){
    this.setData({
      addr_detail: t.detail.value
    }) 
  },
  inputname:function(t){
    console.log(t.detail.value)
    this.setData({
      zhanghao: t.detail.value
    });
  },
  inputmobile:function(t){
    this.setData({
      mobile: t.detail.value
    });
  },
  checkboxChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      checkbox: e.detail.value
    });
  },
  // 立即申请
  shengqing:function(){
    var c = this,
      zhanghao = c.data.zhanghao,
      mobile = c.data.mobile,
      address = c.data.addr_detail, //详细地址
      checkbox = c.data.checkbox,
      region = c.data.region, //省市区
      lon_lat = c.data.lon_lat.split(",");  //经纬度
    if (!zhanghao ) {
      wx.showToast({
        title: '请输入你的姓名',
        icon: 'none',
        duration: 2000
      })
      return
    } else if ("" == mobile || !/^1(3|4|5|6|7|8|9)\d{9}$/.test(mobile)){
      wx.showToast({
        title: '请输入你的手机号',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (!address) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (!checkbox){
      wx.showToast({
        title: '请先勾选合同',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (!region) {
      wx.showToast({
        title: '没有获取到省市区',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (!lon_lat) {
      wx.showToast({
        title: '没有获取到经纬度',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var data = {
      'nickname': zhanghao,
      'telephone': mobile,
      'province': region[0],
      'city': region[1],
      'area': region[2],
      'address': address,
      'longitude': lon_lat[0],
      'latitude': lon_lat[1]
    }
    // 申请团长
    a.post("partner/partner_apply", data, function (res) {
      console.log(res);
      wx.showToast({
        title: res.message,
        icon: 'success',
        duration: 2000
      })
      if (res.error == 0) {
        setTimeout(function(){
          wx.switchTab({
            url: "/pages/member/index/index"
          })
        }, 2000)
      }
    })
  }
})
