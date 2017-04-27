/**
 * Created by wdd on 2017/1/22.
 */
'use strict';
var request = require('request');
var request_url = 'http://58.213.141.220:8989/njhbindex/data?act=aqin&areacode=2000';
// var request_url = 'http://localhost:3000/posts/134';

var index_url = 'http://m.mynj.cn:11091/newsrc/';
//http://58.213.141.220:8989/njhbindex/newsrc/index.html

function checkTimeIsLegal(time){
    var curtTime = new Date();
    var getTime = new Date((new Date(curtTime.getFullYear()+'-'+time)).valueOf()+3*3600*1000);
    // var getTime2 = new Date(getTime.getFullYear(),getTime.getMonth(),getTime.getDate());
    // var newTime = (new Date(curtTime.getFullYear(),curtTime.getMonth(),curtTime.getDate())) - 24 * 3600 * 1000;
    // return getTime2 >= newTime;
    return curtTime < getTime;
    // return ((curtTime.getMonth() == getTime.getMonth()) && (curtTime.getDate() == getTime.getDate()));
}

function getIsDayTime(){
    var date = new Date();
    var hours =  date.getHours();
    return hours >=8 && hours <= 18;
}

exports.checkInit = function(){
    return new CheckApi();
};

function CheckApi(){}

CheckApi.prototype = {
    start:function() {
        this.lastNotGetTime = null;
        this.errorCount = 0;
    },
    check:function(sendMail,sendSMS){
        console.log('check kqzl');
        var that = this;
        request(request_url,function(error,response,body){
            if(!error && response.statusCode == 200){
                var dataObj = JSON.parse(body);
                dataObj.Data.reverse();
                that.lastNotGetTime = null;
                if(dataObj.Data.length > 0){
                    var errorArr = [];
                    for(var i = 0, data = dataObj.Data, l = data.length; i < l; i++) {
                        if (!checkTimeIsLegal(data[i].date)) {
                            console.log('发现异常数据:' + JSON.stringify(data[i]) + ' AT TIME:' + (new Date()).pattern("yyyy-MM-dd EEE HH:mm:ss"));
                            errorArr.push(data[i]);
                        }
                    }
                    console.log(errorArr,JSON.stringify(errorArr));
                    if(errorArr.length>0) {
                        console.log("[南京智慧环保APP]空气质量AQI数据异常通知[中威科技]");
                        if (that.errorCount < 5) {
                            that.errorCount++;
                            if(that.errorCount == 1 || getIsDayTime()) {
                                sendMail("[南京智慧环保APP]空气质量AQI数据异常通知[中威科技]", "[南京智慧环保]数据出现异常，请及时查看相关日志。", index_url, JSON.stringify(errorArr));
                                sendSMS("[南京智慧环保APP]空气质量AQI数据异常通知[中威科技]");
                            }
                        }
                    } else {
                        if(that.errorCount > 0){
                            sendMail("[南京智慧环保APP]空气质量AQI数据恢复正常[中威科技]", " [南京智慧环保]数据恢复正常。", index_url, '');
                            sendSMS("[南京智慧环保APP]空气质量AQI数据恢复正常[中威科技]");
                        }
                        that.errorCount=0;
                    }
                }
            } else {
                if(that.lastNotGetTime) {
                    if (Date.now() - that.lastNotGetTime > 3600000) {
                        console.log("[南京空气污染指数]已经超过一个小时没有接收到数据了");
                        if (that.errorCount < 5) {
                            that.errorCount++;
                            if(that.errorCount == 1 || getIsDayTime()) {
                                sendMail("[南京智慧环保APP]空气质量AQI数据异常通知[中威科技]", "[南京智慧环保]数据出现异常，请及时查看相关日志。", index_url, '已经超过一个小时没有获取到数据了');
                                sendSMS("[南京智慧环保APP]空气质量AQI数据异常通知[中威科技]");
                            }
                        }
                    }
                } else {
                    that.lastNotGetTime = Date.now();
                }
                console.log(error);
            }
        })
    },
    checkServer:function(mailTo,sendSMS){
        var that = this;
        console.log('check kqzl server');
        request(request_url,function(error,response,body){
            if(error || !(response.statusCode == 200)){
                if (that.errorCount < 5) {
                    that.errorCount++;
                    if (that.errorCount == 1 || getIsDayTime()) {
                        mailTo("[南京智慧环保APP]空气质量AQI服务异常通知[中威科技]", "服务异常", index_url, '服务异常，接口无法访问');
                        sendSMS("[南京智慧环保APP]空气质量AQI服务异常通知[中威科技]");
                    }
                }
            }
        });
    }
};





