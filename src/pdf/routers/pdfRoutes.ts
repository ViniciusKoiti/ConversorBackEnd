import express from 'express'
import multer from 'multer';
import { convertPdfToDocx,convertBase64ToDocx } from '../controllers/pdfController';

const pdfRouter = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

pdfRouter.post('/convert-pdf-docx',upload.single('file') ,convertPdfToDocx);
pdfRouter.post('convert-base64-docx',convertBase64ToDocx);

export default pdfRouter;