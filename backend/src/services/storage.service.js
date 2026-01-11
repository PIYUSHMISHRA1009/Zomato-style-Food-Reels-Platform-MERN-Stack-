//The services whose behaviour or source can change over time there code goes into service.js file

const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file, fileName) {
  const result = await imagekit.upload({
    file: file,       // required
    fileName: fileName // required
  });

  return result; // Returns the URL of the uploaded file
}

module.exports = {
  uploadFile
};

