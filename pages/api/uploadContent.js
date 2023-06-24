
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp';

const SCALE_FACTOR = 0.80;
const MAX_FILE_SIZE = 20000000; // 20MB


export default async function handler(req, res) {
  const { content, mint } = req.body;

  try {
    const result = await cloudinary.uploader
      .upload(content, {
        resource_type: "auto",
        public_id: `${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER}/${ mint }`,
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
            public_id: `${ process.env.NEXT_PUBLIC_CLOUDINARY_NFT_FOLDER}/${ mint }`,
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

  let reduceBy;
  let iterations = 0
  while (imageSize > MAX_FILE_SIZE && iterations < 5) {

    // Scale down the image
    try {
      const image = sharp(scaledBuffer);
      const metadata = await image.metadata();
  
  
      if (!reduceBy) reduceBy = Math.round(metadata.width * (1 - SCALE_FACTOR));
  
      console.log("🚀 ~ file: uploadContent.js:73 ~ scaleImage ~ imageSize:", imageSize)
      console.log("🚀 ~ file: uploadContent.js:80 ~ scaleImage ~ reduceBy:", reduceBy)
  
      const width = metadata.width - reduceBy;
      scaledBuffer = await image.resize(width).toBuffer();
      // Check the new file size
      imageSize = Buffer.byteLength(scaledBuffer);
    } catch (e) {
      console.log("Error scaling image", e);
    }

    iterations++;
  }

  return scaledBuffer;
}