import express from 'express'
import multer from 'multer';
import { convertPdfToDocx } from './pdfController';

const pdfRouter = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

pdfRouter.post('/convert-pdf-docx',upload.single('file') ,convertPdfToDocx);
export default pdfRouter;