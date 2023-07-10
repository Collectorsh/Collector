import axios from 'axios';

export default async function handler(req, res) {
  const { urls } = req.body;

  try {
    const results = await Promise.all(urls.map(async (url) => {
      try {
        const response = await axios.get(url,
          { responseType: 'arraybuffer' }
        );
        const fileType = response.headers['content-type'];
  
        if (fileType) {
          if (fileType.startsWith('image/')) {
            return { url, fileType: 'image' };
          } else if (fileType.startsWith('video/')) {
            return { url, fileType: 'video' };
          } else {
            return { url, fileType: 'other' };
          }
        } else {
          return { url, fileType: 'unknown' };
        }
      } catch (error) { 
        console.log('Error checking file type', error);
        return { url, fileType: 'unknown', error };
      }
    }));

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error checking file types' });
  }
}
