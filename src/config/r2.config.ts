import { S3Client, PutObjectCommand, type PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getEnvField } from "./env.config.js";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${getEnvField.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${getEnvField.R2_BUCKET_NAME}`,
  credentials: {
    accessKeyId: getEnvField.R2_ACCESS_KEY_ID,
    secretAccessKey: getEnvField.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2({
  key,
  body,
  contentType,
}: {
  key: string;
  body: NonNullable<PutObjectCommandInput["Body"]>;
  contentType?: string;
}) {
  const command = new PutObjectCommand({
    Bucket: getEnvField.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ...(contentType && { ContentType: contentType }),
  });

  await r2.send(command);
}

export { r2 };
