import { Request, Response } from 'express';
import pdf from 'pdf-parse';
import  { PDFParse } from '../interface/pdfParse';
import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const convertPdfToDocx = async (req: Request, response: Response): Promise<void> => {
  try {
    const pdfBuffer: Buffer | null = (req && req.file) ? req.file.buffer : null;
    if (!pdfBuffer) {
      response.status(400).send('No PDF file provided.');
      return;
    }    
    pdf(pdfBuffer).then((documentPDF) => {
      response.json(pdfBuffer.toString('base64'));
      sendPdfAsDocxResponse(documentPDF, response)
    })
  } catch (error) {
    console.error(error);
    response.status(500).send('Erro na conversão');
  }
};

export const convertBase64ToDocx = async(req: Request, response: Response): Promise<void> => {
  try {
    const base64String = req.body.base64String;
    if (!base64String) {
      response.status(400).send('No Base64 string provided.');
      return;
    }
    const pdfBuffer = Buffer.from(base64String, 'base64');
    const extractedText = await extractTextFromPDF(pdfBuffer);
    const docxBuffer = await createDocxFromText(extractedText);

    response.setHeader('Content-Disposition', 'attachment; filename=converted.docx');
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    response.end(docxBuffer);

  } catch (error) {
    console.error(error);
    response.status(500).send('Erro na conversão');
  }
}

const extractTextFromPDF = async (pdfBuffer: Buffer) => {
  const data = await pdf(pdfBuffer);
  return data.text;
};

const createDocxFromText = async (text: string) => {
  console.log(text);
  const doc = new Document({
    sections: [{
      children: text.split('\n').map(line => new Paragraph({ children: [new TextRun(line.trim())] })),
    }],
  });

  return await Packer.toBuffer(doc);
};

const sendPdfAsDocxResponse : any = async (documentPDF: any, response: Response) => {
  const docxTrim = documentPDF.trim();  
  
  const docx = new Document({
        sections: [{
            children: documentPDF.text.split('\n').map(buildPDF),
        }],
    });

    console.log(documentPDF.text);
    const docxBuffer = await Packer.toBuffer(docx);

    fs.writeFileSync('D:\Conversor\src\docx.docx', docxBuffer);
    response.setHeader('Content-Disposition', 'attachment; filename=converted.docx');
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    return response.end(docxBuffer);
} 

const buildPDF : any = (text: string) => {
  console.log(text.trim());
  return new Paragraph(text);
}