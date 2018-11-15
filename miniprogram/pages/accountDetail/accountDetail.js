const db = wx.cloud.database()

Page({
  data: {
    detail: {},
    income: {},
    accountKey: null,
    isSpend: true
  },

  onLoad(options) {
    let { accountKey } = options
    accountKey = Number(accountKey)

    wx.showLoading({
      title: '数据加载中'
    })

    db.collection('account_detail')
      .get({
        success: res => {
          this.setData({
            detail: res.data,
            accountKey
          })
        }
      })

    db.collection('account_income')
      .get({
        success: res => {
          this.setData({
            income: res.data
          })
          wx.hideLoading()
        }
      })
  },

  onChange() {
    let isSpend = this.data.isSpend
    isSpend = !isSpend
    this.setData({
      isSpend
    })
  }
})