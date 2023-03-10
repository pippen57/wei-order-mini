Component({
	data: {
		active: 0,
		list: [
			{
				icon: 'home-o',
				text: '้ฆ้กต',
				url: '/pages/index/index'
			},
			{
				icon: 'friends-o',
				text: 'ๆ็',
				url: '/pages/my/my'
			}
		]
	},

	methods: {
		onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
      const page = getCurrentPages().pop();
      console.log(page);
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	}
});
