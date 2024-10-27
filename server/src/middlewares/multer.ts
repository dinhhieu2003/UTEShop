import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products', 
        resource_type: 'image',
        format: async (req: any, file: any) => 'jpg',
        public_id: (req: any, file: any) => `${Date.now()}-${file.originalname}`,
    } as any,
});

const upload = multer({ storage });

export default upload;
