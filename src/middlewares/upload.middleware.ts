import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import path from "path";
import fs from "fs";

// Cloudinary storage engine
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: "klyro_uploads",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "mp4", "webm", "mov"],
    };
  },
});

// Fallback disk storage for local dev if Cloudinary keys are not provided
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const isCloudinaryConfigured =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET);

const selectedStorage = isCloudinaryConfigured ? cloudinaryStorage : localStorage;

export const upload = multer({
  storage: selectedStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Only image and video files are supported"));
    }
  },
});
