/*
|--------------------------------------------------------------------------
| Ally Oauth driver
|--------------------------------------------------------------------------
|
| Make sure you through the code and comments properly and make necessary
| changes as per the requirements of your implementation.
|
*/
import { Oauth2Driver } from '@adonisjs/ally';
/**
 * Driver implementation. It is mostly configuration driven except the API call
 * to get user info.
 */
export class SeznamDriver extends Oauth2Driver {
    config;
    /**
     * The URL for the redirect request. The user will be redirected on this page
     * to authorize the request.
     *
     * Do not define query strings in this URL.
     */
    authorizeUrl = 'https://login.szn.cz/api/v1/oauth/auth';
    /**
     * The URL to hit to exchange the authorization code for the access token
     *
     * Do not define query strings in this URL.
     */
    accessTokenUrl = 'https://login.szn.cz/api/v1/oauth/token';
    /**
     * The URL to hit to get the user details
     *
     * Do not define query strings in this URL.
     */
    userInfoUrl = 'https://login.szn.cz/api/v1/user';
    /**
     * The param name for the authorization code. Read the documentation of your oauth
     * provider and update the param name to match the query string field name in
     * which the oauth provider sends the authorization_code post redirect.
     */
    codeParamName = 'code';
    /**
     * The param name for the error. Read the documentation of your oauth provider and update
     * the param name to match the query string field name in which the oauth provider sends
     * the error post redirect
     */
    errorParamName = 'error';
    /**
     * Cookie name for storing the CSRF token. Make sure it is always unique. So a better
     * approach is to prefix the oauth provider name to `oauth_state` value. For example:
     * For example: "facebook_oauth_state"
     */
    stateCookieName = 'seznam_oauth_state';
    /**
     * Parameter name to be used for sending and receiving the state from.
     * Read the documentation of your oauth provider and update the param
     * name to match the query string used by the provider for exchanging
     * the state.
     */
    stateParamName = 'state';
    /**
     * Parameter name for sending the scopes to the oauth provider.
     */
    scopeParamName = 'scope';
    /**
     * The separator indentifier for defining multiple scopes
     */
    scopesSeparator = ',';
    constructor(ctx, config) {
        super(ctx, config);
        this.config = config;
        /**
         * Extremely important to call the following method to clear the
         * state set by the redirect request.
         *
         * DO NOT REMOVE THE FOLLOWING LINE
         */
        this.loadState();
    }
    /**
     * Optionally configure the authorization redirect request. The actual request
     * is made by the base implementation of "Oauth2" driver and this is a
     * hook to pre-configure the request.
     */
    configureRedirectRequest(request) {
        request.param('response_type', 'code');
        request.scopes(this.config.scopes || ['identity']);
    }
    /**
     * Optionally configure the access token request. The actual request is made by
     * the base implementation of "Oauth2" driver and this is a hook to pre-configure
     * the request
     */
    // protected configureAccessTokenRequest(request: ApiRequest) {}
    /**
     * Update the implementation to tell if the error received during redirect
     * means "ACCESS DENIED".
     */
    accessDenied() {
        return this.ctx.request.input('error') === 'user_denied';
    }
    /**
     * Returns the HTTP request with the authorization header set
     */
    getAuthenticatedRequest(url, token) {
        const request = this.httpClient(url);
        request.header('Authorization', `bearer ${token}`);
        request.header('Accept', 'application/json');
        request.parseAs('json');
        return request;
    }
    /**
     * Get the user details by query the provider API. This method must return
     * the access token and the user details both. Checkout the google
     * implementation for same.
     *
     * https://github.com/adonisjs/ally/blob/develop/src/Drivers/Google/index.ts#L191-L199
     */
    async user(callback) {
        const accessToken = await this.accessToken();
        return this.userFromToken(accessToken.token, callback);
    }
    async userFromToken(accessToken, callback) {
        const request = this.getAuthenticatedRequest(this.config.userInfoUrl || this.userInfoUrl, accessToken);
        /**
         * Allow end user to configure the request. This should be called after your custom
         * configuration, so that the user can override them (if required)
         */
        if (typeof callback === 'function') {
            callback(request);
        }
        /**
         * Write your implementation details here
         */
        const body = await request.get();
        /**
         * identity (= response body)
         * Scope identity je povinný a uživatel jej nesmí odmítnout. Díky němu budou v odpovědi na /api/v1/user tyto položky:
         * oauth_user_id je unikátní trvalý identifikátor uživatelského účtu
         * username je část uživatelského jména (tj. e-mailové adresy) před zavináčem
         * domain je část uživatelského jména (tj. e-mailové adresy) za zavináčem
         * firstname je křestní jméno, pokud jej uživatel vyplnil
         * lastname je příjmení, pokud jej uživatel vyplnil
         * TODO
         * other scopes
         */
        return {
            id: body.oauth_user_id,
            nickName: body.username,
            name: body.firstname + ' ' + body.lastname,
            email: body.username + '@' + body.domain,
            avatarUrl: null,
            emailVerificationState: 'verified',
            original: body,
            token: { token: accessToken, type: 'bearer' },
        };
    }
}
/**
 * The factory function to reference the driver implementation
 * inside the "config/ally.ts" file.
 */
export function SeznamDriverService(config) {
    return (ctx) => new SeznamDriver(ctx, config);
}