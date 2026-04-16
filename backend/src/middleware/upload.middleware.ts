import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const BASE_UPLOAD_DIR = 'uploads';
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isImage =
      allowedTypes.test(file.mimetype) ||
      allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isImage) {
      return cb(null, true);
    }

    cb(new Error('Only images are allowed'));
  },
});

export const processAndSaveImage = async (
  file: Express.Multer.File,
  type: 'avatar' | 'banner',
): Promise<string> => {
  const subDir = type === 'avatar' ? 'profile_images' : 'profile_banners';
  const fullPath = path.join(BASE_UPLOAD_DIR, subDir);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const fileName = `${uuidv4()}.webp`;
  const filePath = path.join(fullPath, fileName);
  const pipeline = sharp(file.buffer).webp({ quality: 80 });

  if (type === 'avatar') {
    pipeline.resize(400, 400, { fit: 'cover' });
  } else {
    pipeline.resize(1500, 500, { fit: 'cover' });
  }

  await pipeline.toFile(filePath);
  return `/${subDir}/${fileName}`;
};
