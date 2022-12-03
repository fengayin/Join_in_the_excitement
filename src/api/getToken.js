import {
    request
} from "../utils/request";

export const getToken = (options) => {
    return request(
        // '/get_openid', {
        //     options
        // }, {
        //     method: 'POST'
        // }
        {
            url: '/user/getToken',
            method: 'POST',
            data: {
                code: options
            }

        }
    )
}