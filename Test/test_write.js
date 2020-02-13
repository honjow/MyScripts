const key = 'testkey'
const value_in = '测试内容'

write()
read()
$done()

function write() {
    var rult = $persistentStore.write(value_in, key)
    if (!rult) {
        $notification.post("写入失败", "", "");
        console.log("写入失败")
      } else {
        $notification.post("写入成功123", "", "");
        console.log("写入成功")
      }
}


function read() {
  var value_out = $persistentStore.read(key)
  if (!value_out) {
      $notification.post("读取失败", "", "");
      console.log("读取失败")
    } else {
      $notification.post("读取成功", "", "");
      console.log("读取成功" + value_out)
    }
}