import crypto from "node:crypto";
import path from "node:path";
import { getEnvField } from "../../config/env.config.js";
import { uploadToR2 } from "../../config/r2.config.js";

export class UploadService {

    async uploadFile(file: Express.Multer.File, folder = ""): Promise<{ url: string }> {
        if (!file || !file.buffer) {
            throw new Error("Arquivo inválido. O buffer do arquivo não foi encontrado.");
        }

        const fileHash = crypto.randomBytes(16).toString("hex");
        const extension = path.extname(file.originalname);
        const fileName = `${fileHash}${extension}`;

        const key = folder ? `${folder.replace(/\/$/, "")}/${fileName}` : fileName;

        await uploadToR2({
            key,
            body: file.buffer,
            contentType: file.mimetype,
        });

        const url = `https://${getEnvField.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

        console.log(url);

        return {
            url: url
        };
    }
}

export const uploadService = new UploadService();
