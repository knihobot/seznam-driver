/// <reference types="@adonisjs/ally" />
/// <reference types="@adonisjs/http-server/build/adonis-typings" />
/// <reference types="@adonisjs/ally" />
import type { AllyUserContract } from '@ioc:Adonis/Addons/Ally';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Oauth2Driver, ApiRequest, RedirectRequest } from '@adonisjs/ally/build/standalone';
/**
 * Define the access token object properties in this type. It
 * must have "token" and "type" and you are free to add
 * more properties.
 */
export declare type SeznamDriverAccessToken = {
    token: string;
    type: 'bearer';
};
/**
 * Define a union of scopes your driver accepts. Here's an example of same
 * https://github.com/adonisjs/ally/blob/develop/adonis-typings/ally.ts#L236-L268
 */
export declare type SeznamDriverScopes = 'identity' | 'contact-phone' | 'avatar';
/**
 * Define the configuration options accepted by your driver. It must have the following
 * properties and you are free add more.
 */
export declare type SeznamDriverConfig = {
    driver: 'seznam';
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    authorizeUrl?: string;
    accessTokenUrl?: string;
    userInfoUrl?: string;
    scopes?: SeznamDriverScopes[];
};
/**
 * Driver implementation. It is mostly configuration driven except the user calls
 */
export declare class SeznamDriver extends Oauth2Driver<SeznamDriverAccessToken, SeznamDriverScopes> {
    config: SeznamDriverConfig;
    /**
     * The URL for the redirect request. The user will be redirected on this page
     * to authorize the request.
     *
     * Do not define query strings in this URL.
     */
    protected authorizeUrl: string;
    /**
     * The URL to hit to exchange the authorization code for the access token
     *
     * Do not define query strings in this URL.
     */
    protected accessTokenUrl: string;
    /**
     * The URL to hit to get the user details
     *
     * Do not define query strings in this URL.
     */
    protected userInfoUrl: string;
    /**
     * The param name for the authorization code. Read the documentation of your oauth
     * provider and update the param name to match the query string field name in
     * which the oauth provider sends the authorization_code post redirect.
     */
    protected codeParamName: string;
    /**
     * The param name for the error. Read the documentation of your oauth provider and update
     * the param name to match the query string field name in which the oauth provider sends
     * the error post redirect
     */
    protected errorParamName: string;
    /**
     * Cookie name for storing the CSRF token. Make sure it is always unique. So a better
     * approach is to prefix the oauth provider name to `oauth_state` value. For example:
     * For example: "facebook_oauth_state"
     */
    protected stateCookieName: string;
    /**
     * Parameter name to be used for sending and receiving the state from.
     * Read the documentation of your oauth provider and update the param
     * name to match the query string used by the provider for exchanging
     * the state.
     */
    protected stateParamName: string;
    /**
     * Parameter name for sending the scopes to the oauth provider.
     */
    protected scopeParamName: string;
    /**
     * The separator indentifier for defining multiple scopes
     */
    protected scopesSeparator: string;
    constructor(ctx: HttpContextContract, config: SeznamDriverConfig);
    /**
     * Optionally configure the authorization redirect request. The actual request
     * is made by the base implementation of "Oauth2" driver and this is a
     * hook to pre-configure the request.
     */
    protected configureRedirectRequest(request: RedirectRequest<SeznamDriverScopes>): void;
    /**
     * Optionally configure the access token request. The actual request is made by
     * the base implementation of "Oauth2" driver and this is a hook to pre-configure
     * the request
     */
    /**
     * Update the implementation to tell if the error received during redirect
     * means "ACCESS DENIED".
     */
    accessDenied(): boolean;
    /**
     * Returns the HTTP request with the authorization header set
     */
    protected getAuthenticatedRequest(url: string, token: string): ApiRequest;
    /**
     * Get the user details by query the provider API. This method must return
     * the access token and the user details both. Checkout the google
     * implementation for same.
     *
     * https://github.com/adonisjs/ally/blob/develop/src/Drivers/Google/index.ts#L191-L199
     */
    user(callback?: (request: ApiRequest) => void): Promise<AllyUserContract<SeznamDriverAccessToken>>;
    userFromToken(accessToken: string, callback?: (request: ApiRequest) => void): Promise<AllyUserContract<{
        token: string;
        type: 'bearer';
    }>>;
}
