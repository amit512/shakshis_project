import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single("file");

// Optional upload middleware - doesn't fail if no file is provided
export const optionalUpload = (req, res, next) => {
  singleUpload(req, res, (err) => {
    // Multer doesn't error when file is missing, it just sets req.file to undefined
    // Only handle actual multer errors (like file size, file type, etc.)
    if (err) {
      // If it's a multer error, return it
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          message: err.message || "File upload error",
          success: false
        });
      }
      // For other errors, pass them along
      return next(err);
    }
    // No error, continue
    next();
  });
};