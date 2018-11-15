const db = wx.cloud.database()
Component({
  // 注册组件
  properties: {
    detail: {
      type: Object
    },
    accountKey: {
      type: Number
    },
    isSpend: {
      type: Boolean
    }
  },

  data: {
    address: '',
    money: 0,
    desc: '',
    selectPicIndex: 0,
    selectIndex: 0
  },

  methods: {
    // 选择消费类别
    selectSpend(e) {
      let { index } = e.currentTarget.dataset
      let { selectPicIndex } = this.data
      selectPicIndex = index
      this.setData({
        selectPicIndex
      })
    },

    // 选择消费类别中的细节
    selectSpendDetail(e) {
      let { index } = e.currentTarget.dataset
      let { selectIndex } = this.data
      selectIndex = index
      this.setData({
        selectIndex
      })
    },

    // 获取位置
    getLocation() {
      const _this = this
      wx.chooseLocation({
        success: res => {
          _this.setData({
            address: res.name
          })
        }
      })
    },

    // 获取费用
    getMoney(e) {
      let reg = /^[0-9]*$/
      let money = e.detail.value
      if (money < 0 || !reg.test(money)) {
        wx.showModal({
          title: '请输入一个正数',
          content: '例如：5',
          showCancel: false
        })
      } else {
        this.setData({
          money: money
        })
      }

    },

    // 获取备注
    getDesc(e) {
      this.setData({
        desc: e.detail.value
      })
    },

    // 记账
    save() {
      let year = new Date().getFullYear()
      let month = new Date().getMonth() + 1
      let day = new Date().getDate()
      let date = [year, month, day]

      let fullDate = year + '-' + month + '-' + day

      let database = 'account_detail'
      let isSpend = this.data.isSpend
      let { selectPicIndex, selectIndex, address, money, desc, accountKey } = this.data
      accountKey = Number(accountKey)
      money = Number(money)
      if (!isSpend) {
        money = -money
        database = 'account_income'
      }
      wx.showLoading({
        title: '正在保存'
      })
      db.collection(database)
        .get({
          success: res => {
            let selectItem = res.data[selectPicIndex]
            let pic_url = selectItem.pic_url_act
            let pic_type = selectItem.type
            if (selectItem.detail) {
              pic_type = selectItem.detail[selectIndex].detail_type
            }

            db.collection('spend_items')
              .add({
                data: {
                  address,
                  money,
                  desc,
                  pic_url,
                  pic_type,
                  accountKey,
                  date,
                  fullDate
                }
              })
              .then(() => {
                wx.hideLoading()
                wx.showToast({
                  title: '保存成功'
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: `/pages/accountPage/accountPage?accountKey=${this.data.accountKey}`
                  })
                }, 400)
              })

            db.collection('accounts')
              .where({
                accountKey
              })
              .get()
              .then(res => {
                let { _id, spend } = res.data[0]
                spend = Number(spend) + Number(money)
                db.collection('accounts')
                  .doc(_id)
                  .update({
                    data: {
                      spend
                    }
                  })
              })
          }
        })
    },

    // 未输入金额时
    err() {
      wx.showModal({
        title: '请输入费用',
        content: '例如：5',
        showCancel: false
      })
    }
  }
})
