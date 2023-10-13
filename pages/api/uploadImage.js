import { v2 as cloudinary } from 'cloudinary'

export default async function handler(req, res) {
  const { image_buffer , cld_id } = req.body;
  if (!image_buffer || !cld_id) return res.status(500).json({ error: "Missing required parameters" });
  const buffer = Buffer.from(image_buffer, 'base64');
  if (!Buffer.isBuffer(buffer)) return res.status(500).json({ error: "Invalid image buffer" });
  try {
    await cloudinary.uploader
      .upload_stream({
        resource_type: "auto",
        public_id: cld_id,
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