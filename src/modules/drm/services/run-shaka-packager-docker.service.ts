import { spawn } from "node:child_process";
import path from "node:path";

function toDockerPath(filePath: string) {
  return filePath.split(path.sep).join("/");
}

function buildDockerVolumePath(hostPath: string) {
  return toDockerPath(path.resolve(hostPath));
}

const TEST_KEY_ID = "0123456789abcdeffedcba9876543210";
const TEST_KEY = "00112233445566778899aabbccddeeff";

function buildRawKeyArgs() {
  return [
    "--enable_raw_key_encryption",
    "--keys",
    `label=:key_id=${TEST_KEY_ID}:key=${TEST_KEY}`,
  ];
}

export async function runShakaPackagerWithDocker({
  inputFilePath,
  inputBuffer,
  inputFilename,
  outputDir,
}: {
  inputFilePath?: string;
  inputBuffer?: Buffer;
  inputFilename?: string;
  outputDir: string;
}) {
  // Ensure outputDir is absolute
  const outputHostPath = path.resolve(outputDir);
  const outputMount = buildDockerVolumePath(outputHostPath);

  let args: string[];
  let needsStdin = false;

  if (inputBuffer && inputFilename) {
    // stream buffer into container at /workspace/{inputFilename}
    const containerInputPath = `/workspace/${inputFilename}`;

    const manifestPath = "'/workspace/manifest.mpd'";
    const inputArg = `'input=${containerInputPath},stream=video,init_segment=/workspace/video/init.mp4,segment_template=/workspace/video/$Number$.m4s'`;
    const audioArg = `'input=${containerInputPath},stream=audio,init_segment=/workspace/audio/init.mp4,segment_template=/workspace/audio/$Number$.m4s'`;
    const drmArgs = buildRawKeyArgs().join(" ");

    args = [
      "run",
      "--rm",
      "-i",
      "-v",
      `${outputMount}:/workspace`,
      "google/shaka-packager",
      "sh",
      "-c",
      `cat > ${containerInputPath} && packager ${inputArg} ${audioArg} ${drmArgs} --segment_duration 4 --fragment_duration 1 --generate_static_live_mpd --mpd_output ${manifestPath}`,
    ];

    needsStdin = true;
  } else if (inputFilePath) {
    // mount the host directory containing the input file to /workspace/inputdir
    const absInput = path.resolve(inputFilePath);
    const hostInputDir = path.dirname(absInput);
    const inputBasename = path.basename(absInput);
    const hostInputMount = buildDockerVolumePath(hostInputDir);
    const drmArgs = buildRawKeyArgs();

    args = [
      "run",
      "--rm",
      "-v",
      `${hostInputMount}:/workspace/inputdir`,
      "-v",
      `${outputMount}:/workspace`,
      "google/shaka-packager",
      "packager",
      `input=/workspace/inputdir/${inputBasename},stream=video,init_segment=/workspace/video/init.mp4,segment_template=/workspace/video/$Number$.m4s`,
      `input=/workspace/inputdir/${inputBasename},stream=audio,init_segment=/workspace/audio/init.mp4,segment_template=/workspace/audio/$Number$.m4s`,
      ...drmArgs,
      "--segment_duration",
      "4",
      "--fragment_duration",
      "1",
      "--generate_static_live_mpd",
      "--mpd_output",
      "/workspace/manifest.mpd",
    ];
  } else {
    throw new Error("Either inputFilePath or inputBuffer+inputFilename must be provided");
  }

  return new Promise<void>((resolve, reject) => {
    try {
      console.log(`[shaka-packager] docker args: ${args.join(" ")}`);

      const stdio: ["pipe", "pipe", "pipe"] | ["ignore", "pipe", "pipe"] = needsStdin
        ? ["pipe", "pipe", "pipe"]
        : ["ignore", "pipe", "pipe"];

      const proc = spawn("docker", args, { stdio });

      let stderr = "";

      if (needsStdin && inputBuffer) {
        proc.stdin?.write(inputBuffer);
        proc.stdin?.end();
      }

      proc.stdout?.on("data", (d) => process.stdout.write(`[shaka-packager stdout] ${d.toString()}`));
      proc.stderr?.on("data", (d) => {
        const s = d.toString();
        stderr += s;
        process.stderr.write(`[shaka-packager stderr] ${s}`);
      });

      proc.on("error", (err) => {
        console.error("[shaka-packager] docker error:", err);
        reject(err);
      });

      proc.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Shaka Packager failed with code ${code}. ${stderr}`));
          return;
        }

        console.log("[shaka-packager] finished successfully");
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}
