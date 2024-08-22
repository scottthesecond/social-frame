import { oauthCredential, Platforms, Token } from "../types";
import { AuthController } from "./authController";
import { FacebookConnection, InstagramConnection, PageConnection } from "../postControllers";

const axios = require('axios');

export class MetaAuthController implements AuthController{

  private credential: oauthCredential;

  constructor(metaOauthCredential: oauthCredential) {
    this.credential = metaOauthCredential;
  }

  public buildLoginUrl = () : string => {

    const authUrl = 'https://www.facebook.com/v20.0/dialog/oauth';

    const queryParams = new URLSearchParams({
        client_id: this.credential.clientId,
        redirect_uri: this.credential.redirectUri,
        response_type: 'code',
        scope: this.credential.scope || 'pages_manage_posts,pages_read_engagement,pages_show_list',
      }).toString();
    
      return `${authUrl}?${queryParams}`;
  }

  public getAccessToken = async (code: string) : Promise<Token> => {
    
    const tokenUrl = 'https://graph.facebook.com/v20.0/oauth/access_token';

    const response = await axios.get(tokenUrl, { 
        client_id: this.credential.clientId,
        client_secret: this.credential.clientSecret,
        redirect_uri: this.credential.redirectUri
        });

    const { access_token, expires_in } = response.data;

    const userResponse = await axios.get('https://graph.facebook.com/v20.0/me', {
        params: {
            access_token: access_token,
        },
        });

    const user_id = userResponse.data.id;

    return {
        token: access_token,
        expiresIn: expires_in,
        userId: user_id
    }

  }

  public fetchPages = async (token: Token) : Promise<PageConnection[]> => {
    const response = await axios.get('https://graph.facebook.com/v20.0/me/accounts', {
        params: {
          access_token: token.token,
        },
      });

      const pages: PageConnection[] = response.data.data.map((p: any) => new FacebookConnection(
        p.access_token,
        p.id,
        p.name
      ));

      const instagramBusinessAccounts: PageConnection[] = [];
        
      for (const page of pages) {
        if (page.accessToken) {
          const igResponse = await axios.get(`https://graph.facebook.com/v20.0/${page.pageId}?fields=instagram_business_account`, {
            params: {
              access_token: page.accessToken,
            }
          });
          if (igResponse.data.instagram_business_account) {
            instagramBusinessAccounts.push( new InstagramConnection(page.accessToken, igResponse.data.instagram_business_account.id, page.name));
          }
        }
      }
      
      return [...pages, ...instagramBusinessAccounts];

  }}