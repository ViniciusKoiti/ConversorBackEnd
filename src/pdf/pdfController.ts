import { Request, Response } from 'express';
const pdf2docx = require('pdf2docx');

export const convertPdfToDocx = async (req: Request, res: Response): Promise<void> => {
  try {
    const pdfBuffer: Buffer | null = (req && req.file) ? req.file.buffer : null;
    const docxBuffer: Buffer = await pdf2docx(pdfBuffer);
    console.log(pdfBuffer);
    console.log(docxBuffer);
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro na conversão');
  }
};
