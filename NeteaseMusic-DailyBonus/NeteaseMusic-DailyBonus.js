const $nobyda = nobyda();
const cookieName = "网易云音乐";
const cookieKey = "CookieNeteaseMusic";


if ($nobyda.isRequest) {
    GetCookie()
    $nobyda.end()
} else {
    cookieNeteaseMusicBean()
    $nobyda.end()
}

function cookieNeteaseMusicBean() {
    const pc = `http://music.163.com/api/point/dailyTask?type=1`;
    const mobile = `http://music.163.com/api/point/dailyTask?type=0`;

    const cookieVal = $prefs.valueForKey(cookieKey);

    let signInfo = {
        pc: {
            processed: false,
            title: `PC端  `,
            resultCode: 0,
            resultMsg: ''
        },
        app: {
            processed: false,
            title: `APP端`,
            resultCode: 0,
            resultMsg: ''
        },
    };
    let pcUrl = {
        url: pc,
        headers: {
            Cookie: cookieVal
        }
    };
    let appUrl = {
        url: mobile,
        headers: {
            Cookie: cookieVal
        }
    };
    $task.fetch(pcUrl).then(response => {
        let result = JSON.parse(response.body)
        signInfo.pc.processed = true;
        signInfo.pc.resultCode = result.code;
        signInfo.pc.resultMsg = result.msg;
        console.log(`${signInfo.pc.title}-开始签到, 编码: ${result.code}, 原因: ${result.msg}`)
        checkResult(signInfo);
    }, reason => {
        signInfo.pc.processed = true;
        signInfo.pc.resultCode = 999;
        console.log(`网易云音乐(PC) 签到错误:${reason.error}`);
        checkResult(signInfo);
    });

    $task.fetch(appUrl).then(response => {
        let result = JSON.parse(response.body)
        signInfo.app.processed = true;
        signInfo.app.resultCode = result.code;
        signInfo.app.resultMsg = result.msg;
        console.log(`${signInfo.app.title}-开始签到, 编码: ${result.code}, 原因: ${result.msg}`)
        checkResult(signInfo);
    }, reason => {
        signInfo.app.processed = true;
        signInfo.app.resultCode = 999;
        console.log(`网易云音乐(APP) 签到错误:${reason.error}`);
        checkResult(signInfo);
    })
}

function checkResult(signInfo) {
    try {
        if (signInfo.pc.processed && signInfo.app.processed) {
            let title = '网易云音乐';
            let subTitle = '双端签到完毕，签到结果：';
            let detail = '';
            if (signInfo.pc.resultCode == 200) {
                detail += `${signInfo.pc.title} 签到成功🎉
  `;
            } else if (signInfo.pc.resultCode == -2) {
                detail += `${signInfo.pc.title} 重复签到🎉
  `;
            } else if (signInfo.pc.resultCode == 999) {
                detail += `${signInfo.pc.title} 签到失败，详见日志!!
  `;
            } else {
                detail += `${signInfo.pc.title} 未知错误，详见日志!!
  `;
            }
            if (signInfo.app.resultCode == 200) {
                detail += `${signInfo.app.title} 签到成功🎉`;
            } else if (signInfo.app.resultCode == -2) {
                detail += `${signInfo.app.title} 重复签到🎉`;
            } else if (signInfo.app.resultCode == 999) {
                detail += `${signInfo.app.title} 签到失败，详见日志!!`;
            } else {
                detail += `${signInfo.app.title} 未知错误，详见日志!!`;
            }
            $notify(title, subTitle, detail);
        }
    } catch (e) {
        console.log(`网易云音乐签到-error:${e}`);
    }

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