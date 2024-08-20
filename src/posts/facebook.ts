import axios from 'axios';
import { Post, PostType, Connection, PostStatus, PostStatusOption} from '../types';

export const postToFacebook = async (post: Post, connection: Connection) : Promise<PostStatus> => {

    let status: PostStatus;

    try{
        let response;
        if (post.type == PostType.Text){
            response = await axios.post(`https://graph.facebook.com/v20.0/me/feed`, {
                message: post.content,
                access_token: connection.accessToken,
                });
        } else if (post.type == PostType.Link){
            response = await axios.post(`https://graph.facebook.com/v20.0/me/feed`, {
                message: post.content,
                link: post.linkUrl,
                access_token: connection.accessToken,
              });
        
        } else if (post.type == PostType.Image){
            response = await axios.post(`https://graph.facebook.com/v20.0/me/photos`, {
                url: post.mediaUrl,
                caption: post.content,
                access_token: connection.accessToken,
              });
        
        }

        if (response && response.data) {
            console.log('Facebook API response:', response.data);

            let postUrl: string;

            status = {
                status: PostStatusOption.Successful,
                postUrl: `https://www.facebook.com/${response.data.id || response.data.post_id}`
            }

          } else {
            status = {
                status:  PostStatusOption.Failed,
                error: "FaceBook API response is undefined or missing data."
            }
          }
    } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
            status = {
                status:  PostStatusOption.Failed,
                error: err.response.data
            }
        } else {
            status = {
                status:  PostStatusOption.Failed,
                error: err.message
            }
        }
    }

    return status;
      
}