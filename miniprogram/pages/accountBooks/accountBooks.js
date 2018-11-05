const db = wx.cloud.database()

Page({
  data: {
    isList: false,
    accounts: []
  },
  createNewAccount() {
    wx.navigateTo({
      url: '../editAccount/editAccount'
    })
  },

  editAccount(e) {
    let {account} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../editAccount/editAccount?i=${account.i}&id=${account._id}&value=${account.inputValue}&url=${account.coverUrl}`
    })
  },

  switchList() {
    console.log(111)
    let isList = !this.data.isList
    this.setData({
      isList
    })
    wx.setStorage({
      key: "isList",
      data: isList
    })
  },

  update() {
    console.log(1111)
  },

  onLoad() {
    wx.showLoading({
      title: '数据加载中'
    })
    var isList = wx.getStorageSync('isList')
    db.collection('accounts')
      .get({
        success: res => {
          this.setData({
            accounts: res.data
          })
          wx.hideLoading()
        }
      })
    this.setData({
      isList
    })
  }
})