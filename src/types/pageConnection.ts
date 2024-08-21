import { Platforms } from "./platforms"

export class PageConnection {
    public accessToken: string;
    public pageId: string;
    public platform: Platforms;
    public name: string;
    // Additional fields

    constructor(accessToken: string, pageId: string, platform: Platforms, name: string) {

      this.accessToken = accessToken;
      this.pageId = pageId;
      this.platform = platform;
      this.name = name;

    }

  }

