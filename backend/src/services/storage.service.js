//The services whose behaviour or source can change over time there code goes into service.js file

import ImageKit from 'imagekit';

// Lazy initialization - only create ImageKit instance when needed
let imagekit = null;

function getImageKit() {
  if (!imagekit) {
    // Check if required env vars exist
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
      throw new Error('ImageKit environment variables are not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in your .env file');
    }
    
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
  }
  return imagekit;
}

async function uploadFile(file, fileName) {
  const imagekitInstance = getImageKit();
  const result = await imagekitInstance.upload({
    file: file,       // required
    fileName: fileName // required
  });

  return result; // Returns the URL of the uploaded file
}

export default {
  uploadFile
};

