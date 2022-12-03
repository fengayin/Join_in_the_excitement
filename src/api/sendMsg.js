import {
    request
} from "../utils/request";

export const sendMsg = (options) => {
    let dataItem = {
        "data": options
    }
    // dataItem = JSON.stringify(dataItem)
    return request(

        {
            url: '/mess/pushUser',
            method: 'POSt',
            data: dataItem

        }
    )
}