import {
    request
} from "../utils/request";

export const getMotionList = () => {
    return request(

        {
            url: '/motion/list',
            method: 'GET',


        }
    )
}