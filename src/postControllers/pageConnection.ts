import { Post, PostStatus } from "../types";
import { Platforms } from "../types/platforms.enum"

export interface PageConnection {
    accessToken: string;
    pageId: string;
    platform: Platforms;
    name?: string;

    createPost(post: Post): Promise<PostStatus>;

  }

