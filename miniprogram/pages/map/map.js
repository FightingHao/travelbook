var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  onLoad() {
    wx.showLoading({
      title: '地图加载中'
    })

    setTimeout(() => {
      wx.hideLoading()
    }, 500);

    qqmapsdk = new QQMapWX({
      key: 'PBBBZ-QFBRV-T7XP4-ULLXL-K6RT6-3VB7Z'
    });
  },
  onShow() {
    // 调用接口
    qqmapsdk.search({
      keyword: '酒店',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  }

})
