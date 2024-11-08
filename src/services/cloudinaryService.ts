import fs from 'fs';
import path from 'path';
import fileType from 'file-type';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import FileCloud, { FileCoudModel } from '../models/fileModel';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

export async function uploadPhoto({ filePath, folderName, publicName }: { filePath: string, folderName: string | undefined, publicName?: string }): Promise<FileCoudModel> {
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  const fileTypeMime = await fileType.fromFile(filePath);
  const fileName = path.basename(filePath);
  const fileNameWithoutExt = publicName ?? path.basename(filePath, path.extname(filePath));
  const cloudPath = `movie_library/${folderName}/${fileName}`;

  const uploadResult = await cloudinary.uploader
    .upload(
      filePath, {
      public_id: fileNameWithoutExt,
      folder: `movie_library/${folderName}`
    });

  const uploadResponse = uploadResult as UploadApiResponse;

  const newFile = new FileCloud({
    size: fileSize,
    mimeType: fileTypeMime?.mime,
    path: filePath,
    url: uploadResponse.url,
    cloudPath: cloudPath
  });

  const res = await newFile.save();
  return res;
}