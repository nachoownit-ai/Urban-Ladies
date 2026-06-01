const fs = require('fs');
const path = require('path');

// Crear un script que el usuario puede ejecutar
const script = `
Opción 1: CHROME/EDGE (Más fácil):
1. Abre: N8N_INTEGRATION_GUIDE.html en Chrome o Edge
2. Presiona: Ctrl+P (o Cmd+P en Mac)
3. Destino: "Guardar como PDF"
4. Nombre: N8N_INTEGRATION_GUIDE.pdf
5. Clic: "Guardar"

Opción 2: PowerShell (Automático):
Ejecuta este comando en PowerShell:

$htmlFile = Get-Item "N8N_INTEGRATION_GUIDE.html" | Select-Object -ExpandProperty FullName
$pdfFile = $htmlFile -replace '\.html$', '.pdf'
$ie = New-Object -Com "InternetExplorer.Application"
$ie.Visible = $false
$ie.Navigate($htmlFile)
while ($ie.ReadyState -ne 4) { Start-Sleep -Milliseconds 100 }
$IEDocument = $ie.Document
$IEDocument.execCommand("print", $false)
$ie.Quit()

Opción 3: Online (Si prefieres):
- Ve a: https://cloudconvert.com/html-to-pdf
- Sube: N8N_INTEGRATION_GUIDE.html
- Descarga: PDF generado
`;

console.log(script);
fs.writeFileSync('PDF_CONVERSION_INSTRUCTIONS.txt', script);
console.log('\n✅ Instrucciones guardadas en: PDF_CONVERSION_INSTRUCTIONS.txt');
