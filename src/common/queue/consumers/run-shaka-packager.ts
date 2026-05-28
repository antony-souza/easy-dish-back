import { ProcessVideoToDashUseCase } from "../../../modules/drm/use-case/process-video-to-dash.usecase.js";
import type { VideoProcessingJob } from "../../../modules/drm/types/video-processing-job.type.js";

const processVideoToDashUseCase = new ProcessVideoToDashUseCase();

export function runShakaPackager() {
    return async (data: VideoProcessingJob): Promise<void> => {
        console.log(`[queue] received shaka_packager job for videoId=${data.videoId}`);
        try {
            await processVideoToDashUseCase.handle(data);
            console.log(`[queue] job completed for videoId=${data.videoId}`);
        } catch (err) {
            console.error(`[queue] job failed for videoId=${data.videoId}:`, err);
            throw err;
        }
    };
}