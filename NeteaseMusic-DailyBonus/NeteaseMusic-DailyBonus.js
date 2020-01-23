const $nobyda = nobyda();
const cookieName = "网易云音乐";
const cookieKey = "CookieNeteaseMusic";

const pc = `http://music.163.com/api/point/dailyTask?type=1`
const mobile = `http://music.163.com/api/point/dailyTask?type=0`

if ($nobyda.isRequest) {
    GetCookie()
    $nobyda.end()
} else {
    cookieNeteaseMusicBean()
    $nobyda.end()
}

function cookieNeteaseMusicBean() {
    let url = {
        url: null,
        headers: {
            Cookie: $nobyda.read(cookieKey)
        }
    }

    let signinfo = {}

    url.url = pc
    $task.fetch(url).then((response) => {
        let data = response.body
        let result = JSON.parse(data)
        signinfo.pc = {
            title: `网易云音乐(PC)`,
            success: result.code == 200 || result.code == -2 ? true : false,
            skiped: result.code == -2 ? true : false,
            resultCode: result.code,
            resultMsg: result.msg
        }
        console.log(`开始签到: ${signinfo.pc.title}, 编码: ${result.code}, 原因: ${result.msg}`)
    })

    url.url = mobile
    $task.fetch(url).then((response) => {
        let data = response.body
        let result = JSON.parse(data)
        signinfo.app = {
            title: `网易云音乐(APP)`,
            success: result.code == 200 || result.code == -2 ? true : false,
            skiped: result.code == -2 ? true : false,
            resultCode: result.code,
            resultMsg: result.msg
        }
        console.log(`开始签到: ${signinfo.app.title}, 编码: ${result.code}, 原因: ${result.msg}`)
    })
    check(signinfo)
}

function check(signinfo, checkms = 0) {
    if (signinfo.pc && signinfo.app) {
        log(signinfo)
        $done({})
    } else {
        if (checkms > 5000) {
            $done({})
        } else {
            setTimeout(() => check(signinfo, checkms + 100), 100)
        }
    }
}

function log(signinfo) {
    let title = `${cookieName}`
    let subTitle = ""
    let detail = `今日共签: ${signinfo.signedCnt}, 本次成功: ${signinfo.successCnt}, 本次失败: ${signinfo.failedCnt}`

    if (signinfo.pc.success && signinfo.app.success) {
        subTitle = `签到结果: 全部成功`
        detail = `PC: ${signinfo.pc.success ? '成功' : '失败'}, APP: ${signinfo.app.success ? '成功' : '失败'}`
    } else if (!signinfo.pc.success && !signinfo.app.success) {
        subTitle = `签到结果: 全部失败`
        detail = `PC: ${signinfo.pc.success ? '成功' : '失败'}, APP: ${signinfo.app.success ? '成功' : '失败'}, 详见日志!`
    } else {
        subTitle = ``
        detail = `PC: ${signinfo.pc.success ? '成功' : '失败'}, APP: ${signinfo.app.success ? '成功' : '失败'}, 详见日志!`
    }
    $notify(title, subTitle, detail)
}

function GetCookie() {
    if ($request.headers) {
        var CookieValue = $request.headers['Cookie'];
        if ($nobyda.read(cookieKey) != (undefined || null)) {
            if ($nobyda.read(cookieKey) != CookieValue) {
                var cookie = $nobyda.write(CookieValue, cookieKey);
                if (!cookie) {
                    $nobyda.notify("更新" + cookieName + "Cookie失败‼️", "", "");
                } else {
                    $nobyda.notify("更新" + cookieName + "Cookie成功 🎉", "", "");
                }
            }
        } else {
            var cookie = $nobyda.write(CookieValue, cookieKey);
            if (!cookie) {
                $nobyda.notify("首次写入" + cookieName + "Cookie失败‼️", "", "");
            } else {
                $nobyda.notify("首次写入" + cookieName + "Cookie成功 🎉", "", "");
            }
        }
    } else {
        $nobyda.notify("写入" + cookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头 ");
    }
}



function nobyda() {
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