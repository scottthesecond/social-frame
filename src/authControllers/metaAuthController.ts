import { oauthCredential } from "../types";
const querystring = require('querystring');

const axios = require('axios');

export const buildRedirectUrl = (metaOauthCredential: oauthCredential) : string => {

    const authUrl = 'https://www.facebook.com/v20.0/dialog/oauth';

    const queryParams = new URLSearchParams({
        client_id: metaOauthCredential.clientId,
        redirect_uri: metaOauthCredential.redirectUri,
        response_type: 'code',
        scope: metaOauthCredential.scope || 'pages_manage_posts,pages_read_engagement,pages_show_list',
      }).toString();
    
      return `${authUrl}?${queryParams}`;
    
}

export const getAccessToken = async (metaOauthCredential: oauthCredential, code: string) : Promise<any> => {
    
    const tokenUrl = 'https://graph.facebook.com/v20.0/oauth/access_token';

    const response = await axios.get(tokenUrl, { 
        client_id: metaOauthCredential.clientId,
        client_secret: metaOauthCredential.clientSecret,
        redirect_uri: metaOauthCredential.redirectUri
        });

    const { access_token, expires_in } = response.data;

    const userResponse = await axios.get('https://graph.facebook.com/v20.0/me', {
        params: {
            access_token: access_token,
        },
        });

    const user_id = userResponse.data.id;

    return {access_token, expires_in, user_id}

}

//TODO:  Fetch pages user has access to manage