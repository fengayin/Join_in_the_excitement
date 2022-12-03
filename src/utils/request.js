const url_all = {
    'DEV': 'http://localhost:8080'
}
let BASEURL = url_all['DEV']


// export const request = (options = {}) => {
//     uni.showLoading({
//         title: "加载中"
//     })
//     return new Promise((resolve, reject) => {
//         handleRequest(options, resolve, reject)
//     })
// }

// function handleRequest(options, resolve, reject) {
//     uni.request({
//         url: BASEURL + options.url,
//         method: options.method,
//         data: options.data,
//         success: (res) => {
//             console.log(res.data);
//             return resolve(res.data)
//         },
//         fail: (err) => {
//             console.log('err', err);
//             return reject(err)
//         },
//         complete() {
//             uni.hideLoading()
//         }
//     })
// }
// const BASE_URL = 'http://localhost:8080'
// import regeneratorRuntime from 'regenerator-runtime'
const showToast = (title) => {
    uni.showToast({
        title: title,
        icon: 'none'
    })
}
/**请求接口
 * @method http
 * @param {String} url 接口地址
 * @param {Object} data 接口参数
 * @param {Object} option 接口配置信息，可选
 * @return {Object} Promise
 */

export const request = (options) => {
    let url = BASEURL + options.url,
        data = options.data,
        method = options.method
    let types = '';
    let contentType = options.contentType
    if (method == 'POST' && !contentType) {
        types = 'application/x-www-form-urlencoded'
    } else if (method == 'POST' && contentType) {
        types = contentType
    } else {
        types = 'application/json';
    }
    let hideLoading = options.hideLoading || true // 是否显示 loading
    let hideMsg = options.hideMsg || true // 是否隐藏错误提示
    let token = uni.getStorageSync('uerInfo').token || '' // 登录鉴权获得的 token
    // console.log(token);
    if (!hideLoading) {
        uni.showLoading({
            title: '加载中...',
            mask: true
        })
    }
    return new Promise((resolve, reject) => {

        uni.request({
            url: url,
            method: method || 'POST', // 默认 post 请求
            // header: url = '/user/getToken' ? {
            //     'Content-Type': types,
            // } : {
            //     'token': token,
            //     'Content-Type': types,

            // },
            header: {
                'token': token,
                'Content-Type': types,
            },
            data: data,

            success: res => { // 服务器成功返回的回调函数
                // console.log(res)
                if (!hideLoading) uni.hideLoading()
                if (res.statusCode === 200) {
                    let result = res.data
                    // console.log(result, 2)
                    resolve(result)
                    if (result.errcode === '0') {
                        resolve(result)
                        return
                    }
                    // reject(result.errmsg)
                    if (!hideMsg) showToast(result.errmsg)
                } else { // 返回值非 200，强制显示提示信息
                    showToast('[' + res.statusCode + '] 系统处理失败')
                    reject('[' + res.statusCode + '] 系统处理失败')
                }
            },
            fail: (err) => { // 接口调用失败的回调函数
                if (!hideLoading) uni.hideLoading()
                if (err.errMsg != 'request:fail abort') {
                    showToast('连接超时，请检查您的网络。')
                    reject('连接超时，请检查您的网络。')
                }
            }
        })
    })
}
// export default request