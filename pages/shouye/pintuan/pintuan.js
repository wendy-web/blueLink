var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("jquery"));
Page({
  data: {
    height: '',  //屏幕高度
    heads : '',   //开团是1 参团是0
    showModalStatus : false,   //规格弹出框
    id: '',      //拼团商品id
    goods: '',     //拼团商品数据
    team_ing: '',     //拼团列表数据
    total_team_ing:'',   //拼团列表 多少人在拼团
    timeLeft: "" ,   // 剩下的时间（天时分秒）
    page: 1,
    list : [],   //购买记录列表
    goodsInfo:'', //商品规格 
    attributeList: [],
    shopId : '',  //商品组合规格id  
    str : '',  
    shopType : '',  //商品购买类型  单独买or拼团买
    isfavorite : '',
    share_mid : '',    //分享者的id
    thumb: '',//商品的头像
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.setData({
      id : options.id,
      team_ing : ''
    })
    that.getRecord();
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight
        });
      },
    })
  },
  
  /**收藏/取消收藏 */
  collection : function(){
    var that = this;
    var _isfavorite
    if (that.data.goods.isfavorite==0){
      _isfavorite = 1;
    }else{
      _isfavorite = 0;
    }
    var data = {
      isfavorite : _isfavorite,
      id : that.data.goods.gid
    }
    console.log(that.data.goods.gid)
    console.log('shouc')
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    });
    e.get('member/favorite/toggle',data,res=>{
      wx.hideLoading();
      console.log(res);
      var _goods = that.data.goods;
      if(res.isfavorite){
        _goods.isfavorite = 1;
        that.setData({
          goods: _goods
        })
      }else{
        _goods.isfavorite = 0;
        that.setData({
          goods: _goods
        })
      }
    })
  },

  /**获取购买记录 */
  getRecord : function(){
    var that= this;
    e.post('groups/goods/get_buy_records',
    {
      id:that.data.id,
      page: that.data.page
    },res=>{
      wx.hideLoading();
      console.log(res.result.list);
      if (res.result.list.length){
        var _list = that.data.list.concat(res.result.list);
        that.setData({
          list : _list
        })
      }else{
        wx.showToast({
          title: '没有更多了',
        })
      }
    });
  },
  /**获取商品规格 */
  getShopOption : function(){
    // wx.showLoading({
    //   title: '加载中',
    //   icon: 'loading',
    // });
    var gid = this.data.goods.gid;
    console.log(gid);
    if (!this.data.goodsInfo) {
      e.get('/goods/get_picker', {
        id: gid
      }, res => {
        console.log(res);
        res.specs.forEach(item => {
          // wx.hideLoading();
          item.items.forEach(i => {
            i.sele = false
          })
        });
        var obj = res;
        console.log(res.specs)
        console.log('-------------商品规格属性')
        this.setData({
          goodsInfo: obj
        })
      })
    }
  },

  //点击底部单独购买和发起拼团
  OnShow:function(event){
    console.log(event.detail.type);
    if (event.detail.type == 1){
      this.setData({
        shopType: 'single'
      });
    }else{
      this.setData({
        shopType: 'groups'
      });
    }
    if(this.data.goodsInfo.options){
      this.showBuyModal();
    }else{
      //无规格弹窗，直接跳支付页面
      this.optionsPay();
    }
  },
  /**点击每一个规格修改选择状态 */
  sele : function(e){
    var that =this;
    var _id = e.currentTarget.dataset.id;  //选中的规格id
    var _specs = e.currentTarget.dataset.specs;   //哪一种规格分类
    console.log(_specs);
    var _goodsInfo = that.data.goodsInfo;
    for(var i=0;i<_goodsInfo.specs.length;i++){
      if(_goodsInfo.specs[i].title === _specs.title){
        for (var j = 0; j < _goodsInfo.specs[i].items.length;j++){
          //判断点击的规格项
          if (_goodsInfo.specs[i].items[j].id == _id){
            //已经选中的了就取消选中状态
            if (_goodsInfo.specs[i].items[j].sele){
              _goodsInfo.specs[i].items[j].sele = false;
            }else{
            //如果未选就给选中状态
              _goodsInfo.specs[i].items[j].sele = true;
            }
          }else{
            _goodsInfo.specs[i].items[j].sele = false;
          }
        }
      }
    }
    that.setData({
      goodsInfo : _goodsInfo
    });
    console.log(that.data.goodsInfo);
    //重新计算修改后的信息
    that.changeGoodsInfo();
    var str;
    var myType = typeof that.data.checkedVal;
    //拼接规格 
    if(myType == 'object'){
      var info = that.data.checkedVal;
      // console.log(info);
      str = info.join("+");
      console.log(str);
      //str 与  goods.options每一个组合对象的title做匹配
      for (var i = 0; i < that.data.goodsInfo.options.length; i++) {
        var obj = that.data.goodsInfo.options[i];
        if(str == obj.title){
          // 把匹配到的组合id，组合价格保存到全局的data
          that.setData({
            shopId : obj.id,
            price: obj.groupsprice
          });
        }       
      }
    }else{
      that.setData({
        shopId : ''
      });
    }
    
  },
  changeGoodsInfo : function(){
    var that = this;
    var seleArr = that.getCheckedSpecValue();
    // console.log(seleArr);
    var _checkedVal = seleArr.filter(n=>{
      if(n.item_title){
        return true
      }else{
        return false
      }
    }).map(v=>{
      return v.item_title
    });
    // console.log(_checkedVal);
    if(_checkedVal.length == seleArr.length){
      that.setData({
        checkedVal : _checkedVal
      });
    }else{
      that.setData({
        checkedVal : '请选择全部规格'
      })
    }

  },
  /**返回选择结果 */
  getCheckedSpecValue : function(){
    var that = this;
    var specsArr = [];   //存放各种选中的规格对象
    var _goodsInfoSpecs = that.data.goodsInfo.specs;   /*选中和没选中的都在这儿了，接下来吧选中的洗出来 */
    for(var i = 0; i < _goodsInfoSpecs.length; i++){
      /**存放选中的规格对象 */
      var seleObj = {
        title: _goodsInfoSpecs[i].title,   //那种规格
        item_title: ''                     //什么样的规格
      }
      for(var j=0; j < _goodsInfoSpecs[i].items.length; j++){
        if (_goodsInfoSpecs[i].items[j].sele){
          seleObj.item_title = _goodsInfoSpecs[i].items[j].title;
        }
      }
      specsArr.push(seleObj);
    }
    return specsArr;   //洗好的数据都在这个数组了 return出去
  },
  /**点击确定去订单页 */
  optionsPay:function(){
    var that = this;
    var share_mid = that.data.share_mid;
    var _heads;
    var _id = that.data.id; 
    var _optionid = that.data.shopId;  //规格组合id
    var _type = that.data.shopType;   //购买类型 ,拼团或者单独购买
    if (_type == 'groups'){
      _heads = 1
    }else{
      _heads = 0
    }
    console.log(_optionid)
    // 有商品的规格属性
    if(that.data.goodsInfo.specs.length){
      if (_optionid){
        wx.navigateTo({
          url: '/pages/shouye/pintuan/ptOrder/ptOrder?id=' + _id + '&_optionid=' + _optionid + '&_type=' + _type + '&_heads=' + _heads + '&share_mid=' + share_mid
        })
      } else{
        wx.showToast({
          title: '请选择商品的规格',
          icon: 'none',
          duration: 2000
        })
      }
    } else{
      wx.navigateTo({
        url: '/pages/shouye/pintuan/ptOrder/ptOrder?id=' + _id + '&_optionid=' + _optionid + '&_type=' + _type + '&_heads=' + _heads + '&share_mid=' + share_mid
      })
    }
    // if (_optionid){
    //   wx.navigateTo({
    //     url: '/pages/shouye/pintuan/ptOrder/ptOrder?id=' + _id + '&_optionid=' + _optionid + '&_type=' + _type + '&_heads=' + _heads + '&share_mid=' + share_mid
    //   })
    // } else{
    //   console.log("没有选择对应的商品")
    //   wx.navigateTo({
    //     url: '/pages/shouye/pintuan/ptOrder/ptOrder?id=' + _id + '&_optionid=' + _optionid + '&_type=' + _type + '&_heads=' + _heads + '&share_mid=' + share_mid
    //   })
    // }
  },

  onShow: function () {
    var that = this;
    if (!that.data.id) return;
    wx.showLoading({ 
      title: '加载中',
      icon: 'loading',
    });
    e.post("/groups/goods",
    { id: that.data.id }, 
    res => {
      wx.hideLoading();
      console.log(res.result);
      res.result.team_ing.forEach((item, index) => {
        var time = 'time_'+index;
        clearTimeout(time);
        var arr = [];
        time = setInterval(() => {
          item.timeLeft = that.getTimeLeft(item.count_down);
          that.setData({
            team_ing: res.result.team_ing,
          })
          if (item.timeLeft == "0天0时0分0秒") {
            clearInterval(time);
          }
        }, 1000);

      })
      console.log(res.result.goods)
      console.log(')))))))))))))))))))))')
      that.setData({
        goods: res.result.goods,
        total_team_ing: res.result.total_team_ing,
        price: res.result.goods.groupsprice,
        singleprice: res.result.goods.singleprice,
        groupsprice: res.result.goods.groupsprice,
        thumb: res.result.goods.thumb
      });
      that.getShopOption();
    })  
  },  

  getTimeLeft : function(datetimeTo){
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

  join : function(e){
    // console.log(e.currentTarget.dataset.teamid);
    var teamid = e.currentTarget.dataset.teamid;
    wx.navigateTo({
      url: '/pages/shouye/pintuan/pintuanShare/pintuanShare?teamid=' + teamid,
    })
  },

  ptMore : function(){
    wx.navigateTo({
      url: '/pages/shouye/pintuan/pt_more/pt_more?id='+this.data.id,
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data.goods.title
    }
  },


  showBuyModal() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
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

  loadMore : function(){
    console.log('爱你哟');
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
    });
    var _page = this.data.page;
    _page = Number(_page) + 1;
    this.setData({
      page : _page
    })
    this.getRecord();
  }
})