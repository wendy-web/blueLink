// component/Address/Address.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    address : Object,
    pickAddress : Object,
    huoAddress:Object,
    pick_class : Boolean,
    express_class : Boolean,
    huo_class: Boolean,
    show:{
      type: Boolean,
      value: true
    },
    tihuo:{
      type:String,
      value:"请选择提货方式"
    },
    fanshi: {
      type: String,
      value: "如 你 选 择 快 递 配 送 ， 需 另 加 运 费"
    },
    peisong:{
      type:String,
      value:"快递配送"
    },
    xianshow: {
      type: Boolean,
      value: false
    },
    titleshow:{
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    address : function(){
      this.triggerEvent('address');
    },
    pickUpPoint : function(){
      this.triggerEvent('pickUpPoint');
    },
    pickUpWang:function(){
      this.triggerEvent('pickUpWang');
    }
  }
})
