import * as fs from 'fs';

export const deleteFile = (file: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(file)) {
      fs.unlink(file, (err) => {
        if (err) {
          return reject(err);
        }
      });
    }

    resolve();
  });
};
