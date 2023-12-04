import { Request, Response } from 'express';
import * as fs from 'fs';
import * as mammoth from 'mammoth';
import pdf from 'pdf-parse';
import  { PDFParse } from '../interface/pdfParse';
import { Document, Packer, Paragraph } from 'docx';
import { IPropertiesOptions } from 'docx/build/file/core-properties';

export const convertPdfToDocx = async (req: Request, response: Response): Promise<void> => {
  try {
    const pdfBuffer: Buffer | null = (req && req.file) ? req.file.buffer : null;
    if (!pdfBuffer) {
      response.status(400).send('No PDF file provided.');
      return;
    }    
    pdf(pdfBuffer).then((documentPDF) => {
      sendPdfAsDocxResponse(documentPDF, response)
    })
  } catch (error) {
    console.error(error);
    response.status(500).send('Erro na conversão');
  }
};

const sendPdfAsDocxResponse : any = async (documentPDF: PDFParse, response: Response) => {
    const docx = new Document({
        sections: [{
            children: documentPDF.text.split('\n').map(buildPDF),
        }],
    });
    const docxBuffer = await Packer.toBuffer(docx);
    response.setHeader('Content-Disposition', 'attachment; filename=converted.docx');
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    return response.end(docxBuffer);
  } 

const buildPDF : any = (string: string) => {
  console.log(string)
}