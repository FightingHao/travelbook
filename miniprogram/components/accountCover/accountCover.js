Component({
  // 注册组件
  properties: {
    account: {
      type: Object
    }
  },

  methods: {
    viewDetail(e) {
      let { accountKey } = e.currentTarget.dataset.account
      wx.navigateTo({
        url: `/pages/accountPage/accountPage?accountKey=${accountKey}`
      })
    }
  }
})
