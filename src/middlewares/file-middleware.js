import multer from 'multer';

const upload = () => {
  const storage = multer.memoryStorage();
  return multer({ storage });
};

const fileMiddleware = { upload };
export default fileMiddleware;
