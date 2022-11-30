const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const Rad = d => { //根据经纬度判断距离
  return d * Math.PI / 180.0;
}

const getDistance=(lat1, lng1, lat2, lng2) => {
  // lat1用户的纬度
  // lng1用户的经度
  // lat2商家的纬度
  // lng2商家的经度
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  s = s.toFixed(2) //保留两位小数
  console.log('经纬度计算的距离:' + s)
  return s
}
const   checkIsOpened=(openingHours)=>{
  if (!openingHours) {
    return true
  }
  const date = new Date();
  const startTime = openingHours.split('-')[0]
  const endTime = openingHours.split('-')[1]
  const dangqian = date.toLocaleTimeString('chinese', {
    hour12: false
  })

  const dq = dangqian.split(":")
  const a = startTime.split(":")
  const b = endTime.split(":")

  const dqdq = date.setHours(dq[0], dq[1])
  const aa = date.setHours(a[0], a[1])
  const bb = date.setHours(b[0], b[1])

  if (a[0] * 1 > b[0] * 1) {
    // 说明是到第二天
    return !checkIsOpened(endTime + '-' + startTime)
  }
  return aa < dqdq && dqdq < bb
}

module.exports = {
  formatTime: formatTime,
  getDistance: getDistance,
  checkIsOpened:checkIsOpened
}
