import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'),
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET || '');

export async function uploadFile(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const fileStream = file.stream();

  const cloudFile = bucket.file(fileName);
  const writeStream = cloudFile.createWriteStream({
    metadata: {
      contentType: file.type,
    },
  });

  await new Promise((resolve, reject) => {
    fileStream.pipe(writeStream)
      .on('error', reject)
      .on('finish', resolve);
  });

  await cloudFile.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}