/*
 v2ex二合一签到脚本

[mimt]
hostname = *.v2ex.com

[rewrite_local]
# 此处用于V2EX cookie获取，浏览器打开https://www.v2ex.com/mission/daily 后提示成功即可
^https:\/\/www\.v2ex\.com\/mission\/daily url script-request-header V2EX-DailyBonus.js


# 这个最小是分钟开始,且只有五位的长度,您可改成* * * * *表示每分钟执行以测试效果.(分 时 日 月 星期)

[task_local]
# V2EX签到 表示10点32执行签到
32 10 * * * V2EX-DailyBonus.js

*/


const log = true;
const $hon = init();
const cookieName = "v2ex";
const cookieKey = "CookieV2EX";

if ($hon.isRequest) {
    GetCookie()
    $hon.end()
} else {
    v2exBean()
    $hon.end()
}


function v2exBean() {
    let url = {
        url: `https://www.v2ex.com/mission/daily`,
        method: 'GET',
        headers: {
            Cookie: $hon.read(cookieKey)
        }
    }
    $task.fetch(url).then((response) => {
        let data = response.body
        if (data.indexOf('每日登录奖励已领取') >= 0) {
            let title = `${cookieName}`
            let subTitle = `签到结果: 签到跳过`
            let detail = `今天已经签过了`
            console.log(`${title}, ${subTitle}, ${detail}`)
            $hon.notify(title, subTitle, detail)
        } else {
            signMission(data.match(/<input[^>]*\/mission\/daily\/redeem\?once=(\d+)[^>]*>/)[1])
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