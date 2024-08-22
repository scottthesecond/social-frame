import axios from "axios";
import { Platforms, Post, PostStatus, PostType } from "../types";
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
    async createPost(post: Post): Promise<PostStatus> {

        let postUrl = "";

        try {
            if (post.type == PostType.Text && post.mediaUrl == null) {
              throw new Error('Instagram does not support text-only posts');
            } else if (post.type == PostType.Link && post.mediaUrl == null) {
              throw new Error('Instagram does not support link-only posts');
            } else if (post.type == PostType.Image || post.mediaUrl != null) {
              const mediaResponse = await axios.post(`https://graph.facebook.com/v20.0/${this.pageId}/media`, {
                image_url: post.mediaUrl,
                caption: post.content,
                access_token: this.accessToken,
              });
        
              //console.log(`Image Uploaded: ID: ${mediaResponse.data.id}`, mediaResponse.data)
        
              const publishResponse = await axios.post(`https://graph.facebook.com/v20.0/${this.pageId}/media_publish`, {
                creation_id: mediaResponse.data.id,
                access_token: this.accessToken,
              });
        
              postUrl = `https://www.instagram.com/p/${publishResponse.data.id}`;
                  
            }
            return {
                postUrl: postUrl,
                success: true
            };
          } catch (err: any) {
            if (err.response) {
                return {
                    error: err.response.data,
                    success: false
                };
            } else {
                return {
                    error: err.message,
                    success: false
                };
            }
          }
    }

}
