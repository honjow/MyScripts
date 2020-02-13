const key = 'testkey'
read()
$done()

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