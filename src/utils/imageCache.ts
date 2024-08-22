const fs = require('fs');
const path = require('path');
const axios = require('axios');

const makePath = (originalImageUrl: string, filename: string | null = null) => {
    var ext;

    // If we passed in a filename, get the extension from that (since airtable URLs don't have the extension)
    if (filename != null){
        ext = "." + filename.split('.').pop();
    } else {
        ext = path.extname(new URL(originalImageUrl).pathname);
    }

    const imageName = `image${Date.now()}${ext}`;
    const imagePath = path.resolve(__dirname, '../cache', imageName);
    return imagePath;
};

export const downloadImage = async (url: string, filename: string | null = null) : Promise<string>=> {
    console.log("Downloading an image to the cache", url, filename);

    const filePath = makePath(url, filename);
    const dir = path.dirname(filePath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const writer = fs.createWriteStream(filePath);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
    });
};