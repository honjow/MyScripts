const log = true;
const $nobyda = nobyda();
const cookieName = "v2ex";
const cookieKey = "CookieV2EX";

if ($nobyda.isRequest) {
    GetCookie()
    $nobyda.end()
  } else {
    v2exBean()
    $nobyda.end()
  }


function v2exBean() {
    let url = {
        url: `https://www.v2ex.com/mission/daily`,
        method: 'GET',
        headers: {
          Cookie: $nobyda.read(cookieKey)
        }
      }
      $task.fetch(url).then((response) => {
        let data = response.body
        if (data.indexOf('每日登录奖励已领取') >= 0) {
          let title = `${cookieName}`
          let subTitle = `签到结果: 签到跳过`
          let detail = `今天已经签过了`
          console.log(`${title}, ${subTitle}, ${detail}`)
          $notify(title, subTitle, detail)
        } else {
          signMission(data.match(/<input[^>]*\/mission\/daily\/redeem\?once=(\d+)[^>]*>/)[1])
        }
      })
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