export type VideoProcessingJob = {
  videoId: string;
  inputFilePath?: string;
  r2Key?: string;
  originalFileName: string;
  requestedAt: string;
};
