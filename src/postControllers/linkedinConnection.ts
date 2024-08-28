import axios from "axios";
import { Platforms, Post, PostStatus, PostType } from "../types";
import { PageConnection } from "./pageConnection";
import { getOgData } from "../utils";
import { downloadImage } from "../utils";

const fs = require('fs');

export class LinkedInConnection implements PageConnection{

    public platform: Platforms = Platforms.LinkedIn;

    public accessToken: string;
    public pageId: string;
    public name?: string;

    constructor(accessToken: string, pageId: string, name?: string){
        this.accessToken = accessToken;
        this.pageId = pageId;
        this.name = name;
    }

    async createPost(post: Post): Promise<PostStatus> {

        let postUrl = '';
      
        try {
          let response;
      
          if (post.type == PostType.Link && post.linkUrl != null) {
            
           const { ogTitle, ogDescription, imagePath} = await getOgData(post.linkUrl);
      
           const imageUrn  = await this.uploadImage(this.accessToken);
      
            const payload = {
              author: `urn:li:organization:${this.pageId}`,
              lifecycleState: "PUBLISHED",
              commentary: post.content,
              visibility: "PUBLIC",
              distribution: {
                feedDistribution: "MAIN_FEED",
                targetEntities: [],
                thirdPartyDistributionChannels: []
              },
              content: {
                article: {
                  title: ogTitle,
                  description: ogDescription,
                  source: post.linkUrl,
                  thumbnail: imageUrn
                }
              },
              isReshareDisabledByAuthor: false
            };
      
            console.log('Payload:', JSON.stringify(payload, null, 2));
      
            response = await axios.post(`https://api.linkedin.com/rest/posts`, payload, {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
                'LinkedIn-Version': '202406',
                'Content-Type': 'application/json'
              }
            });
      
            console.log('LinkedIn Post Response:', response.data);
      
            const postId = response.headers['x-restli-id'];
            postUrl = `https://www.linkedin.com/feed/update/${postId}`;
      
          } else if (post.type == PostType.Image && post.mediaUrl != null) {
      
            console.log("Posting an Image", post);
                  
            const imagePath = await downloadImage(post.mediaUrl);
            
            const imageUrn = await this.uploadImage(imagePath);
      
            console.log("imageUrn:", imageUrn)
      
            const payload = {
              author: `urn:li:organization:${this.pageId}`,
              lifecycleState: "PUBLISHED",
              commentary: post.content,
              visibility: "PUBLIC",
              distribution: {
                feedDistribution: "MAIN_FEED",
                targetEntities: [],
                thirdPartyDistributionChannels: []
              },
              content: {
                media: {
                  id: imageUrn
                }
              },
              isReshareDisabledByAuthor: false
            };
      
            console.log('Payload:', JSON.stringify(payload, null, 2));
      
            response = await axios.post(`https://api.linkedin.com/rest/posts`, payload, {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
                'LinkedIn-Version': '202406',
                'Content-Type': 'application/json'
              }
            });
      
            console.log('LinkedIn Post Response:', response.data);
      
            const postId = response.headers['x-restli-id'];
            postUrl = `https://www.linkedin.com/feed/update/${postId}`;
      
          } else if (post.type == PostType.Text) {
            const payload = {
              author: `urn:li:organization:${this.pageId}`,
              lifecycleState: "PUBLISHED",
              commentary: post.content,
              visibility: "PUBLIC",
              distribution: {
                feedDistribution: "MAIN_FEED",
                targetEntities: [],
                thirdPartyDistributionChannels: []
              },
              isReshareDisabledByAuthor: false
            };
      
            console.log('Payload:', JSON.stringify(payload, null, 2));
      
            response = await axios.post(`https://api.linkedin.com/rest/posts`, payload, {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
                'LinkedIn-Version': '202406',
                'Content-Type': 'application/json'
              }
            });
      
            console.log('LinkedIn Post Response:', response.data);
      
            const postId = response.headers['x-restli-id'];
            postUrl = `https://www.linkedin.com/feed/update/${postId}`;
          }
      
          return { success: true, postUrl };


        } catch (err: any) {
            if (err.response) {   
                return { success: false, error: err.response}
            } else {
                return { success: false, error: err}
            }
        }

    }

    async uploadImage(imagePath: string) : Promise<string> {
  
        // Initilizes the upload request with Linkedin, and get the URL to post the image to.
        const uploadRequest = await axios.post(`https://api.linkedin.com/rest/images?action=initializeUpload`, {
          initializeUploadRequest: {
            "owner": `urn:li:organization:${this.pageId}` 
          }
        }, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': '202406'
            }
        });
      
        console.log('Upload Request Response:', uploadRequest.data);
      
        const imageFs = fs.readFileSync(imagePath);
      
        // Upload the image to the URL provided
        const uploadUrl = uploadRequest.data.value.uploadUrl;
        const imageUploadResponse = await axios.put(uploadUrl, imageFs, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/octet-stream',
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': '202406',
          }
        });
      
        console.log('Image Upload Response:', imageUploadResponse.status, imageUploadResponse.statusText, uploadRequest.data);
      
        const imageUrn : string = uploadRequest.data.value.image;

        return imageUrn;
      
      }
      
}
