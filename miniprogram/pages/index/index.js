Page({
  data: {

  },
  startAccounts() {
    wx.showLoading({
      title: '旅程即将开始'
    })
    setTimeout(() => {
      wx.hideLoading()
      wx.navigateTo({
        url: '../accountBooks/accountBooks'
      })
    }, 600);
  },
  onPullDownRefresh: function () {
    // do somthing
    console.log(11)
    // 小程序提供的api，通知页面停止下拉刷新效果
    wx.stopPullDownRefresh;
  }
})