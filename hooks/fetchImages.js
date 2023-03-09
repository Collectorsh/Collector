import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_SPACES_ENDPOINT,
  forcePathStyle: false,
  region: process.env.NEXT_PUBLIC_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_SPACES_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_SPACES_SECRET,
  },
});

export async function fetchImages(name) {
  const bucketParams = {
    Bucket: process.env.NEXT_PUBLIC_SPACES_BUCKET,
    Prefix: `drops/${name}`,
  };
  const data = await s3Client.send(new ListObjectsCommand(bucketParams));
  return data.Contents;
}
