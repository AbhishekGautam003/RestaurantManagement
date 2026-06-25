import ImageKit from "imagekit";

const imagekit = new ImageKit({
    
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: (process.env.IMAGEKIT_PRIVATE_KEY),
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export async function uploadFile(buffer, fileName = "image.jpg") {

    const result = await imagekit.upload({
        file: buffer.toString("base64"),
        fileName
    });
      
    return result;
}

export default uploadFile;
