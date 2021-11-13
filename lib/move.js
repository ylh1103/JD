// 封装运动函数
function move(ele, styleObj, fn) { // ele运动的元素，styleObj目标样式对象,fn运动结束后要执行的函数
  // 定义一个timerObj,定时器对象
  // {left:timerId1,top:timerId2}
  let timerObj = {};
  // 遍历styleObj目标样式对象
  for (let attr in styleObj) {
    // let timer;
    let curStyle;
    if (attr == 'opacity') { // 当目标样式的属性名是透明度的时候，则不要取整，而是需要放大一百倍进行运算
      curStyle = getStyle(ele, attr) * 100; // 元素的当前样式值
      styleObj[attr] = styleObj[attr] * 100
    } else {
      curStyle = parseInt(getStyle(ele, attr)); // 元素的当前样式值
    }

    timerObj[attr] = setInterval(() => {
      // 获取目标样式值和当前样式值的差的十分之一
      let goLength = (styleObj[attr] - curStyle) / 10
      // 将每次要运动差值的十分之一距离的整数
      if (goLength < 0) { // 比如：向上运动的时候差值就是负数
        goLength = Math.floor(goLength);
      } else {
        goLength = Math.ceil(goLength);
      }
      // 每过20毫秒给当前的样式值累加goLength
      curStyle += goLength;
      // 判断curStyle是否达到目标值
      if (curStyle == styleObj[attr]) { // 到达目标属性值，则关闭定时器
        clearInterval(timerObj[attr]); //关闭定时器
        // 删除定时器对象中，被关闭的定时器
        delete timerObj[attr];
        if (Object.keys(timerObj).length == 0) { // 如果对象属性名的数组为空，则对象也就是空的
          // 运动结束了,调用fn函数
          fn();
        }        
      } else {
        if (attr == 'opacity') { // 如果是透明度的运动则，给元素赋值需要缩小一百倍，不需要单位
          ele.style[attr] = curStyle / 100;
        } else {
          // 累加后的值给到元素属性          
          ele.style[attr] = curStyle + 'px';
        }
      }
    }, 20)
  }
}


// 封装一个获取元素样式值的函数
function getStyle(ele, attr) { // ele元素,attr是样式属性
  try {
    return window.getComputedStyle(ele)[attr];
  } catch (error) {
    return ele.currentStyle[attr];
  }
}