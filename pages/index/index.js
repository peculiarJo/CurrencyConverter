"use strict";
exports.__esModule = true;
var app = getApp();
Page({
  data: {
    motto: 'Hello Wrld',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currencies: [
      "人民币 - CNY",
      "美元 - USD",
      "欧元 - EUR",
      "英镑 - GBP",
      "日元 - JPY",
      "加拿大元 - CAD",
      "澳币 - AUD",
      "新西兰元 - NZD",
      "港币 - HKD",
      "新加坡元 - SGD",
      "泰币 - THB",
      "菲律宾比索 - PHP",
      "韩元 - KRW",
      "俄罗斯卢比 - RUB",
      "土耳其里拉 - TRY",
      "瑞士法郎 - CHF",
      "挪威克朗 - NOK",
      "冰岛克朗 - ISK"
    ],
    baseIndex: 0,
    targetIndex: 1,
    base: 1,
    target: 0,
    baseC: "CNY",
    targetC: "USD",
    rate:0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    });
  },
  onLoad: function() {
    var _this = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = function(res) {
        _this.setData({
          userInfo: res,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: function(res) {
          app.globalData.userInfo = res.userInfo;
          _this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }
    this.getRate();
  },
  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  getRate: function (updateTarget = true) {
    var _this=this;
    wx.request({
      url: "https://api.exchangeratesapi.io/latest?base=" + this.data.baseC + "&symbols=" + this.data.targetC,
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        //let rate = res.data.rates[_this.data.targetC];
        //console.log(rate);
        _this.setData({
          rate: res.data.rates[_this.data.targetC]
        });
        _this.updateValue(updateTarget);
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  updateValue: function (updateTarget = true){
    if (updateTarget) {
      this.setData({
        target: (this.data.base * this.data.rate).toFixed(2)
      });
    }
    else {
      this.setData({
        base: (this.data.target / this.data.rate).toFixed(2)
      });
    }
  },

  bindBaseCurrency: function(e) {
    console.log('picker base currency changed');
    this.setData({
      baseIndex: e.detail.value,
      baseC: this.data.currencies[e.detail.value].split('-')[1].trim()
    });
    console.log(this.data.baseC);
    this.getRate();
  },
  bindTargetCurrency: function(e) {
    console.log('picker target currency changed');
    this.setData({
      targetIndex: e.detail.value,
      targetC: this.data.currencies[e.detail.value].split('-')[1].trim()
    });
    this.getRate();
  },
  bindBase: function(e) {
    console.log('picker base changed')
    this.setData({
      base: e.detail.value
    });
    this.updateValue();
  },
  bindTarget: function(e) {
    console.log('picker target changed')
    this.setData({
      target: e.detail.value
    })
    this.updateValue(false);
  }
});