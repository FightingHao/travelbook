Page({
  data: {
    days_style: []
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '日期加载中'
    })

    setTimeout(() => {
      wx.hideLoading()
    }, 500);

    let days_style = new Array();

    days_style.push(
      {
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
        background: '#e0a58e'
      }
    );

    this.setData({
      days_style
    })
  }
})