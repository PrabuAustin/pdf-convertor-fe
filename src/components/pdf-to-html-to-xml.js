import React, { useState } from 'react';
import { Upload, Button, Card, Typography, message } from 'antd';
import { PDFDocument } from "pdf-lib";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import * as pdfjsLib from 'pdfjs-dist/webpack';


const { Title } = Typography;
const { Dragger } = Upload;

function PdfToHtmlToXml() {
  const [pdfContent, setPdfContent] = useState('');

  const loadPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    let extractedText = '';

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Extract text items and positions
      const pageText = textContent.items.map(item => item.str).join(' ');
      extractedText += `<div><h3>Page ${i}</h3><p>${pageText}</p></div>`;
    }
console.log(extractedText,'extractedText')
    setPdfContent(extractedText);
  };

  return (
    <div>
      <input type="file" onChange={(e) => loadPdf(e.target.files[0])} />
      <div dangerouslySetInnerHTML={{ __html: pdfContent }} />
    </div>
  );
};
export default PdfToHtmlToXml;
