import {
    request
} from "../utils/request";

export const createRecord = () => {
    return request(
        {
            url: '/record/createRecord',
            method: 'get',
        }
    )
}