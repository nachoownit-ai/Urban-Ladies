const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const htmlFile = path.join(__dirname, 'N8N_INTEGRATION_GUIDE.html');
    const pdfFile = path.join(__dirname, 'N8N_INTEGRATION_GUIDE.pdf');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle2' });

    await page.pdf({
      path: pdfFile,
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true
    });

    await browser.close();

    console.log('✅ PDF generado correctamente!');
    console.log('📄 Archivo:', pdfFile);
    const stats = fs.statSync(pdfFile);
    console.log('📊 Tamaño:', (stats.size / 1024).toFixed(2), 'KB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
