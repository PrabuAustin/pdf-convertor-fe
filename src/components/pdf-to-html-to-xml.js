import React, { useState } from 'react';
import { Upload, Button, Card, Typography, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { create } from 'xmlbuilder2';

const { Title } = Typography;
const { Dragger } = Upload;

function PdfToHtmlToXml() {
  const [htmlContent, setHtmlContent] = useState('');
  const [xmlContent, setXmlContent] = useState('');

  // Upload PDF and convert it to HTML
  const handlePdfUpload = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:8000/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { html } = response.data;
      setHtmlContent(html);

      // Convert HTML to XML
      const root = create({ version: '1.0' }).ele('document');
      root.ele('html').raw(html);
      const xmlOutput = root.end({ prettyPrint: true });
      setXmlContent(xmlOutput);

      return false; // Prevent default upload behavior
    } catch (error) {
      message.error('Error converting the PDF');
      console.error('Error converting the PDF:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>PDF to HTML to XML Converter</Title>

      {/* Ant Design Dragger for PDF Upload */}
      <Dragger
        accept=".pdf"
        beforeUpload={handlePdfUpload}
        showUploadList={false}
        style={{ marginBottom: '20px' }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag PDF file to upload</p>
      </Dragger>

      {/* Card to show the HTML Output */}
      {htmlContent && (
        <Card title="HTML Output" style={{ marginBottom: '20px' }}>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </Card>
      )}

      {/* Card to show the XML Output */}
      {xmlContent && (
        <Card title="XML Output">
          <pre>{xmlContent}</pre>
        </Card>
      )}
    </div>
  );
}

export default PdfToHtmlToXml;
