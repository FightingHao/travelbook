const db = wx.cloud.database()

Page({
  data: {
    isList: false, // 转换页面风格的标识 true为竖向风格 false为横向风格
    accounts: [],  // 存储查询的账本数据
    now: null,     // 存储当日时间
    year: null     // 存储年份
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

    // 调用云函数接口 获取当前日期
    wx.cloud.callFunction({
      name: 'getTime',
      success: (res) => {
        let year = res.result.split('-')[0]
        this.setData({
          now: res.result,
          year
        })
      },
      fail: console.error
    })

    // 查询账本
    db.collection('accounts')
      .get({
        success: res => {
          this.setData({
            accounts: res.data.reverse(), // 反转数组，优先显示创建早的账本
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