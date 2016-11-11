var app = getApp();
var _id = '';
Page({
    data: {
        submitStatus: false,
        money: '',
        secret: '公开',
        text: ''
    },
    bindStartTimeChange: function(e) {
        this.setData({
            startTime: e.detail.value
        });
    },
    onShow: function(option) {
        wx.setNavigationBarTitle({
            title: '创建报名'
        });
    },
    bindEndTimeChange: function(e) {
        this.setData({
            endTime: e.detail.value
        });
    },
    goToBack: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    selectMap: function(e) {
        var _this = this;
        var latitude = e.target.dataset.latitude || '';
        var longitude = e.target.dataset.longitude || '';
        console.log(latitude)
        console.log(longitude)
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            success: function(e) {
                console.log('打开地图');
                console.log(e);
                wx.chooseLocation({
                    success: function(e) {
                        console.log('选择地图');
                        console.log(e);
                        _this.setData({
                            latitude: e.latitude,
                            longitude: e.longitude,
                            addressName: e.address
                        });
                    }
                });
            },
            fail: function() {},
            complete: function() {}
        });
    },
    formSubmit: function(e) {
        var _this = this;
        var submitObject = e.detail.value || {};
        var status = true;

        for (var key in submitObject) {
            console.log(key + '=' + submitObject[key]);
            if (!submitObject[key]) {
                status = false;
            }
        }
        console.log(status);
        // this.setData({
        //     title: '',
        //     startTime: '',
        //     endTime: '',
        //     total: '',
        //     addressName: '',
        //     latitude: '',
        //     longitude: '',
        //     money: '',
        //     tel: '',
        //     text: '',
        //     images: ''
        // });
        if (status) {
            app.getUserInfo(function(userInfo) {
                submitObject.avatarUrl = userInfo.avatarUrl;
                submitObject.nickName = userInfo.nickName;
                console.log(submitObject);

                wx.request({
                    url: app.globalData.domain + 'api/wxapp/add',
                    data: submitObject,
                    success: function(res) {
                        console.log(res.data);
                        wx.showToast({
                            title: '成功',
                            icon: 'success',
                            duration: 2000
                        });
                        wx.request({
                            url: app.globalData.domain + 'api/wxapp/update-tpl-num/' + _id,
                            success: function(res) {
                                console.log('更新tpl total成功' + res);
                            }
                        });
                    }
                });

            });


        } else {
            wx.showModal({
                title: '提交数据',
                content: '数据填写不完整',
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            });
        }

    },
    onLoad: function(option) {
        console.log('query', option);
        _id = option._id;

        this.setData({
            imageUrl: option.id,
            theme: option.theme
        });
    }

});