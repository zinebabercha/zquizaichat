import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.mjs";




export async function extractTextFromPDF(file) {
  if (!(file instanceof File)) {
    throw new Error("Input must be a PDF file.");
  }

  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async function () {
      try {
        const arrayBuffer = reader.result;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          // Concatenate all text from the page
          textContent.items.forEach((item) => {
            extractedText += `${item.str} `;
          });

          extractedText += "\n"; // Separate pages with new lines
        }

        resolve(extractedText);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = function () {
      reject(reader.error);
    };

    reader.readAsArrayBuffer(file);
  });
}
