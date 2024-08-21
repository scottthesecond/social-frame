import axios from 'axios';
import { Post, PostType, PostStatus, Platforms} from '../types';
import { PageConnection } from './pageConnection';

export class FacebookConnection implements PageConnection{

    public accessToken: string;
    public pageId: string;
    public platform: Platforms = Platforms.Facebook;
    public name: string;

    constructor(accessToken: string, pageId: string, name: string){
        this.accessToken = accessToken;
        this.pageId = pageId;
        this.name = name;
    }

    public async createPost(post: Post): Promise<PostStatus> {
        let status: PostStatus;

        try{
    
            let response;
            if (post.type == PostType.Text){
                response = await axios.post(`https://graph.facebook.com/v20.0/me/feed`, {
                    message: post.content,
                    access_token: this.accessToken,
                    });
            } else if (post.type == PostType.Link){
                response = await axios.post(`https://graph.facebook.com/v20.0/me/feed`, {
                    message: post.content,
                    link: post.linkUrl,
                    access_token: this.accessToken,
                  });
            } else if (post.type == PostType.Image){
                response = await axios.post(`https://graph.facebook.com/v20.0/me/photos`, {
                    url: post.mediaUrl,
                    caption: post.content,
                    access_token: this.accessToken,
                  });
            
            }
    
            if (response && response.data) {
                console.log('Facebook API response:', response.data);
    
                status = {
                    success: true,
                    postUrl: `https://www.facebook.com/${response.data.id || response.data.post_id}`
                }
    
              } else {
                status = {
                    success: false,
                    error: "FaceBook API response is undefined or missing data."
                }
              }
    
        } catch (err: any) {
    
            if (axios.isAxiosError(err) && err.response) {
                status = {
                    success: false,
                    error: err.response.data
                }
            } else {
                status = {
                    success: false,
                    error: err.message
                }
            }
    
        }
    
        return status;
    
    }

}