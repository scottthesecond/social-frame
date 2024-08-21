const axios = require('axios');




import { oauthCredential, PageConnection, Platforms, Token } from "../types";
import { AuthController } from "./authController";

export class LinkedInAuthController implements AuthController{

    buildLoginUrl(): string {
        throw new Error("Method not implemented.");
        //TODO: build login url

    }
    getAccessToken(code: string): Promise<Token> {
        throw new Error("Method not implemented.");
        //TODO: Get auth token

    }
    fetchPages(token: Token): Promise<PageConnection[]> {
        throw new Error("Method not implemented.");
        //TODO: fetch pages

    }

}