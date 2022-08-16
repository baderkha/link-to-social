import { BaseRestApi } from "../rest_api";
import { BaseSocialApi, SuccessResponse , ErrorResponse } from "./base_social_api";


export class AuthenticationApi extends BaseSocialApi {

    constructor(baseUrl: string) {
        super(baseUrl)
       

    }


    login(details: {
        user_name: string,
        password: string
    }): Promise<boolean> {
        return this.axios.
            post('/login', { ...details }).
            then(() => true).
            catch(() => false)
    }

    logout(): Promise<boolean> {
        return this.axios.
            post('/logout', {}).
            then(() => true).
            catch(() => false)
    }

}