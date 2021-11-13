/* ********中间轮播图******** */

// 使用开关思想解决点击太快，轮播混乱的问题
let onOff = true; // 设置运动开关，如果运动开始为false则说明上次运动还没结束，则点击了也不能开始此次运动
// 1. 获取要操作的元素
let banner = document.querySelector('.banner');
let ul = document.querySelector('.banner>ul');
let ulis = document.querySelectorAll('.banner>ul>li');
let dots = document.querySelectorAll('.banner .circle-dot>span');
let prve = document.querySelector('.banner>.btn-lt');
let next = document.querySelector('.banner>.btn-rt');
// 1.1 克隆复制第一张和最后一张图片的li，并放到最后和最前面
function setUi() {
    // 克隆第一张和最后一张图片的li
    let firstLi = ulis[0].cloneNode(true);
    let lastLi = ulis[7].cloneNode(true);
    // 将克隆的li放到最前面和最后面
    ul.appendChild(firstLi);
    ul.insertBefore(lastLi, ulis[0]);
    // 重新获取一下ulis
    ulis = document.querySelectorAll('.banner>ul>li');
    // 给ul设置宽度
    ul.style.width = ulis.length * ulis[0].offsetWidth + 'px';
    // 设置ul的初始left属性(显示图片1)
    ul.style.left = -ulis[0].offsetWidth + 'px'
    // 重新获取ul
    ul = document.querySelector('.banner>ul')
}
setUi();


// 2. 实现自动轮播:(通过定时器显示自动轮播)
let n = 1; // 要显示的图片li的索引
let timer = setInterval(() => {
    if (!onOff) return;
    onOff = false;
    n++; // 索引n+1显示下一张图
    // 调用运动函数
    play();
}, 2000)

// 3. 鼠标移入移出轮播暂停和开始
banner.onmouseenter = () => clearInterval(timer); // 鼠标移入关闭定时器
banner.onmouseleave = () => { // 鼠标移出开启定时器
    if (!onOff) return;
    onOff = false;
    n++;
    play()
    timer = setInterval(() => {
        if (!onOff) return;
        onOff = false;
        n++; // 索引n+1显示下一张图
        play()
    }, 2000)
}

// 4. 实现点击上一张下一张
prve.onclick = () => {
    if (!onOff) return;
    onOff = false;
    n--;
    play();
}
next.onclick = () => {
    if (!onOff) return;
    onOff = false;
    n++;
    play();
}

// 5. 点击小圆点实现切换图片
// 遍历olis。给每一个小圆点绑定点击事件
for (let i = 0; i < dots.length; i++) {
    dots[i].onclick = function () { // 此时的i需要加1，才是显示图片的索引
        if (!onOff) return;
        onOff = false;
        n = i + 1;
        play();
    }
}

// 封装一个轮播图片和圆点高亮显示的函数
function play() {
    // 调用运动函数
    move(ul, {
        left: -n * ulis[0].offsetWidth
    }, function () {
        // 如果n = 9,则此时显示的应该是第一张图片li
        if (n == 9) {
            n = 1;
        }
        if (n == 0) { // 如果索引为0这上次显示的是图片1，此时需要显示图片8
            n = 8;
        }
        ul.style.left = -n * ulis[0].offsetWidth + 'px';
        // 小圆点跟随高亮显示
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = '';
        }
        dots[n - 1].className = 'active';
        // 运动结束则将开关打开
        onOff = true;
    })
}


layui.use(['laypage', 'layer'], function () {
    var laypage = layui.laypage,
        layer = layui.layer;
    // 添加加载层
    let index = layer.load(1, {
        shade: .7
    })
    // 发起ajax请求
    async function getList() {
        let res = await $.ajax({
            url: '../server/list.php',
            type: 'GET',
            dataType: 'json'
        })
        // console.log(res);
        let { data } = res; // 解构赋值

        //调用分页
        laypage.render({
            elem: 'page',
            count: data.length,
            limit: 15,
            limits: [5, 10, 15, 20, 25, 30, 35, 40],
            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
            jump: function (obj) {
                // console.log(obj);
                //模拟渲染
                document.querySelector('.clear-fix').innerHTML = function () {
                    var arr = [],
                        thisData = data.concat().splice(obj.curr * obj.limit - obj
                            .limit, obj.limit);

                    layui.each(thisData, function (index, item) {
                        arr.push(`
                                <li>
                                <a href="javascript:;" data-id=${item.id}>
                                    <div class="img">
                                        <img src="${item.imgpath}" alt="" data-id=${item.id}>
                                    </div>
                                    <div class="info">
                                        <p data-id=${item.id}><i>自营</i>${item.introduce}</p>
                                        <div class="price">
                                            <div>
                                                <i>￥</i><span>${item.price.split('.')[0]}.<i>00</i></span>
                                            </div>
                                            <span>劵</span>
                                        </div>
                                    </div>
                                    <div class="shadow">
                                        <div>
                                            <i></i><span>找相似</span>
                                        </div>
                                    </div>
                                </a>
                            </li>`)

                    });
                    // console.log(arr.join(''));
                    return arr.join('');
                }();
            }
        });
        layer.close(index)
    }
    getList()
});

// 给列表页的.clear-fix的div绑定点击事件，帮ul中的li的a标签
$('.clear-fix').on('click', function (e) {
    // 判断点击的是否是a标签
    if (e.target.nodeName === 'A' || e.target.nodeName === 'IMG' || e.target.nodeName === 'P') {
        // 将商品的id存储在sessionStorage
        console.log(e.target);
        sessionStorage.setItem('goodsId', e.target.dataset.id);
        // 跳转至详情页面
        location.href = './detail.html';
    }
})







































/* 渲染数据列表 */
/* ajax请求数据 */
// 在页面数据还没渲染完成之前，页面加载状态，添加一个加载层
// let index = layer.load(1, {
//     shade: [0.3, '#999']
// });
// $(function () {
//     $.ajax({
//         url: '../server/scenics.php',
//         type: 'GET',
//         data: {
//             pid: 2
//         },
//         dataType: 'json',
//         success(res) {
//             let datas = res.data
//             render(datas)
//         }
//     })
// })
// /* 渲染数据 */
// function render(datas) {
//     let str = ''
//     // console.log(datas);
//     datas.forEach(item => {
//         // console.log(item);
//         str += `<li>
//         <a href="javascript:;">
//             <div class="img">
//                 <img src="${item.imgpath}" alt="">
//             </div>
//             <div class="info">
//                 <p><i>自营</i>${item.introduce}</p>
//                 <div class="price">
//                     <div>
//                         <i>￥</i><span>${item.price.split('.')[0]}.<i>00</i></span>
//                     </div>
//                     <span>劵</span>
//                 </div>
//             </div>
//             <div class="shadow">
//                 <div>
//                     <i></i><span>找相似</span>
//                 </div>
//             </div>
//         </a>
//     </li>`
//     })
//     $('.sales-layer>ul').html(str)
//     // 渲染结束关闭弹出层
//     layer.close(index);
// }



