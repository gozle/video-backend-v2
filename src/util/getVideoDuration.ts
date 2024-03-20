import { spawn } from 'child_process';

export async function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const ffprobeProcess = spawn('ffprobe', [
      '-v',
      'error',
      '-show_format',
      '-show_entries',
      'format=duration',
      filePath,
    ]);

    let duration = '';

    ffprobeProcess.stdout.on('data', (data) => {
      let lines = data.toString().trim().split('\n');
      const durationLine = lines.find((line) => line.startsWith('duration='));

      if (durationLine) {
        duration = durationLine.split('=')[1];
      }
    });

    ffprobeProcess.stderr.on('data', (data) => {
      reject(new Error(`Error getting video duration: ${data}`));
    });

    ffprobeProcess.on('close', (code) => {
      if (code === 0) {
        const parsedDuration = parseInt(duration);
        if (!isNaN(parsedDuration)) {
          resolve(parsedDuration);
        } else {
          reject(new Error('Failed to parse video duration'));
        }
      } else {
        reject(new Error(`ffprobe exited with code: ${code}`));
      }
    });
  });
}
