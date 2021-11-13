/* 输入框聚焦时设置边框样式，增加提示 */
$('.reg-form input').focus(function () {
    $(this).parent().css('border-color', 'rgb(102,102,102)')
    // 内容为空时设置提示
    let content = $(this).val()
    if (!content) {
        let name = $(this).prop('name')
        switch (name) {
            case 'username':
                $(this).parent().next().html("<i class='i-def'></i>支持中文、英文、数字、“-”、“_”的组合，4-20个字符").css('color', '#c5c5c5')
                break;
            case 'pw':
                $(this).parent().next().html("<i class='i-def'></i>建议使用字母、数字和符号两种及以上的组合，8-20个字符").css('color', '#c5c5c5')
                break;
            case 'rpw':
                $(this).parent().next().html("<i class='i-def'></i>请再次输入密码").css('color', '#c5c5c5')
                break;
            case 'email':
                $(this).parent().next().html("<i class='i-def'></i>支持qq、163、126等邮箱").css('color', '#c5c5c5')
                break;
            case 'tel':
                $(this).parent().next().html("<i class='i-def'></i>请输入11位的手机号").css('color', '#c5c5c5')
                break;
        }
    }
})

/* 输入框失焦时设置边框样式，没有内容时清除提示*/
$('.reg-form input').blur(function () {
    $(this).parent().css('border-color', 'rgb(153, 153, 153)')
    if (!$(this).val()) {
        $(this).parent().next().html('')
    }
})

/* 输入框内容变化时设置提示样式，用正则判断密码格式，添加清除按钮*/
$('.reg-form input').on('input', function () {
    // 先清除符合要求标志
    $(this).next().css('display', 'none')
    // 添加清除按钮，清除内容和提示
    if (!$(this).val()) {
        $(this).next().next().css('display', 'none')
    } else {
        $(this).next().next().css('display', 'block')
    }
    // 输入框内容变化时设置提示样式
    let name = $(this).prop('name')
    switch (name) {
        case 'username':
            $(this).parent().next().html("<i class='i-err'></i>请输入中文、英文、数字、“-”、“_”的组合，4-20个字符").css('color', '#f91')
            break;
        case 'pw':
            // 正则判断密码是否为8-20位，并且由字母，数字和符号两种以上组合，不能包含空格
            let reg1 = /(?!\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,20}/;
            let pw = $(this).val()
            // 判断是否包含空格
            let res = pw.search(/\s/)
            if (res != -1) {
                $(this).parent().next().html("<i class='i-err'></i>登录密码仅支持字母、数字或字符，不可包含空格").css('color', '#f91')
                return
            }
            if (pw.length < 8) {
                $(this).parent().next().html("<i class='i-err'></i>请将密码设置为8-20位，并且由字母，数字和符号两种以上组合").css('color', '#f91')
                return
            }
            // 判断密码长度大于等于8时，是否使用两种及以上组合
            // 只有一种字符时提示密码很弱
            if (!reg1.test(pw)) {
                $(this).parent().next().html("<i class='i-ruo'></i>有被盗风险,建议使用字母、数字和符号两种及以上组合！").css('color', '#e2231a')
            } else {
                let reg2 = /(?=.*[a-z_])(?=.*\d)(?=.*[^a-z0-9_])[\S]{8,}/i/* 必须包含数字字符和特殊字符的正则表达式 */
                // 只有两种字符，但字符数小于11时提示密码适中
                let res = pw.length < 11 && !reg2.test(pw)
                if (res) {
                    $(this).next().css('display', 'block').next().css('display', 'none').parent().next().html("<i class='i-zhong'></i>安全强度适中，可以使用三种以上的组合来提高安全强度").css('color', '#f91')
                }
                else {

                    // 有三种字符，或者字符数大于11时提示密码安全
                    $(this).next().css('display', 'block').next().css('display', 'none').parent().next().html("<i class='i-qiang'></i>你的密码很安全").css('color', 'green')
                }
            }
            break;
        case 'rpw':
            $(this).parent().next().html("<i class='i-err'></i>请再次输入密码").css('color', '#f91')
            break;
        case 'email':
            $(this).parent().next().html("<i class='i-err'></i>请将邮箱设置为qq、163或者126邮箱").css('color', '#f91')
            break;
        case 'tel':
            $(this).parent().next().html("<i class='i-err'></i>请输入11位的手机号").css('color', '#f91')
            break;
    }

})

/* 输入框内容变化并且失焦时增加正则简单判断是否符合要求，并请求后台判断用户名是否存在 */
$('.reg-form input').change(function () {
    $(this).next().next().click(function () {
        $(this).css('display', 'none').prev().prev().val('').parent().next().html('')
    })
    let name = $(this).prop('name')
    switch (name) {
        case 'username':
            // 正则判断用户名是否为中文、英文、数字、“-”、“_”的组合，4-20个字符，不能为纯数字
            let reg1 = /^[(a-zA-Z0-9\u4e00-\u9fa5){1}_#]{4,20}$/;
            let reg2 = /^\d{1,}$/
            // 判断用户名长度是否在4-20个字符之间
            let username = $(this).val()
            if (username.length < 4 || username.length > 20) {
                $(this).parent().next().html("<i class='i-err'></i>长度只能在4-20个字符之间").css('color', '#f91')
                return
            }
            // 判断用户名长度是否为纯数字
            if (reg2.test(username)) {
                $(this).parent().next().html("<i class='i-err'></i>用户名不能是纯数字，请重新输入！").css('color', '#f91')
                return
            }
            // 判断用户名是否为中文、英文、数字、“-”、“_”的组合，4-20个字符
            if (!reg1.test(username)) {
                $(this).parent().next().html("<i class='i-err'></i>格式错误，支持中文、英文、数字、“-”、“_”的组合").css('color', '#f91')
            } else {
                // 请求后台判断用户名是否存在
                $.ajax({
                    url: '../server/register.php',
                    type: 'POST',
                    data: {username},
                    dataType: 'json',
                    success(res) {
                        var { meta: { status, msg } } = res
                        if (status == 2) {
                            $('.reg-form input[name=username]').parent().next().html(`<i class='i-err'></i>${msg}`).css({ 'color': '#ee2223' })
                        } else {
                            $('.reg-form input[name=username]').next().css('display', 'block').next().css('display', 'none').parent().next().html('')
                        }
                    }
                })
            }
            break;

        // 正则判断密码格式是否符合要求
        case 'pw':
            let pw = $(this).val()
            // 判断密码长度是否在8-20个字符之间
            if (pw.length < 8 || pw.length > 20) {
                $(this).parent().next().html("<i class='i-err'></i>长度只能在8-20个字符之间").css('color', '#f91')
            }
            // 如果确认密码框中有值，判断两者是否一致
            let rpw = $('.reg-form input[name=rpw]').val()
            if(rpw){
                if (pw != rpw) {
                    $('.reg-form input[name=rpw]').next().css('display', 'none').parent().next().html("<i class='i-err'></i>您两次输入的密码不同，请重试").css('color', '#f91')
                } else {
                    $('.reg-form input[name=rpw]').next().css('display', 'block').next().css('display', 'none').parent().next().html('')
                }
            }
            break;

        // 判断两次密码输入是否一致
        case 'rpw':
            let pws = $('.reg-form input[name=pw]').val()
            let rpws = $(this).val()
            if (pws !== rpws) {
                $(this).parent().next().html("<i class='i-err'></i>您两次输入的密码不同，请重试").css('color', '#f91')
            } else {
                $(this).next().css('display', 'block').next().css('display', 'none').parent().next().html('')
            }
            break;

        // 验证邮箱是否符合要求
        case 'email':
            let email = $(this).val()
            let reg3 = /(^[a-zA-Z]\w{3,11}@(126|163)\.com$)|(^1\d{4,11}@qq\.com$)/
            if (!reg3.test(email)) {
                $(this).parent().next().html("<i class='i-err'></i>请输入正确的邮箱").css('color', '#f91')
            }
            else {
                $(this).next().css('display', 'block').next().css('display', 'none').parent().next().html('')
            }
            break;

        // 验证手机号码是否符合要求
        case 'tel':
            let tel = $(this).val()
            let reg4 = /^1[3-9]\d{9}$/
            if (!reg4.test(tel)) {
                $(this).parent().next().html("<i class='i-err'></i>请输入正确的手机号码").css('color', '#f91')
            }
            else {
                $(this).next().css('display', 'block').next().css('display', 'none').parent().next().html('')
            }
            break;
    }
})


// 给表单增加提交事件
$('.reg-form>form').submit(function (e) {
    e = e || window.event;
    e.preventDefault();
    let flag = false
    let arr =[]
    $('.reg-form input').each(function (i, item) {
        // 判断输入框是否为空，为空就不请求数据
        if (!$(item).val()) {
            $(item).parent().next().html(`<i class='i-err'></i>${$(item).prev().text()}&nbsp;&nbsp;不&nbsp;&nbsp;能&nbsp;&nbsp;为&nbsp;&nbsp;空`).css('color', '#f91')
            return false
        } else {
            // 判断输入框内容是否都符合要求，不符合就不请求数据
            let sta = $(item).next().css('display')
            arr.push(sta)
        }
    })
    // arr长度为5并且都为block时再请求数据
    let res=arr.every(function(v){
        return v=="block"
    })
    if(arr.length==5&&res){
            let username = $('.reg-form input[name=username]').val()
            let password = $('.reg-form input[name=pw]').val()
            let email = $('.reg-form input[name=email]').val()
            let tel = $('.reg-form input[name=tel]').val()
            // 上面都符合要求后发送请求，进行注册   
            // 注册请求ajax，弹出加载遮罩层
            console.log(123);
            var index = layer.load(1, {
                shade: [0.5, '#666'] //0.1透明度的白色背景
            });
            $.ajax({
                url: '../server/register.php',
                type: 'POST',
                data: {
                    username,
                    password,
                    tel,
                    email
                },
                dataType: 'json',
                success(res) {
                    // console.log(res);
                    // 接收到注册的请求响应，关闭遮罩层
                    layer.close(index)
                    // 结构赋值 接受返回的响应数据
                    var { meta: { status, msg } } = res
                    // 注册成功时消息提示2秒然后跳转到登录页面
                    if (status == 0) {
                        layer.msg(msg,{icon:1,time:2000},()=>{
                            location.href='./login.html'
                        })
                    } else {
                        layer.msg(msg,{icon:2,time:2000})
                    }
                }
            })
    }
})