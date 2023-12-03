import { Request, Response } from 'express';
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');


export const convertPdfToDocx = async (req: Request, res: Response): Promise<void> => {
  try {
    const pdfBuffer: Buffer | null = (req && req.file) ? req.file.buffer : null;
    const pdfData = await fs.promises.readFile(pdfBuffer);
    const pdfText = (await pdf(pdfData)).text;

    // Convert HTML to DOCX
    const docxBuffer = await mammoth.extractRawText({ html: pdfText });
    
    // Do something with the docxBuffer, such as save it to a file or send it as a response
    return docxBuffer;
    console.log(pdfBuffer);
    console.log(docxBuffer);


    
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro na conversão');
  }
};
