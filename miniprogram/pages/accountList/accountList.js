const db = wx.cloud.database()

Page({
  data: {
    dateArr: []
  },

  onLoad(options) {
    wx.showLoading({
      title: '数据加载中'
    })

    let _this = this
    let { accountKey } = options
    accountKey = Number(accountKey)
    db.collection('spend_items')
      .where({
        accountKey
      })
      .get()
      .then(res => {
        _this.dateToArr(res.data)
      })
  },

  dateToArr(arr) {
    let _this = this
    let dateArr = []
    arr.forEach(item => {
      if (!_this.isExist(item.fullDate, dateArr)) {
        dateArr.push([item])
      } else {
        dateArr.forEach(res => {
          if (res[0].fullDate == item.fullDate) {
            res.push(item)
          }
        })
      }
    })
    dateArr = dateArr.map((item) => {
      let spend = 0
      let income = 0
      item.forEach(res => {
        if (res.money > 0) {
          spend += res.money
        } else {
          income += (-res.money)
        }
      })
      return {
        item,
        spend,
        income
      }
    })
    this.setData({
      dateArr: dateArr.reverse()
    })
    wx.hideLoading()
  },

  isExist(item, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (item == arr[i][0].fullDate)
        return true
    }
    return false
  }
})