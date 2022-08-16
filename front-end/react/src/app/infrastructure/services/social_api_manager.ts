import { AccountsApi } from "./rest/links2social/accounts_rest_api";
import { AuthenticationApi, } from "./rest/links2social/auth_rest_api";
import { LinkRestApi, Link } from "./rest/links2social/links_rest_api";
import { MediaRestApi } from "./rest/links2social/media_rest_api";
import { PageRestApi, Page } from "./rest/links2social/page_rest_api";
import { ErrorResponse, SuccessResponse } from "./rest/links2social/base_social_api"

export type SocialRestApiManagerDepedencies = {
    acc: AccountsApi
    auth: AuthenticationApi
    link: LinkRestApi
    media: MediaRestApi
    page: PageRestApi
}

/**
 * @description Facade Contract for the socials api
 * @author Ahmad Baderkhan
 * @version 1
 */
export interface ISocialApiManager {
    /**
     * Get the password strength for a given pass 
     */
    pwdStrength: (details: { password: string; }) => Promise<boolean | ErrorResponse>;
    /**
     * Register user to the system
     */
    register: (details: { id: string; email: string; password: string; date_of_birth: Date; first_name: string; last_name: string; }) => Promise<boolean | ErrorResponse>;
    /**
     * Log user into the system
     */
    login: (details: { user_name: string; password: string; }) => Promise<boolean>;
    /**
     * Log user out of the system
     */
    logout: () => Promise<boolean>;
    /**
     * Create a new link
     */
    newLink: (details: Link) => Promise<SuccessResponse<Link> | ErrorResponse>;
    /**
     * Edit an existing link
     */
    editLink: (details: Link) => Promise<ErrorResponse | SuccessResponse<Link>>;
    /**
     * Delete a link by id
     */
    deleteLink: (id: string) => Promise<boolean | ErrorResponse>;
    /**
     * Get Main Page for an account
     */
    getMainPage: (accountId: string) => Promise<SuccessResponse<Page> | ErrorResponse>;
    /**
     * Get Links that belong for a page
     */
    getLinksForPage: (pageId: string) => Promise<SuccessResponse<Link[]> | ErrorResponse>;
    /**
     * Get Links By Id
     */
    getLinksById: (id: string) => Promise<SuccessResponse<Link> | ErrorResponse>;
    /**
     * Get Sepcific Page by Id
     */
    getPageById: (pageId: string) => Promise<SuccessResponse<Page> | ErrorResponse>;
    /**
     * Create a new page
     */
    newPage: (details: Page) => Promise<ErrorResponse | SuccessResponse<Page>>;
    /**
     * Edit an existing page with id
     */
    editPage: (details: Page) => Promise<ErrorResponse | SuccessResponse<Page>>;
    /**
     * Delete a page
     */
    deletePage: (pageId: string) => Promise<boolean | ErrorResponse>;
}

/**
 * @description Implementaion of the ISocialApiManager interface using restful api
 * @author Ahmad Baderkhan
 */
export class SocialRestApiManager implements ISocialApiManager {
    private _acc: AccountsApi
    private _auth: AuthenticationApi
    private _link: LinkRestApi
    private _media: MediaRestApi
    private _page: PageRestApi

    // API FACADE BLOCK
    /**
     * Determine if the password is strong or not
     */
    pwdStrength: (details: { password: string; }) => Promise<boolean | ErrorResponse>;
    /**
     * Register user to the system
     */
    register: (details: { id: string; email: string; password: string; date_of_birth: Date; first_name: string; last_name: string; }) => Promise<boolean | ErrorResponse>;
    /**
     * Log user into the system
     */
    login: (details: { user_name: string; password: string; }) => Promise<boolean>;
    /**
     * Log user out of the system
     */
    logout: () => Promise<boolean>;
    /**
     * Create a new link
     */
    newLink: (details: Link) => Promise<SuccessResponse<Link> | ErrorResponse>;
    /**
     * Edit an existing link
     */
    editLink: (details: Link) => Promise<ErrorResponse | SuccessResponse<Link>>;
    /**
     * Delete a link by id
     */
    deleteLink: (id: string) => Promise<boolean | ErrorResponse>;
    /**
     * Get Main Page for an account
     */
    getMainPage: (accountId: string) => Promise<SuccessResponse<Page> | ErrorResponse>;
    /**
     * Get Links that belong for a page
     */
    getLinksForPage: (pageId: string) => Promise<SuccessResponse<Link[]> | ErrorResponse>;
    /**
     * Get Links By Id
     */
    getLinksById: (id: string) => Promise<SuccessResponse<Link> | ErrorResponse>;
    /**
     * Get Sepcific Page by Id
     */
    getPageById: (pageId: string) => Promise<SuccessResponse<Page> | ErrorResponse>;
    /**
     * Create a new page
     */
    newPage: (details: Page) => Promise<ErrorResponse | SuccessResponse<Page>>;
    /**
     * Edit an existing page with id
     */
    editPage: (details: Page) => Promise<ErrorResponse | SuccessResponse<Page>>;
    /**
     * Delete a page
     */
    deletePage: (pageId: string) => Promise<boolean | ErrorResponse>;

    constructor(apis: SocialRestApiManagerDepedencies) {
        this._acc = apis.acc
        this._auth = apis.auth
        this._media = apis.media
        this._page = apis.page
        this._link = apis.link


        // API FACADE BLOCK
        {
            this.pwdStrength = this._acc.pwdStrength
            this.register = this._acc.register

            // // auth facade
            this.login = this._auth.login
            this.logout = this._auth.logout

   
            this.newLink = this._link.NewLink
            this.editLink = this._link.EditLink
            this.deleteLink = this._link.DeleteLink
            this.getLinksForPage = this._link.GetLinksForPageId
            this.getLinksById = this._link.GetLinkById

   
            this.getMainPage = this._page.GetMainPage
            this.getPageById = this._page.GetPageById
            this.newPage = this._page.NewPage
            this.editPage = this._page.EditPage
            this.deletePage = this._page.DeletePage
        }
        // API FACADE BLOCK END

        

    }


}