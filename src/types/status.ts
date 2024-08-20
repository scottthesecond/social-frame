export interface PostStatus {
    status: PostStatusOption;
    postUrl?: string;
    error?: any;
    // Additional fields
  }

export enum PostStatusOption {
    Successful = 'Successful',
    Failed = 'Failed'
}

