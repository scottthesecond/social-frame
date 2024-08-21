import { oauthCredential, PageConnection, Platforms, Token } from "../types";
import { AuthController } from "./authController";

const axios = require('axios');

export class LinkedInAuthController implements AuthController{

    private credential: oauthCredential;

    constructor(linkedInOauthCredential: oauthCredential) {
      this.credential = linkedInOauthCredential;
    }
  
    buildLoginUrl(): string {

        const authUrl = 'https://www.linkedin.com/oauth/v2/authorization';

        const queryParams = new URLSearchParams({
            client_id: this.credential.clientId,
            redirect_uri: this.credential.redirectUri,
            response_type: 'code',
            scope: this.credential.scope || 'r_organization_social w_organization_social w_member_social r_basicprofile rw_organization_admin',
          }).toString();
        
          return `${authUrl}?${queryParams}`;

    }

    async getAccessToken(code: string): Promise<Token> {

        const response = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: this.credential.redirectUri,
                client_id: this.credential.clientId,
                client_secret: this.credential.clientSecret,
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
             });
              
        const { access_token, expires_in } = response.data;
        
        // Fetch user profile
        const userResponse = await axios.get('https://api.linkedin.com/v2/me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const user_id = userResponse.data.id;
    
        return {
            token: access_token,
            expiresIn: expires_in,
            userId: user_id
        }

    }

    fetchPages(token: Token): Promise<PageConnection[]> {
        throw new Error("Method not implemented.");
        //TODO: fetch pages

    }

}