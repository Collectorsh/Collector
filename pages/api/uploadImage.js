import { v2 as cloudinary } from 'cloudinary'

export default async function handler(req, res) {
  const { imageBuffer , cldId } = req.body;
  if (!imageBuffer || !cldId) return res.status(500).json({ error: "Missing required parameters" });
  console.log("🚀 ~ file: uploadImage.js:5 ~ handler ~ imageBuffer:", imageBuffer)
  const buffer = Buffer.from(imageBuffer, 'base64');
  if (!Buffer.isBuffer(buffer)) return res.status(500).json({ error: "Invalid image buffer" });
  try {
    cloudinary.uploader
      .upload_stream({
        resource_type: "auto",
        public_id: cldId,
        overwrite: true,
      }, (error, result) => {
        if (error) {
          console.log("CDN Error", error.message);
          res.status(400).json({ error: error.message });
        } else {
          res.status(200).json({ public_id: result.public_id });
        }
      }).end(buffer);
    
  } catch (error) {
    console.log("Error uploading image", error.message);
    res.status(400).json({ error: error.message })
  }
}