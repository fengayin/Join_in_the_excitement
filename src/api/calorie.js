import {
    request
} from "../utils/request";

export const countSummaryCalculation = (options) => {
    return request(

        {
            url: '/calorie/countSummaryCalculation',
            method: 'GET',
            data: options
        }
    )
}

export const optionalSummaryCalculation = (options) => {
    return request(

        {
            url: '/calorie/optionalSummaryCalculation',
            method: 'GET',
            data: options
        }
    )
}


export const showCalculation = (options) => {
    return request(

        {
            url: '/calorie/showCalculation',
            method: 'GET',
            data: options
        }
    )
}