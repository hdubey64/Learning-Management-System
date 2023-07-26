import Path from "path";

import multer from "multer";

const upload = multer({
   dest: "uploads/",
   limit: { fileSize: 50 * 1024 * 1024 * 1024 },
   storage: multer.diskStorage({
      destination: "uploads/",
      filename: (req, file, cb) => {
         cb(null, file.originalname);
      },
   }),

   fileFiltter: (req, file, cb) => {
      let ext = path.extname(file.originalname);

      if (
         ext !== ".jpg" &&
         ext !== ".jpeg" &&
         ext !== ".webp" &&
         ext !== ".png" &&
         ext !== ".mp4"
      ) {
         cb(new Error(`Unsupported file type! ${ext}`, false));
      }

      cb(null, true);
   },
});

export default upload;
