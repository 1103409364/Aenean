/*
* 解析 url 参数
* @example ?id=123&a=b
* @return Object {id: 123, a: n}
*/
export function urlParse () {
  let search = window.location.search
  let obj = {}
  // 使用正则解析查询字符串
  // let reg = /[?&][^?&]+=[^?&]+/g
  // let arr = search.match(reg)
  // 使用数组方法解析
  let arr = search.split('&')

  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substring(1).split('=')
      // URI 解码
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }

  return obj
}
