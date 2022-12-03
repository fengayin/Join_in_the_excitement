import {
    request
} from "../utils/request";

export const addHaw = (options) => {
    return request({
        url: '/haw',
        method: 'post',
        data: options
    })
}