import { Request, Response } from 'express';
import * as fs from 'fs';
import * as mammoth from 'mammoth';
import pdf from 'pdf-parse';
import PdfParse from 'pdf-parse';


export const convertPdfToDocx = async (req: Request, res: Response): Promise<void> => {
  try {
    const pdfBuffer: Buffer | null = (req && req.file) ? req.file.buffer : null;

    if (!pdfBuffer) {
      res.status(400).send('No PDF file provided.');
      return;
    }
    // Step 1: Extract text from PDF
    


    pdf(pdfBuffer).then((data: any) => {
      console.log(typeof data);
      console.log(data.text); 
    });

    
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro na conversão');
  }
};

