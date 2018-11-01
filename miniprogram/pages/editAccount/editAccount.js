const db = wx.cloud.database()
const photos = db.collection('cover_photos')

Page({
  data: {
    images: [],
    selectImg: null
  },
  useMore() {
    wx.chooseImage({
      count: 1,
      success: res => {
        this.setData({
          selectImg: res.tempFilePaths
        })
      }
    })
  },
  onLoad() {
    photos.where({
      isCommon: true
    }).get({
      success: res => {
        this.setData({
          images: res.data
        })
        wx.hideLoading()
      }
    })
    wx.showLoading({
      'title': '数据加载中'
    })
  }
})