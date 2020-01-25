/*
签到部分代码来自 https://github.com/chavyleung/scripts/tree/master/smzdm/quanx


测试中 ，暂不可用
*/

const log = true;
const $hon = init();
const cookieName = "什么值得买";
const cookieKey = "CookieSMZDM";

if ($hon.isRequest) {
    GetCookie()
    $hon.end()
} else {
    smzdmBean()
    $hon.end()
}


function smzdmBean() {
    console.log("开始签到")

    let url = {
        url: `https://zhiyou.smzdm.com/user/checkin/jsonp_checkin`,
        method: 'GET',
        headers: {
            Cookie: $hon.read(cookieKey),
            'Referer': 'http://www.smzdm.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.132 Safari/537.36'
        }
    }

    $hon.get(url, (error, response, data) => {
        console.log("data = \n" + data)
        let title = cookieName
        if (!error) {
            // 签到成功
            if (result.error_code == 0) {
                let subTitle = "签到结果: 成功 🎉"
                let detail = `累计: ${data.checkin_num}次, 经验: ${data.exp}, 金币: ${data.gold}, 积分: ${data.point}`
                $hon.notify(title, subTitle, detail)
            }
            // 签到失败
            else {
                let subTitle = "签到结果: 失败 😿"
                let detail = data.error_msg

                console.log(`${title}, ${subTitle}, ${detail}`)
                $hon.notify(title, subTitle, detail)
            }
        } else {
            $hon.notify(title + "签到接口请求失败", "", error)
            console.error(title + " error :" + error)
        }

    })
}

function GetCookie() {
    if ($request.headers) {
        var CookieValue = $request.headers['Cookie'];
        if ($hon.read(cookieKey) != (undefined || null)) {
            if ($hon.read(cookieKey) != CookieValue) {
                var cookie = $hon.write(CookieValue, cookieKey);
                if (!cookie) {
                    $hon.notify("更新" + cookieName + "Cookie失败‼️", "", "");
                } else {
                    $hon.notify("更新" + cookieName + "Cookie成功 🎉", "", "");
                }
            }
        } else {
            var cookie = $hon.write(CookieValue, cookieKey);
            if (!cookie) {
                $hon.notify("首次写入" + cookieName + "Cookie失败‼️", "", "");
            } else {
                $hon.notify("首次写入" + cookieName + "Cookie成功 🎉", "", "");
            }
        }
    } else {
        $hon.notify("写入" + cookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头 ");
    }
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