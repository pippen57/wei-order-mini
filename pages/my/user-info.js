const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
  },
  onLoad() {
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  }
})
