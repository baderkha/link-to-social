import { AccountsApi } from "./rest/links2social/accounts_rest_api";
import { AuthenticationApi } from "./rest/links2social/auth_rest_api";
import { LinkRestApi } from "./rest/links2social/links_rest_api";
import { MediaRestApi } from "./rest/links2social/media_rest_api";
import { PageRestApi } from "./rest/links2social/page_rest_api";
import { ISocialApiManager, SocialRestApiManager } from "./social_api_manager";

let apiManager: SocialRestApiManager;

module.exports.SocialApi = (): ISocialApiManager => {
    if (!apiManager) {
        let baseURL = process.env.BASE_API_URL ? process.env.BASE_API_URL : ""
        // dependency injection for the other classes
        apiManager = new SocialRestApiManager({
            acc: new AccountsApi(baseURL),
            auth: new AuthenticationApi(baseURL),
            link: new LinkRestApi(baseURL),
            media: new MediaRestApi(baseURL),
            page: new PageRestApi(baseURL),
        })
    }
    return apiManager
}

