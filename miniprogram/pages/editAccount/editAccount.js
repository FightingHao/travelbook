const db = wx.cloud.database()
const photos = db.collection('cover_photos')

Page({
  data: {
    images: [],      // 封面数组
    selectImg: null, // 选择其它封面
    isSelected: {},  // 选中的图片
    inputValue: '',  // 账本名字
    now: null,       // 当前时间
    account: {}      // 传入账本信息
  },

  // 选择更多图片做封面
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

  // 加载逻辑
  onLoad(options) {
    // 键为字符串*
    let { i, id, value, url, accountKey } = options
    let obj = {
      i,
      coverUrl: url
    }

    if (i != undefined) {
      obj[i] = true
    }

    if (value) {
      this.setData({
        inputValue: value
      })
    }

    // 不能用全等符号'==='
    if (i == 4) {
      this.setData({
        selectImg: url
      })
    }
    photos.get({
      success: res => {
        this.setData({
          images: res.data,
          account: {
            id,
            value,
            url,
            i,
            accountKey
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

  // 单选逻辑
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

  addErr() {
    let inputValue = this.data.inputValue
    if (!inputValue) {
      wx.showModal({
        title: '请输入账本名',
        content: '例如：南昌三日游',
        showCancel: false
      })
    }
  },

  // 添加账本
  add() {
    let now = null  // 当前时间
    let accountKey = +new Date()  // 主键
    let { inputValue } = this.data
    let { i, coverUrl } = this.data.isSelected

    // 云函数格式化时间
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

    // 数据库添加操作
    let timer = setInterval(() => {
      if (this.data.now) {
        now = this.data.now
        db.collection('accounts')
          .add({
            data: {
              inputValue,
              coverUrl,
              now,
              i,
              spend: 0,
              accountKey
            }
          })
          .then(() => {
            wx.hideLoading()
            wx.showToast({
              title: '保存成功'
            })
            setTimeout(() => {
              wx.reLaunch({
                url: '../accountBooks/accountBooks'
              })
            }, 400)
          })
        clearInterval(timer)
      }
    }, 100)
  },

  // 删除账本
  delete() {
    let accountKey = this.data.account.accountKey
    accountKey = Number(accountKey)
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
            .remove()
            .then(() => {
              wx.hideLoading()
              wx.showToast({
                title: '删除成功'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: '../accountBooks/accountBooks'
                })
              }, 400)
            })
          wx.cloud.callFunction({
            name: 'deleteItems',
            data: {
              accountKey
            }
          })
        }
      }
    })
  },

  // 修改账本
  save() {
    let { id } = this.data.account
    let { i, coverUrl, value } = this.data.isSelected
    // 若没修改 则为之前的value
    let inputValue = this.data.inputValue || value

    wx.showLoading({
      title: '正在保存'
    })

    db.collection('accounts')
      .doc(id)
      .update({
        data: {
          inputValue,
          coverUrl,
          i
        }
      })
      .then(() => {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功'
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '../accountBooks/accountBooks'
          })
        }, 400)
      })
  }
})