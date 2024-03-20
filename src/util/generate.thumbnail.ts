// import * as sharp from 'sharp';
// import * as fs from 'fs/promises'; // For file system operations

// export async function generateThumbnail(videoPath: string) {
//   try {
//     const videoBuffer = await fs.readFile(videoPath); // Read video file as buffer
//     const metadata = await sharp(videoBuffer).metadata();
//     const { width, height } = metadata;

//     // Extract first frame (adjust logic for specific needs)
//     const firstFrame = await sharp(videoBuffer)
//       .seek(0) // Seek to the beginning
//       .extract({ width, height, format: 'jpeg' })
//       .toBuffer();

//     // Resize the frame to desired thumbnail dimensions
//     const resizedFrame = await sharp(firstFrame)
//       .resize({ width: 200, height: 120 }) // Adjust width & height for your needs
//       .toBuffer();

//     // Save the resized image as the thumbnail
//     return sharp(resizedFrame).toFile('uploads/thumbnails');
//   } catch (error) {
//     console.error('Error generating thumbnail:', error);
//     throw error; // Or handle the error differently
//   }
// }
