## v2ex 二合一签到

## 配置

```properties
[mitm]
hostname = *.v2ex.com

[rewrite_local]
# 此处用于V2EX cookie获取，浏览器打开https://www.v2ex.com/mission/daily 后提示成功即可
^https:\/\/www\.v2ex\.com\/mission\/daily url script-request-header V2EX-DailyBonus.js


# 这个最小是分钟开始,且只有五位的长度,您可改成* * * * *表示每分钟执行以测试效果.(分 时 日 月 星期)

[task_local]
# V2EX签到 表示10点32执行签到
32 10 * * * V2EX-DailyBonus.js
```

## 感谢

[@NobyDa](https://github.com/NobyDa)
