import { Request, Response } from 'express';
import pdf from 'pdf-parse';
import  { PDFParse } from '../interface/pdfParse';
import { Document, Packer, Paragraph } from 'docx';

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

export const convertBase64ToDocx = async(req: Request, response: Response): Promise<void> => {
  try {
    console.log("Passou aqui ");
    const base64String = req.body.base64String;
    if (!base64String) {
      response.status(400).send('No Base64 string provided.');
      return;
    }
    
    console.log("Passou aqui 1")
    const pdfBuffer = Buffer.from(base64String, 'base64');
    console.log("Passou aqui 2")
    const extractedText = await extractTextFromPDF(pdfBuffer);
    console.log("Passou aqui 3")
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
      children: text.split('\n').map(line => new Paragraph(line)),
    }],
  });

  return await Packer.toBuffer(doc);
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

const buildPDF : any = (text: string) => {
  const adjustedText =   text.replace(/([a-z])([A-Z][a-z])/g, '$1 $2') // Entre minúsculas e maiúsculas seguido por minúsculas
  .replace(/([0-9])([a-zA-Z])/g, '$1 $2')  // Entre números e letras
  .replace(/([a-zA-Z])([0-9])/g, '$1 $2'
  ); // Entre letras e números

  console.log(adjustedText);
  return new Paragraph(adjustedText);
}