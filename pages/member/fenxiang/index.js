var t = getApp(), a = t.requirejs("core");
import Poster from '../../../miniprogram_dist/poster/poster';
// const posterConfig = {
//   jdConfig: {
//     width: 750,
//     height: 1340,
//     backgroundColor: '#ffffff',
//     debug: false, 
//     pixelRatio: 1,
//     images: [
//       {
//         width: 750,
//         height: 1340,
//         x: 0,
//         y: 0,
//         url: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/haibao.png',
//       },
//       {
//         width: 160,
//         height: 160,
//         x: 290,
//         y: 780,
//         url: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/daipingjia.png',
//       }
//     ]

//   }
// }

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
    tempFilePaths: [],
    showbtn:!1,
    posterConfig: {
      width: 750,
      height: 1340,
      backgroundColor: '#ffffff',
      debug: false,
      pixelRatio: 1,
      images: [
        {
          width: 750,
          height: 1340,
          x: 0,
          y: 0,
          url: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/haibao.png',
        },
        {
          width: 160,
          height: 160,
          x: 290,
          y: 780,
          url: 'https://tuanyouyou.cn/addons/wx_shop/plugin/app/static/material/daipingjia.png',
        }
      ]

    },
    background: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    // image:'https://tuanyouyou.cn/attachment/images/96/2019/11/Y35I3hv09bi259iJH0c3mI23YQnVtm.png'
    image: '',
    ako:['']
  },
  onPosterSuccess(e) {
    console.log(e);
    var that = this;
    const { detail } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
    that.setData({
      imagePath: detail,
      canvasHidden: true
    });
  },
  onPosterFail(err) {
    console.error(err);
  },

  //点击保存到相册
  baocun: function () {
    var that = this;
    if(!that.data.imagePath){
      wx.showToast({
        title: '未生成海报',
        icon: 'none',
        duration: 2000
      })
    }
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
          }
        })
      }
    })
  },
  //选择背景
  eventTap:function(c){
    var e = this, i = c.currentTarget.dataset.img;
    e.setData({
      ako: []
    })
    console.log(i)
    var url = 'posterConfig.images[0].url';
    console.log(i);
    e.setData({
      image:i,
      [url]:i,
      ako:['']
    });
  },
  onLoad: function (t) {
    this.getList()
  },
  myTab: function (t) {
    // var e = this, i = a.pdata(t).cate;
    // e.setData({ cate: i, page: 1, list: [] }),
    //   e.getList()
    var e = this, i = a.pdata(t).cate;
    this.setData({
      active: "",
      slider: "out",
      showshare: 0
    })
    e.setData({ cate: i });
    if (i =="shiti"){
      a.get("share/share_image_video", { }, function (b) {
        console.log(b);
        if(b.error==0){
          console.log(b.share_videos)
          e.setData({ share_images: b.share_images, share_videos: b.share_videos});
        }
      })
    } else if (i == "shangchuan"){
      e.setData({ tempFilePaths: []});
    } else if (i == "shop"){
      a.post("share/share_backgrounds", {}, function (b) {
        console.log(b);
        if (b.error == 0) {
          var urlS = 'posterConfig.images[0].url';
          var url = 'posterConfig.images[1].url';
          e.setData({ 
            background: b.list, 
            [url]:b.qrcode,
            [urlS]: b.list[0].images,
            image: b.list[0].images,
          });
        }
      })
    }
    
  },
  uploadBtn:function(){
    var e = this;
    e.setData({ showbtn: 1});
  },
  // 上传图片
  fileimg: function () {
    var a = this;
    var imgArr = a.data.tempFilePaths;
    a.setData({
      hs_btnshow: true
    })
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
          showbtn: !1
        })
      }
    })
  },
  //上传视频
  upload_video() {
    console.log(2222222);
    var that = this;
    that.setData({
      hs_btnshow: false
    })
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      camera: 'back',
      success: res => {
        console.log(res);
        let uploaderList = that.data.tempFilePaths.concat(res.tempFilePath);

        that.setData({
          tempFilePaths: uploaderList,
          showbtn: false
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getList: function () {
    var t = this;
    a.loading(), this.setData({ loading: !0 }),
      a.get("share/onekey_share", { page: this.data.page}, function (e) {
        console.log(e);
        // e.list.forEach(function (o) {
        //   console.log(o)
        //   if (o.couponname == '收银优惠卷') {
        //     o.sic = '0';
        //     o.imgc = 'blue'
        //   } else if (o.couponname == '购物优惠卷') {
        //     o.sic = '_j2';
        //     o.imgc = 'blue1'
        //   } else if (o.couponname == '充值优惠卷') {
        //     o.sic = '_c';
        //     o.imgc = 'red'
        //   }

        // })
        var i = { loading: !1, total: e.total, pagesize: e.pagesize}; e.list.length > 0 && (i.page = t.data.page + 1, i.list = t.data.list.concat(e.list),
          e.list.length < e.pagesize && (i.loaded = !0)), t.setData(i), a.hideLoading()
      })
  }, 

  onReachBottom: function () {
    this.data.loaded || this.data.list.length == this.data.total || this.getList()
  },
  jump: function (t) {
    var e = a.pdata(t).id; e > 0 && wx.navigateTo({ url: "/pages/sale/coupon/my/detail/index?id=" + e })
  },
  // 分享到好友
  showShare: function (t) {
    var a = this;
    a.setData({
      active: "active",
      slider: "in",
      showshare: 1
    })
  },
  // 关闭分享
  emptyActive: function () {
    this.setData({
      active: "",
      slider: "out",
      showshare: 0
    })
  },
// 分享视频
  shareVideoHandle:function(event){
    console.log('1122')
    console.log(event.currentTarget.dataset.video)
  },
  bindTextAreaBlur:function(e){
    console.log(e.detail.value);
    this.setData({
      textneirong: e.detail.value
    })
  },
  // 我要上传
  formSubmit: function (submitData) {
    var a = this,
      imageList = a.data.tempFilePaths,
      textneirong = a.data.textneirong;
      // op = a.data.options,
      // sb = submitData.detail.value;
    var data = {
      'content': textneirong
      // 'orderid': op.orderid,
      // 'teamid': op.teamid,
      // 'rtype': sb.rtype,
      // 'reason': sb.reason,
      // 'price': sb.price,
      // 'content': sb.content
    }
    var data1 = {}, imgArr = [];//上传图片数组
    var arrImg = [];//上传视频数组
    var imgarr = [],//最终上传图片数组 
    arrVideo = [];//最终上传视频数组
    imageList.forEach(function (o) {
      // console.log(o)
      if (a.getFileType(o) == 'image') {
        //图片
        arrImg.push(o);
      } else {
        // 视频
        imgArr.push(o);
      }
    })
    var e = t.requirejs("core")
    // console.log(imgArr);
    if (arrImg.length != 0) {
      //图片
      // data.images = arrImg;
      data.type = 1;
  
      var allData = e.getUrl("util/uploader/upload", { file: "file",type:'image' }, function (res) {

      });
      data1.arr = arrImg;
      console.log(data1);
      a.myUploadimg(
        data1,
        function (res) {//成功
          console.log(res);
          imgarr.push(res.files[0].url)
        },
        function (res) {
          console.log('上传失败');
        },
        function (res) {
          data.images = imgarr;
          e.post("share/upload", data, function (res) {
            if (res.error == 0) {
              wx.switchTab({
                url: "/pages/member/index/index"
              })
            } else {
              e.alert(res.message);
            }
          })
        },
        allData
      )

    } else {
      //视频
      // data.video = imgArr;
      data.type = 2;

      var allData = e.getUrl("util/uploader/upload", { file: "file", type: 'video' }, function (res) {

      });
      data1.arr = imgArr;
      a.myUploadimg(
        data1,
        function (res) {//成功
          arrVideo.push(res.files[0].url)
        },
        function (res) {
          console.log('上传失败');
        },
        function (res) {
          data.video = arrVideo;
          e.post("share/upload", data, function (res) {
            if (res.error == 0) {
              wx.switchTab({
                url: "/pages/member/index/index"
              })
            } else {
              e.alert(res.message);
            }
          })
        },
        allData
      )
    }
    // data.images = imgArr;
    // var e = t.requirejs("core");
    // e.post('share/upload', data, function (res) {
    //   console.log(res);
    //   if (res.error == 0 ) {        
    //     wx.switchTab({
    //       url: "/pages/member/index/index"
    //     })
    //   } else {
    //     e.alert(r.message);
    //   }
    // })
  },
  //判断是图片/视频
  getFileType:function(name) {
    if(!name) return false;
        var imgType = ["gif", "jpeg", "jpg", "bmp", "png"];
        var videoType = ["avi", "wmv", "mkv", "mp4", "mov", "rm", "3gp", "flv", "mpg", "rmvb"];
        if(RegExp("\.(" + imgType.join("|") + ")$", "i").test(name.toLowerCase())) {
      return 'image';
    } else if (RegExp("\.(" + videoType.join("|") + ")$", "i").test(name.toLowerCase())) {
      return 'video';
    } else {
      return false;
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
  },

})
