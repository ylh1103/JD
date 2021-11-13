$(function () {
    // 通过cookie获取用户名，判断用户是否登录
    let username = getCookie('username');
    // 用户未登录
    if (!username) {
        layer.msg('请先登录', { shade: [.7, '#666'], time: 1500 }, function () {
            location.href = './login.html';
        })
    }
    // 用户已经登录
    // 获取购物车的数据
    let cartData = localStorage.getItem('data');
    // 判断购物车是否有数据，如果没有就显示购物车为空的画面
    if (!cartData) {
        $('.py-container>.w').css('display', 'none').next().css('display', 'block')
    } else {
        // 购物车有数据，再判断本地购物车中是否有用户的数据
        let cartArr = JSON.parse(cartData)
        // 取出用户在购物车中的商品id
        let goodsIds = cartArr.map(v => {
            if (v.username === username) {
                return v.goodsId;
            }
        })
        // 去除goodsIds中的undefined
        let gids = goodsIds.filter(v => v !== undefined)
        // 判断gids是否是空数组，如果为空就显示购物车为空的画面
        if (gids.length === 0) {
            $('.py-container>.w').css('display', 'none').next().css('display', 'block')
        } else {
            // 如果gids数组有商品数据，则将该数组转为字符串,然后获取商品数据
            let ids = gids.join(',');
            getCart();
            async function getCart() {
                let { data } = await $.ajax({
                    url: '../server/cart.php',
                    data: {
                        ids
                    },
                    dataType: 'json'
                })
                // 渲染数据
                let str = '';
                data.forEach(v => {
                    // 获取到购物车的对应商品数量
                    let nums = cartArr.find(item => item.username === username && item.goodsId === v.id).num;
                    str += `
                    <ul class="goods-list yui3-g">
                        <li class="yui3-u-3-8 pr">
                            <div><input type="checkbox" name="selectOne"></div>
                            <div class="good-item">
                                <div class="item-img">
                                    <img src="${v.imgpath.split('==========')[0]}">
                                </div>
                                <div class="item-msg">${v.name}</div>
                            </div>
                        </li>
                        <li class="yui3-u-1-8">
                            <span class="introduce">${v.introduce}</span>
                        </li>
                        <li class="yui3-u-1-8" style="margin:0">
                        ￥<span class="price">${v.price}</span>
                        </li>
                        <li class="yui3-u-1-8">
                        <!--将商品的id和对应商品的购物数量记录在div标签中 --> 
                            <div class="clearfix"  data-stock="${v.stock}" data-id="${v.id}">
                                <button class="btn btn-default reduce">-</button>
                                <input type="text" class="itxt" name="number" value="${nums}">
                                <button class="btn btn-default add">+</button>
                            </div>
                            <div class="youhuo">有货</div>
                        </li>
                        <li class="yui3-u-1-8">
                        ￥<span class="sum">${v.price * nums}</span>
                        </li>
                        <li class="yui3-u-1-8">
                            <div class="del1">
                                <a>删除</a>
                            </div>
                            <div>移入关注</div>
                        </li>
                    </ul>`
                })
                $('.cart-list').html(str);
                // 获取ul的个数，渲染到全部商品
                // 将ul集合对象转为原生的数组
                let uls = Array.prototype.slice.call($('.cart-list>ul'))
                // 获取uls的长度，渲染到全部商品
                $('.goods-types').text(`${uls.length}`)
                // 调用全选，单选函数
                select();
                // 调用加减按钮的点击事件绑定
                addAndRdeuce()
                // 调用移除事件绑定
                remove();
                
            }
        }
    }

    // 计算商品总数和商品总价
    function total() {
        let totalNum = 0; // 商品总数
        let totalPrice = 0; // 商品总价
        $('input[name=selectOne]').each((i, v) => {
            // 判断是否勾选上
            if ($(v).prop('checked')) {
                // 累加商品总数和总价

                $(v).parent().parent().parent().css('background', '#fff4e8')
                totalNum += $(v).parent().parent().parent().find('.clearfix').find('input').val() - 0
                totalPrice += $(v).parent().parent().parent().find('.sum').text() - 0
            } else {
                $(v).parent().parent().parent().css('background', '#fff')
            }
        });
        // 渲染总价和总数
        $('.sumprice-top strong').text(totalNum);
        $('.summoney span').text(totalPrice);
    }

    // 全选单选
    function select() {
        // 全选点击事件
        $('input[name=selectAll]').click(function () {
            $('input[name=selectAll]').prop('checked', $(this).prop('checked'));
            $('input[name=selectOne]').prop('checked', $(this).prop('checked'));
            total();
        });
        // 单选事件
        $('input[name=selectOne]').click(function () {
            // 将jq集合对象转为原生的数组
            let inps = Array.prototype.slice.call($('input[name=selectOne]'))
            // 判断单选元素数组是否每一个都是选中的
            let flag = inps.every(v => $(v).prop('checked'))
            $('input[name=selectAll]').prop('checked', flag)
            total();
        })
    }

    // 实现点击数量加减()
    function addAndRdeuce() {
        // 加绑定点击事件
        $('.add').click(function () {
            $('.reduce').prop('disabled', false);
            let num = $(this).prev().val() - 0;
            let stock = $(this).parent()[0].dataset.stock;
            if (num >= stock) {
                $(this).prev().val(stock);
                $(this).prop('disabled', true);
                layer.msg('超出库存', { time: 1500 });
            } else {
                $(this).prev().val(++num);
            }

            // 修改本地购物车中的数量
            let goodsId = $(this).parent()[0].dataset.id;
            let data = JSON.parse(localStorage.getItem('data'));
            let cartGoods = data.find(v => v.username === username && v.goodsId === goodsId);
            cartGoods.num = num;
            // 将修改后的data写入本地购物车
            localStorage.setItem('data', JSON.stringify(data))
            // 获取到购物车的对应商品数量，渲染到小计中
            let nums = $(this).prev().val()
            let price = $(this).parent().parent().parent().find('.price').text()
            $(this).parent().parent().parent().find('.sum').text(`${price * nums}`)
            total()
        })
        // 减绑定点击事件
        $('.reduce').click(function () {
            $('.add').prop('disabled', false);
            let num = $(this).next().val() - 0;
            if (num <= 1) {
                $(this).next().val(1);
                layer.msg('最少1个', { time: 1500 });
                $(this).prop('disabled', true);
            } else {
                $(this).next().val(--num);
            }

            // 修改本地购物车中的数量
            let goodsId = $(this).parent()[0].dataset.id;
            let data = JSON.parse(localStorage.getItem('data'));
            let cartGoods = data.find(v => v.username === username && v.goodsId === goodsId);
            cartGoods.num = num;
            // 将修改后的data写入本地购物车
            localStorage.setItem('data', JSON.stringify(data))
            // 获取到购物车的对应商品数量，渲染到小计中
            let nums = $(this).next().val()
            let price = $(this).parent().parent().parent().find('.price').text()
            $(this).parent().parent().parent().find('.sum').text(`${price * nums}`)
            total()
        })
    }

    // 点击删除
    function remove() {
        $('.del1>a').click(function () {
            // 弹出层
            layer.confirm('确定要删除吗？', ['确定', '取消'], () => {
                // 点击确定
                // 移除当前这个点击del对应的ul
                $(this).parent().parent().parent().remove();
                // 获取本地购物车数据
                console.log($(this).parent().parent().parent().find('.clearfix')[0]);
                let goodsId = $(this).parent().parent().parent().find('.clearfix')[0].dataset.id;
                let data = JSON.parse(localStorage.getItem('data'));
                let dataArr = data.filter(v => {
                    return !(v.username === username && v.goodsId === goodsId)
                })
                // 写入购物车
                localStorage.setItem('data', JSON.stringify(dataArr));
                // 判断用户购物车中的数据是否为空
                let index = dataArr.findIndex(v => v.username === username);
                if (index == -1) {
                    location.reload(); // 重新加载页面
                } else {
                    layer.msg('删除成功', { time: 1500 });
                }
                total()
            }, function () {
                // 点击取消
                layer.msg('已取消', { time: 1500 });
            })

        })
    }

});