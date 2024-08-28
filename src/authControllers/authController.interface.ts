import { Token } from "../types";
import { PageConnection } from "../postControllers";

export interface AuthController {
    buildLoginUrl(): string;
    getAccessToken(code: string) : Promise<Token>;
    fetchPages(token: Token) : Promise<PageConnection[]>
}
