
const title = '10010+'
const phone = "156xxxxxxxx"; //填入联通号码，使用前请登陆一次联通支付宝小程序

const $hon = init();

getIndexData(phone)

function getIndexData(_phone) {
    let getIndexDataUrl = {
        url: "https://mina.10010.com/wxapplet/bind/getIndexData/alipay/alipaymini?user_id=" + _phone,
        headers: {},
    }

    $hon.notify('开始')

    $hon.get(getIndexDataUrl, (error, response, data) => { 
        console.log(data)
        rult = JSON.parse(data)
        remainFee = rult.dataList[0].number
        remainTime = rult.dataList[2].number

        getCombospare(remainFee, remainTime, _phone)
    })
}

function getCombospare(_remainFee, _remainTime, _phone) {
    let getCombospareUrl = {
        url: "https://mina.10010.com/wxapplet/bind/getCombospare/alipay/alipaymini?stoken=&user_id=" + +phone,
        headers: {},
    }

    $hon.get(getCombospareUrl, (error, response, data) => {
        console.log(data)
        rult = JSON.parse(data)
        queryTime = rult.queryTime;
        $hon.notify(title, 
        "截止至 " + queryTime, "剩余语音 " + _remainTime + "分" + "\n话费余额 " + _remainFee + "元")

    })
}


function init() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
}