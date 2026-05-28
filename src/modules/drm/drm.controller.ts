import { promises as fs } from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { genericResponse, genericResponseControllerUtil } from "../../utils/api-response.js";
import { UploadVideoToShakaPackagerUseCase } from "./use-case/upload-video-to-shaka-packager.usecase.js";
import { getManifestPublicUrl, getVideoOutputDir } from "./utils/drm-paths.util.js";

export const getServiceUseCase = () => {
    return {
        uploadVideo: new UploadVideoToShakaPackagerUseCase(),
    };
};

export const uploadVideo = async (req: Request, res: Response) => {
    const service = getServiceUseCase().uploadVideo;

    const result = await service.handle({
        file: req.file as Express.Multer.File,
        videoId: req.body.videoId,
    });

    return genericResponseControllerUtil(result, res);
};

export const getManifestUrl = async (req: Request, res: Response) => {
    const { videoId } = req.params as { videoId: string };

    const manifestPath = path.join(getVideoOutputDir(videoId), "manifest.mpd");
    const localReady = await fs
        .access(manifestPath)
        .then(() => true)
        .catch(() => false);

    const result = genericResponse(
        {
            videoId,
            manifestUrl: getManifestPublicUrl(videoId),
            localReady,
            status: localReady ? "ready" : "processing",
        },
        "URL do manifesto DASH.",
        200,
        []
    );

    return genericResponseControllerUtil(result, res);
};