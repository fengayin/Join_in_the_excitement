import {
    request
} from "../utils/request";

export const recordAllFood = (option) => {
    return request({
        url: '/recordFood/recordAllFood',
        method: 'post',
        data: option

    })
}