import { promises as fs } from "node:fs";
import path from "node:path";
import { uploadToR2 } from "../../../config/r2.config.js";

async function listFilesRecursively(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return listFilesRecursively(fullPath);
      }

      return [fullPath];
    })
  );

  return files.flat();
}

function getContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".mpd") return "application/dash+xml";
  if (ext === ".m4s") return "video/iso.segment";
  if (ext === ".mp4") return "video/mp4";
  return "application/octet-stream";
}

export async function uploadDashOutputToR2({
  videoId,
  outputDir,
}: {
  videoId: string;
  outputDir: string;
}) {
  const files = await listFilesRecursively(outputDir);

  await Promise.all(
    files.map(async (filePath) => {
      const relativePath = path.relative(outputDir, filePath).split(path.sep).join("/");
      const key = `drm/${videoId}/${relativePath}`;
      const body = await fs.readFile(filePath);

      await uploadToR2({
        key,
        body,
        contentType: getContentType(filePath),
      });
    })
  );

  return {
    uploadedFilesCount: files.length,
  };
}
