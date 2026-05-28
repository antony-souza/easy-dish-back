import { Router } from "express";
import * as drmController from "./drm.controller.js";
import { multerUpload } from "../../config/multer.config.js";

export const drmRoutes = Router();

drmRoutes.post("/upload",
	multerUpload.single("video"),
	drmController.uploadVideo
);

drmRoutes.get("/:videoId/manifest", drmController.getManifestUrl);

