const db = wx.cloud.database()
const photos = db.collection('cover_photos')

Page({
  data: {
    images: [],
    selectImg: null,
    isSelected: {},
    inputValue: '',
    now: null,
    account: {}
  },
  useMore(e) {
    let index = e.currentTarget.dataset.index
    let isSelected = {}
    isSelected[index] = true
    isSelected.i = index
    wx.chooseImage({
      count: 1,
      success: res => {
        isSelected["coverUrl"] = res.tempFilePaths[0]
        this.setData({
          selectImg: res.tempFilePaths[0],
          isSelected
        })
      }
    })
  },
  onLoad(options) {
    // 键为字符串*
    let { i, id, value, url } = options
    let obj = {
      i,
      coverUrl: url
    }
    obj[i] = true

    // 不能用全等符号'==='
    if (i == 4) {
      this.setData({
        selectImg: url
      })
    }
    photos.where({
      isCommon: true
    }).get({
      success: res => {
        this.setData({
          images: res.data,
          account: {
            id,
            value,
            url,
            i
          },
          isSelected: obj
        })
        wx.hideLoading()
      }
    })
    wx.showLoading({
      title: '数据加载中'
    })
  },

  selectThis(e) {
    let index = e.currentTarget.dataset.index
    let coverUrl = e.currentTarget.dataset.coverurl
    let is = this.data.isSelected[index]
    let obj = {
      coverUrl
    }
    obj[index] = !is
    obj.i = index
    this.setData({
      isSelected: obj
    })
  },

  getInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  add() {
    let inputValue = this.data.inputValue
    let { i, coverUrl } = this.data.isSelected
    let now = null
    wx.cloud.callFunction({
      name: 'getTime',
      success: (res) => {
        this.setData({
          now: res.result
        })
      },
      fail: console.error
    })

    wx.showLoading({
      title: '正在保存'
    })

    let timer = setInterval(() => {
      if (this.data.now) {
        now = this.data.now
        db.collection('accounts')
          .add({
            data: {
              inputValue,
              coverUrl,
              now,
              i
            },
            success: res => {
              wx.hideLoading()
              wx.showToast({
                title: '保存成功'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: '../accountBooks/accountBooks'
                })
              }, 400)
            }
          })
        clearInterval(timer)
      }
    }, 100)
  },

  delete() {
    wx.showModal({
      title: '确定要删除吗？',
      content: `${this.data.account.value}`,
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除'
          })
          db.collection('accounts')
            .doc(this.data.account.id)
            .remove({
              success: res => {
                wx.hideLoading()
                wx.showToast({
                  title: '删除成功'
                })
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../accountBooks/accountBooks'
                  })
                }, 400)
              }
            })
        }
      }
    })
  }
})