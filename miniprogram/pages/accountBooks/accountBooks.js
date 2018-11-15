const db = wx.cloud.database()

Page({
  data: {
    isList: false,
    accounts: [],
    now: null
  },

  // 创建账本
  createNewAccount() {
    wx.navigateTo({
      url: '../editAccount/editAccount'
    })
  },

  // 编辑账本
  editAccount(e) {
    let { account } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../editAccount/editAccount?accountKey=${account.accountKey}&i=${account.i}&id=${account._id}&value=${account.inputValue}&url=${account.coverUrl}`
    })
  },

  viewDetail(e) {
    let { accountKey } = e.currentTarget.dataset.account
    wx.navigateTo({
      url: `/pages/accountPage/accountPage?accountKey=${accountKey}`
    })
  },

  // 账本显示风格
  switchList() {
    // 设置页面风格样式
    let isList = !this.data.isList
    this.setData({
      isList
    })
    wx.setStorage({
      key: "isList",
      data: isList
    })
  },

  onLoad() {
    wx.showLoading({
      title: '数据加载中'
    })

    // 获取页面风格转换标识
    var isList = wx.getStorageSync('isList')

    wx.cloud.callFunction({
      name: 'getTime',
      success: (res) => {
        this.setData({
          now: res.result
        })
      },
      fail: console.error
    })

    // 查询账本
    db.collection('accounts')
      .get({
        success: res => {
          this.setData({
            accounts: res.data.reverse(),
            isList
          })
          wx.hideLoading()
        }
      })
  },

  // 下拉刷新
  onPullDownRefresh() {
    wx.setNavigationBarTitle({
      title: '刷新中...'
    })//动态设置当前页面的标题。

    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画
    this.onLoad()
    setTimeout(() => {
      wx.hideNavigationBarLoading();//隐藏导航条加载动画。

      wx.stopPullDownRefresh();//停止当前页面下拉刷新。
      wx.setNavigationBarTitle({
        title: '旅行小账本'
      })//动态设置当前页面的标题。
    }, 500);
  }
})