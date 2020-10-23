var app = getApp(), QQMapWX = require("./qqmap-wx-jssdk.min.js");

function checkGPS(t, e) {
    wx.authorize({
        scope: "scope.userLocation",
        success: function() {
            console.log("get GPS success"), wx.getLocation({
                success: function(t) {
                    console.log("get GPS location success"), app.globalData.location = {
                        lat: t.latitude,
                        lng: t.longitude
                    }, app.globalData.canGetGPS = !0, e();
                },
                fail: function() {
                    console.log("get GPS location fail"), app.globalData.canGetGPS = !1, e();
                }
            });
        },
        fail: function() {
            console.log("get GPS fail"), app.globalData.canGetGPS = !1, e();
        }
    });
}

function openSetting(t) {
    return new Promise(function(e, n) {
        wx.showModal({
            content: "为了更好的服务您,需要您的地理位置",
            confirmText: "去开启",
            confirmColor: "#FF673F",
            success: function(t) {
                t.confirm ? wx.openSetting({
                    success: function(t) {
                        console.log(t), t.authSetting["scope.userLocation"] ? wx.getLocation({
                            success: function(t) {
                                console.log("get GPS location success"), getApp().globalData.location = {
                                    lat: t.latitude,
                                    lng: t.longitude
                                }, getApp().globalData.canGetGPS = !0, e(t);
                            },
                            fail: function(t) {
                                console.log("get GPS fail"), getApp().globalData.canGetGPS = !1, n(t);
                            }
                        }) : (n("未开启"), n("未开启"));
                    },
                    fail: function(t) {
                        n(t);
                    }
                }) : t.cancel && (n("用户点击取消"), console.log("用户点击取消"));
            }
        });
    });
}

function getGps() {
    var o = this;
    return new Promise(function(e, n) {
        wx.getLocation({
            type: "gcj02",
            success: function(t) {
                e(t);
                t.latitude, t.longitude;
                wx.setStorage({
                    key: "latitude",
                    data: t.latitude
                }), wx.setStorage({
                    key: "longitude",
                    data: t.longitude
                });
            },
            fail: function(t) {
                "getLocation:fail auth deny" == t.errMsg ? o.openSetting().then(function(t) {
                    n(t);
                }).catch(function() {
                    n(t);
                }) : n(t);
            }
        });
    });
}

function getGpsLocation(n, o) {
    var a = wx.getStorageSync("tx_map_key");
    return a ? new Promise(function(e, t) {
        analyzeGps(a, n, o).then(function(t) {
            e(t);
        });
    }) : new Promise(function(e, t) {
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                controller: "index.get_community_config"
            },
            dataType: "json",
            success: function(t) {
                0 == t.data.code && (a = t.data.tx_map_key, wx.setStorage({
                    key: "tx_map_key",
                    data: a
                }), analyzeGps(a, n, o).then(function(t) {
                    e(t);
                }));
            }
        });
    });
}

function analyzeGps(t, e, o) {
    var a = new QQMapWX({
        key: t
    });
    return new Promise(function(n, t) {
        a.reverseGeocoder({
            location: {
                latitude: e,
                longitude: o
            },
            success: function(t) {
                var e = t.result.address_component;
                n(e);
            }
        });
    });
}

module.exports = {
    checkGPS: checkGPS,
    openSetting: openSetting,
    getGps: getGps,
    getGpsLocation: getGpsLocation
};