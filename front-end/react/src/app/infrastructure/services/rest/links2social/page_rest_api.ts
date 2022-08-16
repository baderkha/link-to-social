import { BaseModelResponse, BaseSocialApi, ErrorResponse, SuccessResponse } from "./base_social_api";


export type Page = BaseModelResponse & {
    
}

/**
 * Page Rest Api
 * @author Ahmad Baderkhan
 * @version 1
 */
export class PageRestApi extends BaseSocialApi {
    
    constructor(baseURL : string) {
        super(baseURL + "/pages")
    }

    /**
     * Create a new Page // draft stage
     * @param details 
     * @returns 
     */
    NewPage(details : Page) : Promise<SuccessResponse<Page> | ErrorResponse> {
        return this._handleAxiosResponse(this.axios.post(``,details))
    }

     /**
     * Edit Page Details
     * @param details 
     * @returns 
     */
    EditPage(details : Page) : Promise<SuccessResponse<Page> | ErrorResponse> {
        return this._handleAxiosResponse(this.axios.patch(`/${details.id}`,details))
    }

     /**
     * Get Main Page for an account
     * @param details 
     * @returns 
     */
    GetMainPage(accountId : string) : Promise<SuccessResponse<Page> | ErrorResponse> {
        return this._handleAxiosResponse(this.axios.get(`/_mainpage?${accountId}`))
    }

     /**
     * Get Main Page for an account
     * @param details 
     * @returns 
     */
    GetPageById(pageId : string) : Promise<SuccessResponse<Page> | ErrorResponse> {
        return this._handleAxiosResponse(this.axios.get(`/?${pageId}`))
    }


    /**
     * Set main page for an account
     * @param details 
     * @returns 
     */
    SetMainPage(pageId : string) : Promise<boolean| ErrorResponse> {
        return this._handleBooleanAxiosResponse(this.axios.post(`/${pageId}/_make_main_page`))
    }

    /**
     * Delete page
     * @param details 
     * @returns 
     */
    DeletePage(pageId : string) : Promise<boolean | ErrorResponse> {
        return this._handleBooleanAxiosResponse(this.axios.delete(`/${pageId}`))
    }
}