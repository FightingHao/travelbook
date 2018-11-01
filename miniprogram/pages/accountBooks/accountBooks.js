Page({
  data: {
    isList: false,
    image: [
      {
        "url": "https://7a68-zhh-cloud-b7a1a9-1257892988.tcb.qcloud.la/182903.png?sign=c65705c7832786b85ccd8a05a95cf521&t=1540973007"
      },
      {
        "url": "https://7a68-zhh-cloud-b7a1a9-1257892988.tcb.qcloud.la/182903.png?sign=c65705c7832786b85ccd8a05a95cf521&t=1540973007"
      }
    ]
  },
  createNewAccount() {
    wx.navigateTo({
      url: '../editAccount/editAccount'
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
    var isList = wx.getStorageSync('isList')
    this.setData({
      isList
    })
  }
})