import multer from "multer";

export const multerStorageDefault = multer.memoryStorage();
export const multerUpload = multer({ storage: multerStorageDefault });