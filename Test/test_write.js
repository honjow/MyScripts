const key = 'testkey'
const value = '测试内容'

write()
$done()
function write() {
    var rult = $persistentStore.write(value, key)
    if (!rult) {
        $notification.post("写入失败", "", "");
        console.log("写入失败")
      } else {
        $notification.post("写入成功", "", "");
        console.log("写入成功")
      }
}