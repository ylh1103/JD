
// 列表分页
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
            limit: 12,
            limits: [4, 8, 12, 16, 20, 24, 28, 30, 34, 38, 42, 46],
            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
            jump: function (obj) {
                // console.log(obj);
                //模拟渲染
                document.getElementById('list').innerHTML = function () {
                    var arr = [],
                        thisData = data.concat().splice(obj.curr * obj.limit - obj
                            .limit, obj.limit);

                    layui.each(thisData, function (index, item) {
                        arr.push(`
                            <li class="sk_goods ">
                                <a href="javascript:;"  data-id=${item.id}>
                                    <img src="${item.imgpath.split('==========')[0]}" data-id=${item.id}>
                                    <h4 data-id=${item.id}>${item.name}</h4>
                                    <p data-id=${item.id}> ${item.introduce} </p>
                                </a>
                            <div class="sk_info">
                                <span>
                                    <span>
                                        <i><em>¥</em>${item.price} <del>￥99.99</del></i>
                                        <span>91天历史最低价</span>
                                    </span>
                                    <span>
                                        <i>已售26%</i>
                                        <i class="sk_goods_progress"><b></b></i>
                                    </span>
                                    <span>剩余<em>${item.stock}</em>件</span>
                                </span>
                                <a href="javascript:;"  data-id=${item.id}>立即抢购</a> 
                            </div>
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

// 给列表页的.list的div绑定点击事件，帮ul中的li的a标签
$('#list').on('click', function (e) {
    // 判断点击的是否是a标签
    if (e.target.nodeName === 'A' || e.target.nodeName === 'IMG' || e.target.nodeName === 'H4' || e.target.nodeName === 'P') {
        // 将商品的id存储在sessionStorage
        console.log(e.target);
        console.log(e.target.dataset.id);
        sessionStorage.setItem('goodsId', e.target.dataset.id);
        // 跳转至详情页面
        location.href = './detail.html';
    }
})
