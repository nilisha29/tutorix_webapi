// import multer from "multer";
// import uuid from "uuid";
// import path from "path";
// import fs from "fs";

// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Ensure the uploads directory exists
// // __dirname is the directory of the current module
// const uploadDir = path.join(__dirname, '../../uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// } 

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = uuid.v4();
//         const extension = path.extname(file.originalname);
//         cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
//     }
// });
// const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     // Accept images only
//     if (!file.mimetype.startsWith('image/')) {
//         return cb(new Error('Only image files are allowed!'));
//     }
//     cb(null, true);
// };
// const upload = multer({ 
//     storage: storage, 
//     fileFilter: fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
// });

// export const uploads = {
//     single: (fieldName: string) => upload.single(fieldName),
//     array: (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount),
//     fields: (fieldsArray: { name: string; maxCount?: number }[]) => upload.fields(fieldsArray)
// };


import multer from "multer";
import uuid from "uuid";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists - using process.cwd()
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Uploads directory created at: ${uploadDir}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(`📁 Saving file to: ${uploadDir}`);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuid.v4();
        const extension = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
        console.log(`📝 File: ${filename}`);
        cb(null, filename);
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    console.log(`🖼️  File received: ${file.originalname} (${file.mimetype})`);
    if (!file.mimetype.startsWith('image/')) {
        console.error('❌ Non-image file rejected');
        return cb(new Error('Only image files are allowed!'));
    }
    console.log(`✅ File accepted`);
    cb(null, true);
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

export const uploads = {
    single: (fieldName: string) => upload.single(fieldName),
    array: (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount),
    fields: (fieldsArray: { name: string; maxCount?: number }[]) => upload.fields(fieldsArray)
};