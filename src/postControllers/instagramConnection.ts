import { Platforms, Post, PostStatus } from "../types";
import { PageConnection } from "./pageConnection";

export class InstagramConnection implements PageConnection{

    public platform: Platforms = Platforms.Instagram;

    public accessToken: string;
    public pageId: string;
    public name: string;

    constructor(accessToken: string, pageId: string, name: string){
        this.accessToken = accessToken;
        this.pageId = pageId;
        this.name = name;
    }
    createPost(post: Post): Promise<PostStatus> {
        throw new Error("Method not implemented.");
    }

}
