import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { uploadDashOutputToR2 } from "../services/upload-dash-output-to-r2.service.js";
import { r2 } from "../../../config/r2.config.js";
import { getEnvField } from "../../../config/env.config.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getVideoOutputDir } from "../utils/drm-paths.util.js";
import type { VideoProcessingJob } from "../types/video-processing-job.type.js";
import { runShakaPackagerWithDocker } from "../services/run-shaka-packager-docker.service.js";

export class ProcessVideoToDashUseCase {
  async handle(data: VideoProcessingJob): Promise<void> {
    const sourceRef = data.r2Key ?? data.inputFilePath ?? "<unknown>";
    console.log(`[drm] processing videoId=${data.videoId} input=${sourceRef}`);

    // Use a temporary directory for processing (no persistent videos/ folder)
    const tmpBase = await fs.mkdtemp(path.join(os.tmpdir(), `shaka-${data.videoId}-`));
    const outputDir = path.join(tmpBase, "output");

    await fs.mkdir(path.join(outputDir, "audio"), { recursive: true });
    await fs.mkdir(path.join(outputDir, "video"), { recursive: true });
    try {
      console.log(`[drm] running shaka packager for videoId=${data.videoId}`);

      if (data.r2Key) {
        console.log(`[drm] fetching source from R2 key=${data.r2Key}`);
        const getCmd = new GetObjectCommand({ Bucket: getEnvField.R2_BUCKET_NAME, Key: data.r2Key });
        const res = await r2.send(getCmd);

        const stream = res.Body as unknown as NodeJS.ReadableStream;
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        const buffer = Buffer.concat(chunks);

        await runShakaPackagerWithDocker({
          inputBuffer: buffer,
          inputFilename: path.basename(data.r2Key),
          outputDir,
        });
      } else if (data.inputFilePath) {
        await runShakaPackagerWithDocker({
          inputFilePath: data.inputFilePath,
          outputDir,
        });
      } else {
        throw new Error("No input source provided for processing");
      }

      console.log(`[drm] shaka packager finished for videoId=${data.videoId}`);

      console.log(`[drm] uploading DASH output to R2 for videoId=${data.videoId}`);
      const uploadResult = await uploadDashOutputToR2({
        videoId: data.videoId,
        outputDir,
      });
      console.log(`[drm] upload completed for videoId=${data.videoId}, files=${uploadResult.uploadedFilesCount}`);
    } catch (err) {
      console.error(`[drm] processing failed for videoId=${data.videoId}:`, err);
      throw err;
    } finally {
      // cleanup temporary processing directory
      try {
        await fs.rm(tmpBase, { force: true, recursive: true });
      } catch (err) {
        // ignore
      }

      console.log(`[drm] cleanup done for videoId=${data.videoId}`);
    }
  }
}
