import { PDFDocument } from 'pdf-lib';

export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    let text = '';

    const pages = pdfDoc.getPages();
    for (const page of pages) {
      text += page.getTextContent().join('\n');
    }

    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF.');
  }
};
