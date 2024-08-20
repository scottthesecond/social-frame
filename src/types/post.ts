export interface Post {
    content: string;
    mediaUrl?: string;
    type: PostType;
    linkUrl?: string;
    // Additional fields
  }

export enum PostType {
    Image = 'Image',
    Text = 'Text',
    Link = 'Link'
}

