var t = getApp(), a = t.requirejs("core");
Page({
  data: {
    region: ["省", "市", "区"],
    addr_detail: "",
    lon_lat: "",
    tempFilePaths: [], //上传证件
    switch1Checked:false,
    type: 0,
    yunying:"",
    applyStatus: -1
  }, 
  onLoad: function (t) {
    this.getApplyStatus()
  },
  getApplyStatus(){
    var that = this
    a.post("partner/apply_detail",{apply_type: 4}, function (data) {
      console.log(data)
      if(data.apply_record) {
        that.setData({
          zhanghao: data.apply_record.nickname,
          mobile: data.apply_record.telephone,
          addr_detail: data.apply_record.address,
          applyStatus: data.apply_record.status,
          shenfen: data.apply_record.idcard,
          type: data.apply_record.type,
          switch1Checked: data.apply_record.type == 0 ? false :true,
          // yunying: data.apply_record.centre_num
        })
        if(data.apply_record.status == 1 || data.apply_record.status == 0){
          that.setData({
            tempFilePaths: data.apply_record.certificate
          })
        }
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
      }
    });
  },
  checkboxChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      checkbox: e.detail.value
    });
  },
  inputname: function (t) {
    this.setData({
      zhanghao: t.detail.value
    });
  },
  inputmobile: function (t) {
    this.setData({
      mobile: t.detail.value
    });
  },
  inputshenfen:function(t){
    this.setData({
      shenfen: t.detail.value
    });
  },
  inputChange(t){
    this.setData({
      addr_detail: t.detail.value
    })
  },
  switch1Change:function(e){
    // console.log(e.detail.value)
    if (e.detail.value){
      this.setData({
        switch1Checked: e.detail.value,
        type:1
      });
    }else{
      this.setData({
        switch1Checked: e.detail.value,
        type: 0
      });
    }
    console.log(this.data.type)
  },
  inputyunying:function(t){
    this.setData({
      yunying: t.detail.value
    });
  },
  // 上传图片
  uploadImgBtn: function () {
    var a = this;
    var imgArr = a.data.tempFilePaths;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        res.tempFilePaths.forEach(function (o) {
          imgArr.push(o)
        })
        a.setData({
          tempFilePaths: imgArr,
        })
      }
    })
  },
  shengqing: function () {
    var c = this,
      zhanghao = c.data.zhanghao,
      mobile = c.data.mobile,
      address = c.data.addr_detail, //详细地址
      checkbox = c.data.checkbox,
      region = c.data.region, //省市区
      lon_lat = c.data.lon_lat.split(","),  //经纬度
      imageList = c.data.tempFilePaths,//上传证件
      shenfen = c.data.shenfen,
      yunying = c.data.yunying,
      typeri = c.data.type;
    console.log(c.data.type);
    if (!zhanghao) {
      wx.showToast({
        title: '请输入你的姓名',
        icon: 'none',
        duration: 2000
      })
      return
    } else if ("" == mobile || !/^1(3|4|5|6|7|8|9)\d{9}$/.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (!address) {
      wx.showToast({
        title: '请获取定位信息',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (!checkbox) {
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
    } else if (imageList.length==0) {
      wx.showToast({
        title: '请上传证件',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (!shenfen) {
      wx.showToast({
        title: '请输入身份证号',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (typeri == 1) {
      if (!yunying){
        wx.showToast({
          title: '请输入开通运营中心编号',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    var data = {
      'nickname': zhanghao,
      'telephone': mobile,
      'province': region[0],
      'city': region[1],
      'area': region[2],
      'address': address,
      'longitude': lon_lat[0],
      'latitude': lon_lat[1],
      'idcard': shenfen,
      'type': typeri,
      'centre_num': yunying //运营中心编号
    }

    var data1 = {}, imgArr = [];//上传图片数组
    var arrImg = [];
    var imgarr = [];//最终上传图片数组 
    imageList.forEach(function (o) {
      arrImg.push(o);
    })
    var e = t.requirejs("core");
    if (arrImg.length != 0) {
      //图片
      var allData = e.getUrl("util/uploader/upload", { file: "file", type: 'image' }, function (res) {
      });
      data1.arr = arrImg;
      // console.log(data1);
      c.myUploadimg(
        data1,
        function (res) {//成功
          console.log(res);
          imgarr.push(res.files[0].url)
        },
        function (res) {
          console.log('上传失败');
        },
        function (res) {
          data.certificate = imgarr;
          e.post("partner/operate_centre_apply", data, function (res) {
            console.log(res);
            if (res.error == 0) {
              c.setData({
                order: res.order,
                wechat: res.wechat
              })
              var a = c.data.wechat;
              // console.log(a);
              e.pay(a.payinfo, function (t) {
                console.log(t);
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000
                })

              });
              // wx.switchTab({
              //   url: "/pages/member/index/index"
              // })
            } else {
              e.alert(res.message);
            }
          })
        },
        allData
      )
    }
  },
  //上传图片
  myUploadimg: function (data, _success, _fail, _complete, allData) {
    var self = this,
      success = data.success || 0,//成功次数
      i = data.i || 0,//当前文件下标
      fail = data.fail || 0,//失败次数
      invalid = data.invalid || 0,//图片格式错误
      filePath = data.arr[i];//图片路径数组
    console.log(filePath);
    wx.uploadFile({
      url: allData,
      filePath: filePath,
      name: 'file',
      formData: {},
      success: function (res) {

        var d = JSON.parse(res.data);
        //console.log(d)
        var isSuccess;
        i++;
        success++;
        if (i == data.arr.length) {
          isSuccess = true;
        }
        if (typeof _success === "function") _success(d, isSuccess, invalid);
      },
      fail: function (res) {
        //console.log(res);
        var d = JSON.parse(res.data);
        var isSuccess;
        i++;
        fail++;
        //console.log("fail:", fail);
        if (i == data.arr.length) {
          isSuccess = true;
        }

        if (typeof _fail === "function") _fail(d, isSuccess, invalid);
      },
      complete: function (res) {
        //console.log(res)
        var d = JSON.parse(res.data);
        if (d.error == "1") {
          e.alert(res.errMsg);
          return;
        }
        var cb = function () {
          if (i == data.arr.length) {  //当图片传完时，停止调用       
            console.log('执行完毕');
            console.log('成功：' + success + " 失败：" + fail);
            if (typeof _complete === "function") _complete(res);
          } else {
            data.i = i;
            data.success = success;
            data.fail = fail;
            self.myUploadimg(data, _success, _fail, _complete, allData);
          }
        };

        if (/ok/.test(res.errMsg)) {
          var _data = res;
          if (!invalid && _data.status == 1) {
            // 成功且违规图片
            invalid = 1;
            data.invalid = invalid;
          }
        }
        cb();

      }
    })
  }
})
