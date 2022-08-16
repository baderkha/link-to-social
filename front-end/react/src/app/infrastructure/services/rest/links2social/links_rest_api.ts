import { BaseModelResponse, BaseSocialApi, ErrorResponse, SuccessResponse } from "./base_social_api";


export type Link = BaseModelResponse & {
    label : string
    type : string
    href : string
    page_id : string
    button_photo_id : string
}

/**
 * Links API allows you to edit links
 * @author Ahmad Baderkhan
 */
export class LinkRestApi extends BaseSocialApi {

    constructor(baseURL : string) {
        super(baseURL +"/links")
    }

    /**
     * Gets All Links for a specific page
     * @param pageId 
     * @returns 
     */
    GetLinksForPageId(pageId : string) : Promise<SuccessResponse<Link[]>|ErrorResponse> {
        return this._handleAxiosResponse<Link[]>(this.axios.get(`?page_id=${pageId}`))
    }

    /**
     * Get Links By Id
     * Gets 1 link by id
     * @param id 
     * @returns 
     */
    GetLinkById(id : string ) : Promise<SuccessResponse<Link>|ErrorResponse>  {
        return this._handleAxiosResponse<Link>(this.axios.get(`/${id}`))
    }

    /**
     * Generates a new link
     * @param details 
     * @returns 
     */
    NewLink(details: Link) : Promise<SuccessResponse<Link>|ErrorResponse> {
       return this._handleAxiosResponse<Link>(this.axios.post('',{...details}))
    }

    /**
     * Edits a link information
     * @param details 
     * @returns 
     */
    EditLink(details : Link) : Promise<SuccessResponse<Link> | ErrorResponse> {
        return this._handleAxiosResponse<Link>(this.axios.patch(`/${details.id}`,{...details}))
    }

    /**
     * Deletes a link
     * @param id 
     * @returns 
     */
    DeleteLink(id : string) : Promise<boolean | ErrorResponse> {
        return this._handleBooleanAxiosResponse(this.axios.delete(`/${id}`))
    }
}