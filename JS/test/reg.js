

function reg_test() {
    var str = "abc12345d"; 
    var n = /(?<=abc)\d+(?=d)/.exec(str);
    msg = '输入字符:' + n[0] + '\n匹配结果 ：' + n
    console.log(msg)
    $notification.post('', '', msg)
}

reg_test()