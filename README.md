# social-frame
A wrapper for social network API's to make it easier to post to multiple platforms.  The goal is to provide a single, unified syntax to post across various social networks.  

## Usage
Facebook, Linkedin, Twitter, and all the rest handle social media content differently, and, as someone who has tried, it is a massive pain in the dick to automate posting to each social platform without using an app like Buffer or Hootsuite.  

social-frame aims to provide a single syntax to post to any of the platforms. To create a post, use this format:

```ts
let post : Post = {
    content: "This is the text content of your post",
    mediaUrl: "https://url-of-image-or-video-to-post/",
    type: PostType.Image | PostType.Text | PostType.Link,
    linkUrl: "https://link-post-leads-to"
}
```

You can then create a connection to the social networks of your choice:
```ts
    const facebookConnection = new FacebookConnection("accessToke", "pageId", "pageName");
    const linkedInConnection = new LinkedinConnection("accessToke", "pageId", "pageName");
```

To add your post to the social platforms, use the `createPost` method on either connection.  
```ts
    facebookConnection.createPost(post);
    linkedInConnection.createPost(post);
```

And thats it!  SocialTable handles the rest.

## Installation
Eventually, I will publish this as a package, but while I'm testing this in my own packages, it is probably best to clone this as a submodule and import. 

Navigate to your existing repo and clone social-frame:
```bash
cd /path/to/repo
git submodule add https://github.com/scottthesecond/social-frame.git
git submodule init
git submodule update
```

Then, import the post controllers and types you will need to make your post.  For example, to post on Facebook and Linkedin:
```ts
import { Post, FacebookConnection, LinkedInConnection } from '@/../path/to/repo/root/social-frame/src'
```