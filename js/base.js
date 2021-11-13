$(function () {
    let username = getCookie('username')
    // 判断用户是否登录--判断cookie中会否存在username的值，点击购物车跳转
    if (username) {
        $('.ban-con_rt>.user-login').css('display', 'none').next().css('display', 'block')
        $('.ban-con_rt>.user-login-suc .info>a>span').text(`${username}`)
        $('.nologin>a').eq(0).text(`Hi，${username}`).css({ 'font-weight': '700', 'color': 'red' })
        $('.nologin>a').eq(1).text('退出').css('color', '#999')
        /* 点击退出登录并跳回登录页面 */
        $('.ban-con_rt>.user-login-suc .info>p>span').click(function () {
            // 使用layer的confirm弹出层，展示 确定 和 取消 的选项
            layer.confirm('你确定要退出吗？', { btn: ['确定', '取消'] },
                // 第一个 确定 按钮点击触发的函数
                function () {
                    // 删除cookie，退出登录状态
                    delCookie('username');
                    $('.ban-con_rt>.user-login').css('display', 'block').next().css('display', 'none')
                    layer.msg('退出成功', { icon: 1, time: 1500 }, () => {
                        location.href = './login.html'
                    })

                },
                // 第二个 取消 按钮 点击触发的函数
                function () {
                    layer.msg('已取消', { icon: 1, time: 500 })
                    return false;
                }
            )
        })
        /* 导航栏中点击退出登录并跳回登录页面 */
        $('.nologin>a').eq(1).click(function () {
            // 使用layer的confirm弹出层，展示 确定 和 取消 的选项
            layer.confirm('你确定要退出吗？', { btn: ['确定', '取消'] },
                // 第一个 确定 按钮点击触发的函数
                function () {
                    // 删除cookie，退出登录状态
                    delCookie('username');
                    $('.ban-con_rt>.user-login').css('display', 'block').next().css('display', 'none')
                    layer.msg('退出成功', { icon: 1, time: 1500 }, () => {
                        location.href = './login.html'
                    })

                },
                // 第二个 取消 按钮 点击触发的函数
                function () {
                    layer.msg('已取消', { icon: 1, time: 500 })
                    return false;
                }
            )
        })

        // 渲染相应用户的购物车商品数量，点击我的购物车跳转到购物车页面
        // 获取购物车的数据
        let cartData = localStorage.getItem('data');
        // 判断购物车是否有数据，如果没有不进行渲染，默认为0，购物车有数据，再判断本地购物车中是否有对应的用户数据
        if (cartData) {
            let cartArr = JSON.parse(cartData)
            console.log(cartArr);
            // 取出用户在购物车中的商品数量num
            let goodsIds = cartArr.map(v => {
                if (v.username === username) {
                    return v.num;
                }
            })
            console.log(goodsIds);
            // 去除goodsIds中的undefined
        let gids = goodsIds.filter(v => v !== undefined)
        console.log(gids);
            // 求和渲染到购物车里面
            let cartNum =0
            gids.forEach(v => {
                cartNum +=parseInt(v)
            })
            console.log(cartNum);
            $('.hopping_count').text(`${cartNum}`)
        }

        // 点击我的购物车跳转到购物车页面
        $('.shopping_cart').click(() => {
            layer.msg('正在跳转', { time: 1500 }, () => {
                location.href = './cart.html'
            })
        })
    } else {
        // 未登录点击我的购物车跳转到登录页面
        $('.shopping_cart').click(() => {
            layer.msg('请先登录', { time: 1500 }, () => {
                location.href = './login.html'
            })
        })
    }

    // 点击顶部推荐跳转到列表页
    $('#promotion-top').click(()=>{
        location.href='./list.html'
    })
})

