import {
    request
} from "../utils/request";

export const getFoodList = () => {
    return request(

        {
            url: '/food/list',
            method: 'GET',


        }
    )
}