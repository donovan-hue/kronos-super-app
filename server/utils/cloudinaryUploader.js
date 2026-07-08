const { cloudinary } = require('../middleware/upload');
const streamifier = require('streamifier');

const handleUpload = (buffer, resourceType, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: resourceType, folder: folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = { handleUpload };
