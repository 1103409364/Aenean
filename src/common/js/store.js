export function saveToLocal (id, key, value) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    // localStorage 存的是字符串,转为对象
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal (id, key, defaultValue) {
  let seller = window.localStorage.__seller__
  // 检查是否存在
  if (!seller) {
    return defaultValue
  }

  seller = JSON.parse(seller)[id]

  if (!seller) {
    return defaultValue
  }

  let ret = seller[key]
  return ret || defaultValue
}
