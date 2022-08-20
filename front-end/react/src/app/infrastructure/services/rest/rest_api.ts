

import axios, { AxiosInstance, AxiosStatic } from "axios"

/**
 * @description Base Rest Api class that has axios config for restful api support
 * @author Ahmad Baderkhan
 * @version 1
 * 
 */
export abstract class BaseRestApi {
    protected axios : AxiosInstance;
    protected axiosBase : AxiosInstance
    
    constructor (baseUrl : string , baseUrlForBaseAxios : string = "") {
        this.axios = axios.create()
        this.axiosBase = axios.create()
        this.axios.defaults.baseURL = baseUrl
        this.axios.defaults.headers.post['Content-Type'] = "application/json"
        this.axios.defaults.headers.patch['Content-Type'] = "application/json"
        this.axios.defaults.headers.put['Content-Type'] = "application/json"

        this.axiosBase.defaults.baseURL = baseUrlForBaseAxios
        this.axiosBase.defaults.headers.post['Content-Type'] = "application/json"
        this.axiosBase.defaults.headers.patch['Content-Type'] = "application/json"
        this.axiosBase.defaults.headers.put['Content-Type'] = "application/json"
    }

    /**
     * Gets an axios client with the base configs and base url
     * @returns 
     */
    protected _getClient() : AxiosInstance {
        return this.axios;
    }
}