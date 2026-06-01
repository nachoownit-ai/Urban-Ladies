const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, 'N8N_INTEGRATION_GUIDE.html');
const pdfFile = path.join(__dirname, 'N8N_INTEGRATION_GUIDE.pdf');

const html = fs.readFileSync(htmlFile, 'utf8');

const options = {
  format: 'A4',
  orientation: 'portrait',
  border: {
    top: '0.5in',
    right: '0.5in',
    bottom: '0.5in',
    left: '0.5in'
  },
  header: {
    height: '10mm'
  },
  footer: {
    height: '10mm',
    contents: {
      default: '<span style="color: #666; font-size: 10px;">Urban Ladies PRO - N8N Integration Guide | Página <span class="pageNumber"></span></span>'
    }
  }
};

pdf.create(html, options).toFile(pdfFile, (err, res) => {
  if (err) {
    console.error('❌ Error generando PDF:', err);
    process.exit(1);
  }
  console.log('✅ PDF generado correctamente!');
  console.log('📄 Archivo:', pdfFile);
  console.log('📊 Tamaño:', fs.statSync(pdfFile).size, 'bytes');
});
