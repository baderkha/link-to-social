import { BaseSocialApi, SuccessResponse } from "./base_social_api";
import { ErrorResponse , BaseModelResponse } from "./base_social_api";

/**
 * Account Response from backend
 */
type Account = BaseModelResponse & {
    email:      string;
    password:   string;
}

/**
 * @description Backend Access to the accounts route
 * @author Ahmad Baderkhan
 */
export class AccountsApi extends BaseSocialApi {
   
    constructor(BaseURL : string) {
        super(BaseURL + '/accounts')
        
    }

    /**
     * Register a New Account
     * @param details 
     * @returns 
     */
    register(details : {
        id:       string,
        email:    string,
        password: string,
        date_of_birth : Date , 
        first_name : string , 
        last_name : string
    }) : Promise<boolean|ErrorResponse> {
        return  this.axios.
        post('', { ...details }).
        then(() => true).
        catch((err ) => this.handleErr(err))
    }

    /**
     * Get Exact Account ID ... not fuzzy
     * @param details 
     * @returns 
     */
    getAccount(details : {
        account_id : string
    }) : Promise < SuccessResponse<Account> | ErrorResponse> {
        return this.axios.
        get(`/${details.account_id}`).
        then((data)=>this.handleSuccess<Account>(data)).
        catch((err)=>this.handleErr(err))
    }

    /**
     * Get The Password strength , does not check ispwned api , this happens in the registration api
     * @param details 
     * @returns 
     */
    pwdStrength(details : {
        password : string
    }) : Promise<boolean | ErrorResponse> {
        return this.axios.
        post('/accounts/password-strength/check',{...details}).
        then(()=>true).
        catch((err)=>this.handleErr(err))
    }
}