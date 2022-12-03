import {
    request
} from "../utils/request";

export const recordAllMotion = (option) => {
    return request({
        url: '/recordMotion/recordAllMotion',
        method: 'post',
        data: option

    })
}