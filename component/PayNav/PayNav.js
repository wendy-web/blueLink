// component/PayNav/PayNav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo : {
      type : Object,
      value : {}
    },
    singleprice : {
      type : String,
      value : ''
    },
    credit2_back : {
      type: String,
      value : ''
    },
    isfavorite : {
      type: String,
      value : ''
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
    onShowOption: function(e){
      var myEventDetail = {
        type: e.currentTarget.dataset.type
      } 
      this.triggerEvent('OnShow', myEventDetail,{});
    },
    collection: function(){
      this.triggerEvent('collection');
    }
  }
})
