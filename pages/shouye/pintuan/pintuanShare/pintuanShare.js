// pages/shouye/pintuan/pintuanShare/pintuanShare.js
var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({
  showBuyModal() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      /**
        * http://cubic-bezier.com/ 
        * linear 动画一直较为均匀
        * ease 从匀速到加速在到匀速
        * ease-in 缓慢到匀速
        * ease-in-out 从缓慢到匀速再到缓慢
        * 
        * http://www.tuicool.com/articles/neqMVr
        * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
        * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
        */
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showModalStatus: true
    })
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
      })
      // console.log(this)
    }, 200)
  },

  hideBuyModal() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
      // console.log(this)
    }.bind(this), 200)
  },

  getTimeLeft: function (datetimeTo) {
    // 计算目标与现在时间差（毫秒）
    let time1 = new Date(datetimeTo).getTime();
    let time2 = new Date().getTime();
    let mss = time1 - time2;

    // 将时间差（毫秒）格式为：天时分秒
    let days = parseInt(mss / (1000 * 60 * 60 * 24));
    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((mss % (1000 * 60)) / 1000);

    return days + "天" + hours + "时" + minutes + "分" + seconds + "秒"
  },


  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,   //规格弹出框
    teamid : '',
    info : '',
    modelInfo : '',           //规格
    userid : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!t.getCache('userinfo')){
      wx.showModal({
        title: '温馨提示',
        content: '请到会员中心登录授权',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/member/index/index',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.switchTab({
              url: '/pages/member/index/index',
            })
          }
        }
      })
    }
    console.log(options);
    this.setData({
      teamid : options.teamid,
      userid: options.userid
    });
    this.getInfo();
  },
  getInfo:function(){
    wx.showLoading({
      title: '加载中',
      icon:'loading'
    })
    e.get('groups/team/detail',
    {
      teamid : this.data.teamid
    },
    res=>{
      wx.hideLoading();
      console.log(res);
      clearInterval(time);
      var time;
      time = setInterval(()=>{
        res.result.time = this.getTimeLeft(res.result.lasttime2);
        this.setData({
          info: res.result
        })
        if (res.result.time == "0天0时0分0秒"){
          clearInterval(time);
        }
      },1000);
    })
  },

  showModel: function(){
    var gid = this.data.info.goods.gid;
    wx.showLoading({
      title: '加载',
      icon: 'loading'
    })
    e.get('goods/get_picker',
    {
      id : gid
    },
    res=>{
      wx.hideLoading();
      console.log(res);
      res.specs.forEach(item => {
        item.items.forEach(i => {
          i.sele = false
        })
      });
      var obj = res;
      console.log(obj);
      this.setData({
        modelInfo: obj
      })
      this.showBuyModal();
    });
  },


  /**点击每一个规格修改选择状态 */
  sele: function (e) {
    var that = this;
    var _id = e.currentTarget.dataset.id;  //选中的规格id
    var _specs = e.currentTarget.dataset.specs;   //哪一种规格分类
    console.log(_specs);
    var _modelInfo = that.data.modelInfo;
    for (var i = 0; i < _modelInfo.specs.length; i++) {
      if (_modelInfo.specs[i].title === _specs.title) {
        for (var j = 0; j < _modelInfo.specs[i].items.length; j++) {
          //判断点击的规格项
          if (_modelInfo.specs[i].items[j].id == _id) {
            //已经选中的了就取消选中状态
            if (_modelInfo.specs[i].items[j].sele) {
              _modelInfo.specs[i].items[j].sele = false;
            } else {
              //如果未选就给选中状态
              _modelInfo.specs[i].items[j].sele = true;
            }
          } else {
            _modelInfo.specs[i].items[j].sele = false;
          }
        }
      }
    }
    that.setData({
      modelInfo: _modelInfo
    });
    console.log(that.data.modelInfo);
    // return
    //重新计算修改后的信息
    that.changeModelInfo();
    var str;
    var myType = typeof that.data.checkedVal;
    //拼接规格 
    if (myType == 'object') {
      var info = that.data.checkedVal;
      // console.log(info);
      str = info.join("+");
      console.log(str);
      //str 与  goods.options每一个组合对象的title做匹配
      for (var i = 0; i < that.data.modelInfo.options.length; i++) {
        var obj = that.data.modelInfo.options[i];
        if (str == obj.title) {
          // 把匹配到的组合id，组合价格保存到全局的data
          that.setData({
            shopId: obj.id,
            price: obj.groupsprice
          });
        }
      }
    } else {
      that.setData({
        shopId: ''
      });
    }

  },

  changeModelInfo: function () {
    var that = this;
    var seleArr = that.getCheckedSpecValue();
    // console.log(seleArr);
    var _checkedVal = seleArr.filter(n => {
      if (n.item_title) {
        return true
      } else {
        return false
      }
    }).map(v => {
      return v.item_title
    });
    // console.log(_checkedVal);
    if (_checkedVal.length == seleArr.length) {
      that.setData({
        checkedVal: _checkedVal
      });
    } else {
      that.setData({
        checkedVal: '请选择全部规格'
      })
    }

  },


  /**返回选择结果 */
  getCheckedSpecValue: function () {
    var that = this;
    var specsArr = [];   //存放各种选中的规格对象
    var _modelInfoSpecs = that.data.modelInfo.specs;   /*选中和没选中的都在这儿了，接下来吧选中的洗出来 */
    for (var i = 0; i < _modelInfoSpecs.length; i++) {
      /**存放选中的规格对象 */
      var seleObj = {
        title: _modelInfoSpecs[i].title,   //那种规格
        item_title: ''                     //什么样的规格
      }
      for (var j = 0; j < _modelInfoSpecs[i].items.length; j++) {
        if (_modelInfoSpecs[i].items[j].sele) {
          seleObj.item_title = _modelInfoSpecs[i].items[j].title;
        }
      }
      specsArr.push(seleObj);
    }
    return specsArr;   //洗好的数据都在这个数组了 return出去
  },


  /**点击确定去订单页 */
  optionsPay: function () {
    var that = this;
    var share_mid = that.data.userid;  //分享者id
    var _heads;
    var _teamid = this.data.teamid;
    var _id = that.data.info.goods.id;
    var _optionid = that.data.shopId;  //规格组合id
    var _type = 'groups';   //购买类型
    
    if (_type == 'groups') {
      _heads = 1
    } else {
      _heads = 0
    }
    // return
    console.log(share_mid);//分享者id
    console.log(_teamid);   //团购id
    console.log(_id);  //实际商品id
    console.log(_optionid); //规格组合id
    if (_optionid) {
      wx.navigateTo({
        url: '/pages/shouye/pintuan/ptOrder/ptOrder?id=' + _id + '&_optionid=' + _optionid + '&_type=' + _type + '&_heads=' + _heads + '&share_mid=' + share_mid +'&teamid='+ _teamid
      })
    }else{
      wx.navigateTo({
        url: '/pages/shouye/pintuan/ptOrder/ptOrder?id=' + _id + '&_type=' + _type + '&_heads=' + _heads + '&share_mid=' + share_mid +'&teamid='+ _teamid
      })
    }


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
    // this.getInfo();
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