import path from "node:path";
import { getEnvField } from "../../../config/env.config.js";

const videosRootDir = path.resolve(process.cwd(), "videos");
const inputRootDir = path.join(videosRootDir, "input");
const outputRootDir = path.join(videosRootDir, "output");

export function getVideosRootDir() {
  return videosRootDir;
}

export function getInputRootDir() {
  return inputRootDir;
}

export function getOutputRootDir() {
  return outputRootDir;
}

export function getVideoInputDir(videoId: string) {
  return path.join(inputRootDir, videoId);
}

export function getVideoOutputDir(videoId: string) {
  return path.join(outputRootDir, videoId);
}

export function getManifestR2Key(videoId: string) {
  return `drm/${videoId}/manifest.mpd`;
}

export function getManifestPublicUrl(videoId: string) {
  return `${getEnvField.R2_PUBLIC_URL}/${getManifestR2Key(videoId)}`;
}
