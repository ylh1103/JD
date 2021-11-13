/* 实现放大镜 */
$(".preview_img").mouseover(function (e) {
    $(this).children(".mask").show();
    $(this).children(".big").show();
});
$(".preview_img").mouseout(function () {
    $(this).children(".mask").hide();
    $(this).children(".big").hide();
});
$(".preview_img").mousemove(function (e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    var maskX = x - parseInt($(this).children(".mask").css("width")) / 2;
    var maskY = y - parseInt($(this).children(".mask").css("height")) / 2;
    var maskMax = parseInt($(this).css("width")) - parseInt($(this).children(".mask").css("width"));
    if (maskX <= 0) {
        maskX = 0;
    } else if (maskX >= maskMax) {
        maskX = maskMax;
    }
    if (maskY <= 0) {
        maskY = 0;
    } else if (maskY >= maskMax) {
        maskY = maskMax;
    }
    $(this).children(".mask").css("left", maskX + 'px');
    $(this).children(".mask").css("top", maskY + 'px');
    var bigMax = parseInt($(".bigimg").css("width")) - parseInt($(".big").css("width"));
    var bigX = maskX * bigMax / maskMax;
    var bigY = maskY * bigMax / maskMax;
    $(".bigimg").css("left", -bigX + 'px');
    $(".bigimg").css("top", -bigY + 'px');
});

/* 选择套餐样式 */
$(".choose_color a").click(function () {
    $(this).addClass("current").siblings().removeClass("current");
});
$(".choose_version a").click(function () {
    $(this).addClass("current").siblings().removeClass("current");
});
$(".choose_type a").click(function () {
    $(this).addClass("current").siblings().removeClass("current");
});


/* 购物车 */
// 获取本地的商品id
let id = sessionStorage.getItem('goodsId');
// 判断商品id是否存在，否则跳转回列表页
if (!id) {
    layer.msg('非法请求', { icon: 2, time: 1500 }, () => {
        location.href = './list.html'
    })
}
// 根据商品id发起请求，获取到商品数据
// 添加加载层
let index = layer.load(1, {
    shade: .7
})
// 发送请求
getGoodsInfo()
async function getGoodsInfo() {
    let { data } = await $.ajax({
        url: '../server/detail.php',
        data: {
            id
        },
        dataType: 'json'
    })
    // console.log(data);
    // 渲染商品图片
    let imgPaths = data.imgpath.split('==========');
    // 获取到商品详情数据然后渲染放大镜图
    $('.preview_img img').attr('src', imgPaths[0]);
    // // 遍历imgPaths数组，渲染其他详情图
    let str = '';
    imgPaths.forEach(item => {
        str += `<li><img src=${item} /></li>`
    });
    // console.log(str);
    $('.list_item').html(str);

    /* 鼠标移入小图实现图片切换 */
    $(".list_item li").mouseover(function () {
        $(this).addClass("current").siblings().removeClass("current");
        $(".preview_img img").attr('src', $(this).children("img")[0].src);
    });
    // 渲染商品信息
    $('.itemInfo_wrap>.sku_name').text(data.name)
        .next().html(`购买1-50件时享受单件价￥${data.price - 5}，超出数量以结算价为准`)
    $('.summary .price').text(`${data.price}`)
    $('.detail .item_infos').text(data.introduce)
    // 将商品的库存写入input标签的自定义属性中 data-stock
    $('#num').attr('data-stock', data.stock)
    // 关闭加载层
    layer.close(index)
};

// 通过cookie获取用户信息，并判断是否登录
let username = getCookie('username');
// 点加入购物车
$('.addCar').click(( ) => {
    // 用户没登陆跳转回登陆页面
    if (!username) {
        layer.msg('登录后才能加入购物城', { icon: 2, time: 2000 }, function () {
            location.href = './login.html'
        });
        return
    }
    // 获取购物数量
    let num = $('#num').val();
    // 先获取本地存储购物车的数据
    let localData = localStorage.getItem('data');
    // 判断购物车是否为空
    if (!localData) {
        // 购物车为空,直接将数据添加到data
        let obj = {
            goodsId: id,
            num,
            username
        }
        // 存入localStorage
        localStorage.setItem('data', JSON.stringify([obj]));
        layer.msg('加入购物车成功', { time: 2000 });
    } 
    // 购物车不为空
    else {        
        let data = JSON.parse(localData);
        // 判断之前该用户知否将这个商品加入过购物城
        let res = data.findIndex(v => v.username == username && v.goodsId == id);
        if (res != -1) { // 如果res不为-1则  这个用户之前就已经将这个商品加入购物车
            // 将这个之前就加入到购物的数据拿出来
            let cart = data.find(v => v.username == username && v.goodsId == id);
            // 将需要加入购物城的商品数累加并入data数据中
            cart.num = parseInt(cart.num) + parseInt(num);
            // 重新存入到localStorage
            localStorage.setItem('data', JSON.stringify(data));
            layer.msg('加入购物车成功', { time: 2000 })
        } else {
            // 这个用户之前没有将这个商品加入过购物城，直接将数据添加到data
            data.push({
                goodsId: id,
                num,
                username
            });
            // 重新存入到localStorage
            localStorage.setItem('data', JSON.stringify(data));
            layer.msg('加入购物车成功', { time: 2000 })
        }
    }
})

// 给加和减绑定点击事件
$('.add').click(function () {
    // 点击了加则将减按钮的禁用属性去除
    $(this).next().attr('disabled', false);
    // 获取input中的val，和库存值
    let val = $(this).prev().val() - 0;
    let stock = $(this).prev()[0].dataset.stock - 0;
    if (val == stock) { // 判断是否超出库存量
        $(this).prev().val(stock);
        $(this).attr('disabled', true);
        layer.msg('超出库存', { time: 1500 });
    } else {
        $(this).prev().val(++val);
    }
})

$('.reduce').click(function () {
    // 点击了减， 则将加按钮的禁用属性去除
    $(this).prev().attr('disabled', false);
    // 获取input中的val，和库存值
    let val = $(this).prev().prev().val() - 0;
    if (val == 1) { // 判断是否超出库存量
        $(this).prev().prev().val(1);
        $(this).attr('disabled', true);
        layer.msg('购买数最少为1', { time: 1500 });
    } else {
        $(this).prev().prev().val(--val);
    }
})






