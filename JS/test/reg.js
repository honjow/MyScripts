

function reg_test() {
    var str = "abc12345d"; 
    var n = /(?<=abc)\d+(?=d)/.exec(str);
    console.log(n[0])
}

reg_test()