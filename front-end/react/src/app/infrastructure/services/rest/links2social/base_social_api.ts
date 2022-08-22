import { AxiosError, AxiosResponse } from "axios";
import { BaseRestApi } from "../rest_api";

/**
 * Staus Code Map
 */
const STATUS_CODE_MAP = {
    200 : "Ok",
    201 : "Created",
    400 : "Bad User Request",
    401 : "Unauthorized",
    403 : "Forebidden",
    404 : "Not found",
    419 : "Rate Limited",
    500 : "Server Error"
}

export type ErrorResponse = {
    status_code : number;
    status_message : string;
    error_message : string
    is_error : true
}

export type SuccessResponse<T> = {
    message : string , 
    data : T
}

/**
 * BaseModel response from the api
 */
export type BaseModelResponse = {
    id:         string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}

/**
 * @description Base Link to Social Api Client
 * @author Ahmad Baderkhan
 * @version 1
 */
export abstract class BaseSocialApi extends BaseRestApi {
    
    constructor(baseURL : string , baseUrlForBaseAxios : string = "") {
        super(baseURL, baseUrlForBaseAxios)
    }

    /**
     * Handle axios errors
     * @param err 
     * @returns 
     */
    protected handleErr (err : AxiosError) : ErrorResponse {
        let errorMessage = (err.response?.data as any).error_message as string
        return {
            error_message : errorMessage ? errorMessage :(err.response?.data as any).message,
            status_message : STATUS_CODE_MAP[err.response?.status as number] , 
            status_code : err.response?.status as number,
            is_error : true
        }
    }

    /**
     * Handles a successful response that returns back some data for the client
     * @param res 
     * @returns 
     */
    protected handleSuccess<T>(res : AxiosResponse) : SuccessResponse<T> {
        return {
            data : res.data.data as T,
            message : res.data.message as string
        }
    }

    /**
     * Axios Response Handler -> takes a promise and then attaches functions that would transform the data to the SuccessResponse<T> template
     * or ErrorResponse
     * @param axiosPromise 
     * @returns 
     */
    protected _handleAxiosResponse<T>(axiosPromise : Promise<AxiosResponse<any, any>>) : Promise<SuccessResponse<T> | ErrorResponse> {
        return axiosPromise.then((data)=>this.handleSuccess<T>(data)).catch((err)=>this.handleErr(err))
    }

    /**
     * Axios Response Hanlder -> takes a rpmise and then attaches functions that would transorm the response to boolean or error response
     * @param axiosPromise 
     * @returns 
     */
    protected _handleBooleanAxiosResponse(axiosPromise : Promise<AxiosResponse<any, any>>) : Promise<boolean | ErrorResponse> {
        return axiosPromise.then(()=>true).catch((err)=>this.handleErr(err))
    }

}