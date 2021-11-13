// input聚焦时样式
$('.login-form input').focus(function () {
    let name = $(this).prop('name')
    if (name == 'username') {
        $(this).prev().css({ 'border-color': '#bbb', 'background-position': '0 -48px' })
    } else {
        $(this).prev().css({ 'border-color': '#bbb', 'background-position': '-48px -48px' })
    }
})
// input失焦时样式
$('.login-form input').blur(function () {
    let name = $(this).prop('name')
    if (name == 'username') {
        $(this).prev().css({ 'border-color': '#bdbdbd', 'background-position': '0 0' })
    } else {
        $(this).prev().css({ 'border-color': '#bdbdbd', 'background-position': '-48px 0' })
    }
})
// 输入框内容变化时添加清除按钮
$('.login-form input').on('input', function () {
    if (!$(this).val()) {
        $(this).next().css('display', 'none')
    } else {
        $(this).next().css('display', 'block').click(function () {
            $(this).prev().val("").next().css('display', 'none');
        })
    }
})

// 给表单提交事件
$('.login-form>form').submit(e => {
    e = e || window.event;
    e.preventDefault(); // 阻止表单的默认提交
    // 将提交的数据获取并放在对象中
    let data = {
        username: $('input[name="username"]').val(),
        password: $('input[name="password"]').val()
    };
    // 用户名和密码全部为空时设置样式
    if (!data.username && !data.password) {
        $('.login-form .login-msg').html(`<i></i>请输入账户名和密码`).css('visibility', 'visible')
        $('.login-form .login-name').css({ 'border': '1px solid #e4393c' }).next().css({ 'border': '1px solid #e4393c' })
        $('.login-form label:eq(0)').css({ 'border-color': '#e4393c', 'background-position': '0 -96px' })
        $('.login-form label:eq(1)').css({ 'border-color': '#e4393c', 'background-position': '-48px -96px' })
        /* 聚焦样式 */
        $('.login-form input').focus(function () {
            $(this).parent().css({ 'border': '1px solid #bdbdbd' })
            let name = $(this).prop('name')
            if (name == 'username') {
                $(this).prev().css({ 'border-color': '#bdbdbd', 'background-position': '0 0' })
            } else {
                $(this).prev().css({ 'border-color': '#bdbdbd', 'background-position': '-48px 0' })
            }
        })
        /* 失焦样式 */
        $('.login-form input').blur(function () {
            $(this).parent().css({ 'border': '1px solid #e4393c' })
            let name = $(this).prop('name')
            if (name == 'username') {
                $(this).prev().css({ 'border-color': '#e4393c', 'background-position': '0 -96px' })
            } else {
                $(this).prev().css({ 'border-color': '#e4393c', 'background-position': '-48px -96px' })
            }
        })
        /* 给用户名输入框设置自动聚焦 */
        $('input[name="username"]').focus()
        return;
    }

    // 用户名存在，密码为空时设置样式
    else if (data.username && !data.password) {
        $('.login-form .login-msg').html(`<i></i>请输入密码`).css('visibility', 'visible')
        $('input[name="username"]').parent().css({ 'border': '1px solid #bdbdbd' })
        $('input[name="username"]').prev().css({ 'border-color': '#bdbdbd', 'background-position': '0 0' })
        /* 聚焦样式 */
        $('.login-form input').focus(function () {
            $(this).parent().css({ 'border': '1px solid #bdbdbd' })
            let name = $(this).prop('name')
            if (name == 'username') {
                $(this).prev().css({ 'border-color': '#bbb', 'background-position': '0 -48px' })
            } else {
                $(this).prev().css({ 'border-color': '#bbb', 'background-position': '-48px -48px' })
            }
        })
        /* 失焦样式 */
        $('.login-form input').blur(function () {
            let name = $(this).prop('name')
            if (name == 'username') {
                $(this).parent().css({ 'border': '1px solid #bdbdbd' })
                $(this).prev().css({ 'border-color': '#bdbdbd', 'background-position': '0 0' })
            } else {
                $(this).parent().css({ 'border': '1px solid #e4393c' })
                $(this).prev().css({ 'border-color': '#e4393c', 'background-position': '-48px -96px' })
            }
        })
        $('input[name="password"]').focus()
        $('input[name="username"]').parent().css({ 'border': '1px solid #bdbdbd' })
        $('input[name="username"]').prev().css({ 'border-color': '#bdbdbd', 'background-position': '0 0' })
        return;
    }

    // 用户名为空，密码存在时设置样式
    else if (!data.username && data.password) {
        $('.login-form .login-msg').html(`<i></i>请输入账户名`).css('visibility', 'visible')
        $('input[name="password"]').parent().css({ 'border': '1px solid #bdbdbd' })
        $('input[name="password"]').prev().css({ 'border-color': '#bdbdbd', 'background-position': '-48px 0' })
        /* 聚焦样式 */
        $('.login-form input').focus(function () {
            $(this).parent().css({ 'border': '1px solid #bdbdbd' })
            let name = $(this).prop('name')
            if (name == 'username') {
                $(this).prev().css({ 'border-color': '#bbb', 'background-position': '0 -48px' })
            } else {
                $(this).prev().css({ 'border-color': '#bbb', 'background-position': '-48px -48px' })
            }
        })
        /* 失焦样式 */
        $('.login-form input').blur(function () {
            let name = $(this).prop('name')
            if (name == 'username') {
                $(this).parent().css({ 'border': '1px solid #e4393c' })
                $(this).prev().css({ 'border-color': '#e4393c', 'background-position': '0 -96px' })
            } else {
                $(this).parent().css({ 'border': '1px solid #bdbdbd' })
                $(this).prev().css({ 'border-color': '#bdbdbd', 'background-position': '-48px 0' })
            }
        })
        $('input[name="username"]').focus()
        $('input[name="password"]').parent().css({ 'border': '1px solid #bdbdbd' })
        $('input[name="password"]').prev().css({ 'border-color': '#bdbdbd', 'background-position': '-48px 0' })
        return;
    }
    
    // 用户名密码都存在时设置样式
    else {
        $('input[name="username"]').parent().css({ 'border': '1px solid #bdbdbd' })
        $('input[name="username"]').prev().css({ 'border-color': '#bdbdbd', 'background-position': '-48px 0' })
        $('input[name="password"]').parent().css({ 'border': '1px solid #bdbdbd' })
        $('input[name="password"]').prev().css({ 'border-color': '#bdbdbd', 'background-position': '-48px 0' })
        // input聚焦时样式
        $('.login-form input').focus(function () {
            $(this).parent().css({ 'border': '1px solid #bdbdbd' })
            let name = $(this).prop('name')
            if (name == 'username') {
                $(this).prev().css({ 'border-color': '#bbb', 'background-position': '0 -48px' })
            } else {
                $(this).prev().css({ 'border-color': '#bbb', 'background-position': '-48px -48px' })
            }
        })
        // input失焦时样式
        $('.login-form input').blur(function () {
            $(this).parent().css({ 'border': '1px solid #bdbdbd' })
            let name = $(this).prop('name')
            if (name == 'username') {
                $(this).prev().css({ 'border-color': '#bdbdbd', 'background-position': '0 0' })
            } else {
                $(this).prev().css({ 'border-color': '#bdbdbd', 'background-position': '-48px 0' })
            }
        })
    }

    // ajax请求登录
    $.ajax({
        url: '../server/login.php',
        type: 'POST',
        data: data,
        dataType: 'json',
        success(res) {
            var { meta: { status, msg } } = res;
            if (status == 0) {
                $('.login-form .login-msg').css('visibility', 'hidden')
                setCookie('username', data.username)
                layer.msg(msg, { icon: 1, time: 1500 }, () => {
                    location.href = './index.html'
                })
            } else {
                $('.login-form .login-msg').html(`<i></i>${msg}`).css('visibility', 'visible')
            }
        }
    })
})

