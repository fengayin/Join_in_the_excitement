import {
    request
} from "../utils/request";

export const deleteMess = (id) => {

    return request(

        {
            url: '/mess/delete/' + id,
            method: 'DELETE',

        }
    )
}