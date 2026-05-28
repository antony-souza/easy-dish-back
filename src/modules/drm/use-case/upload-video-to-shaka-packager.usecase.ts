import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { IUseCase } from "../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../utils/api-response.js";
import { genericResponse } from "../../../utils/api-response.js";
import { QueueService } from "../../../common/queue/queue.service.js";
import { QueueNamesUtils } from "../../../common/queue/queues-names.utils.js";
import type { VideoProcessingJob } from "../types/video-processing-job.type.js";
import {
	getManifestPublicUrl,
	getVideoInputDir,
} from "../utils/drm-paths.util.js";
import { uploadToR2 } from "../../../config/r2.config.js";

type UploadVideoInput = {
	file: Express.Multer.File;
	videoId?: string;
};

type UploadVideoResponse = {
	videoId: string;
	status: "queued";
	manifestUrl: string;
};

export class UploadVideoToShakaPackagerUseCase
	implements IUseCase<UploadVideoInput, UploadVideoResponse>
{
	async handle(data: UploadVideoInput): Promise<IApiResponse<UploadVideoResponse>> {
		console.log(`[drm] upload request received videoId=${data.videoId} originalName=${data.file?.originalname}`);

		if (!data.file?.buffer) {
			return genericResponse<UploadVideoResponse>(
				{} as UploadVideoResponse,
				"Arquivo de video invalido.",
				400,
				["Video MP4 obrigatorio no campo 'video'."]
			);
		}

		const videoId = data.videoId?.trim() || crypto.randomUUID();
		const extension = path.extname(data.file.originalname) || ".mp4";
		const sourceKey = `drm/${videoId}/source${extension}`;

		await uploadToR2({
			key: sourceKey,
			body: data.file.buffer,
			contentType: data.file.mimetype,
		});

		const payload: VideoProcessingJob = {
			videoId,
			r2Key: sourceKey,
			originalFileName: data.file.originalname,
			requestedAt: new Date().toISOString(),
		};

		await QueueService.addToQueue(QueueNamesUtils.shaka_packager, payload);
		console.log(`[drm] queued job for videoId=${videoId}`);

		return genericResponse<UploadVideoResponse>(
			{
				videoId,
				status: "queued",
				manifestUrl: getManifestPublicUrl(videoId),
			},
			"Video enviado para processamento assincrono.",
			202,
			[]
		);
	}
}