const db = wx.cloud.database()

Page({
  data: {
    account: {},
    accountKey: null,
    spend: [],
    income: [],
    spend_money: 0,
    income_money: 0
  },

  onLoad(options) {
    let _this = this
    let { accountKey } = options
    wx.showLoading({
      title: '数据加载中'
    })

    db.collection('accounts')
      .where({
        accountKey: Number(accountKey)
      })
      .get()
      .then(res => {
        _this.setData({
          account: res.data[0],
          accountKey
        })
      })
      .then(() => {
        wx.setNavigationBarTitle({
          title: this.data.account.inputValue
        })
      })
      .then(() => {
        let { spend, income, spend_money, income_money, accountKey } = this.data
        db.collection('spend_items')
          .where({
            accountKey: Number(accountKey),
            fullDate: _this.getToday()
          })
          .get()
          .then(res => {
            res.data.forEach(element => {
              let { money } = element
              if (money > 0) {
                spend_money += money
                spend.push(element)
              } else {
                element.money = -money
                income_money += element.money
                income.push(element)
              }
            })
            _this.setData({
              spend,
              income,
              spend_money,
              income_money
            })
            wx.hideLoading()
          })
      })
  },

  getToday() {
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let day = new Date().getDate()
    let fullDate = year + '-' + month + '-' + day
    return fullDate
  },

  // 跳转日历页
  getCalendar() {
    wx.navigateTo({
      url: '../accountCalendar/accountCalendar'
    })
  },

  accountAnalyze() {
    let { accountKey } = this.data
    wx.navigateTo({
      url: `../accountList/accountList?accountKey=${accountKey}`
    })
  },

  delAccountList() {
    console.log(33)
  },

  // 跳转记账页
  recordAccount() {
    wx.redirectTo({
      url: `../accountDetail/accountDetail?accountKey=${this.data.accountKey}`
    })
  }
})