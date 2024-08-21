import { oauthCredential, PageConnection, Token } from "../types";

export interface AuthController {
    buildLoginUrl(): string;
    getAccessToken(code: string) : Promise<Token>;
    fetchPages(token: Token) : Promise<PageConnection[]>
}
