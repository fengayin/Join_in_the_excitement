import {
    request
} from "../utils/request";

export const getMsgList = () => {

    return request(

        {
            url: '/mess/list',
            method: 'GET',
            // data: dataItem

        }
    )
}