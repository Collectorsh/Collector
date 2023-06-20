
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp';

const SCALE_FACTOR = 0.9;
const MAX_FILE_SIZE = 20000000; // 20MB


export default async function handler(req, res) {
  const { content, mint } = req.body;

  try {
    const result = await cloudinary.uploader
      .upload(content, {
        resource_type: "auto",
        public_id: `nft-demo/${ mint }`,
        overwrite: true,
      })
    
    res.status(200).json(result);

  } catch (error) {

    //TODO account for video file types (will need to come up with alternate scale down method)
    if (error.message.includes("File size too large")) { 
      try {

        const buffer = await downloadImage(content);
        const scaledBuffer = await scaleImage(buffer);

        cloudinary.uploader
          .upload_stream({
            resource_type: "auto",
            public_id: `nft-demo/${ mint }`,
            overwrite: true,
          }, (error, result) => {
            if (error) {

              console.log("Error uploading image", error);
              res.status(500).json({ error: 'Error uploading scaled image' });

            } else {

              res.status(200).json(result);
            }
          }).end(scaledBuffer);
        
      } catch (error) {

        console.log("Error scaling down image", error);
        res.status(500).json({ error: 'Error scaling down image to meet upload requirements' });
      }
    } else {
      
      console.log("Error uploading image", error);
      res.status(500).json({ error: 'Error uploading image' });
    }
  }
}


async function downloadImage(imageUrl) {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
}

async function scaleImage(buffer) {
  let scaledBuffer = buffer;
  let imageSize = Buffer.byteLength(scaledBuffer);

  while (imageSize > MAX_FILE_SIZE) {
    // Scale down the image
    const image = sharp(scaledBuffer);
    const metadata = await image.metadata();
    const width = Math.round(metadata.width * SCALE_FACTOR);
    scaledBuffer = await image.resize(width).toBuffer();

    // Check the new file size
    imageSize = Buffer.byteLength(scaledBuffer);
  }

  return scaledBuffer;
}