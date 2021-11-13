/**
 * @description: 封装的设置cookie的方法
 * @param {string} key    设置的cookie的键名
 * @param {string} value  设置的cookie的键值
 * @param {string} expires   设置的cookie的有效时间
 */

function setCookie(key, value, expires) {
  let time = new Date(new Date().getTime() - 8 * 60 * 60 * 1000 + expires * 1000);
  document.cookie = `${key}=${value};expires=${time}`;
}

/**
 * @description: 删除cookie
 * @param {string} key 要删除的cookie的键名
 */
function delCookie(key) {
  setCookie(key, '', -1);
}

/**
 * @description: 根据键名获取cookie的值
 * @param {string} key 要获取cookie的键名
 * @return {string} 获取到的cookie的值
 */
function getCookie(key) {
  // console.log(document.cookie); // like=code; name=leon; age=18
  // 将获取到的所有cookie的字符串炸开
  let arr = document.cookie.split(';');
  // console.log(arr); // ["like=code", " name=leon", " age=18"]
  // 定义变量str接受数组中有对应键名的字符串
  let str;
  arr.forEach(item => {
    if (item.indexOf(key) != -1) {
      str = item;
    }
  })
  // console.log(str); // name=leon
  // console.log(str.split('=')[1]);
  // 判断str中是否有值
  if (!str) return;
  return str.split('=')[1];
}

function getCookie2(key) {
  let arr = document.cookie.split(';');
  let reg = new RegExp(`^${key}=`,'g');
  let str;
  arr.forEach(item => {
    if(reg.test(item.trim())){
      str = item;
    }
  })
  if (!str) return;
  return str.split('=')[1];
}