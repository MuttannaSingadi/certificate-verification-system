const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const QRCode = require("qrcode");

async function generatePDF(data) {

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 550]);

  // Load template
  const templateBytes = fs.readFileSync("certificate-template/template.png");
  const templateImg = await pdfDoc.embedPng(templateBytes);

  page.drawImage(templateImg, {
    x: 0,
    y: 0,
    width: 800,
    height: 550,
  });

  // 🔤 Add Name
  page.drawText(data.name, {
    x: 250,
    y: 280,
    size: 26,
    color: rgb(0, 0, 0),
  });

  // 📘 Course
  page.drawText(data.course, {
    x: 250,
    y: 240,
    size: 18,
  });

  // 🆔 Certificate ID
  page.drawText(data.certificateId, {
    x: 50,
    y: 40,
    size: 12,
  });

  // ✍ Signature
  const signatureBytes = fs.readFileSync("certificate-template/signature.png");
  const signatureImg = await pdfDoc.embedPng(signatureBytes);

  page.drawImage(signatureImg, {
    x: 100,
    y: 80,
    width: 120,
    height: 50,
  });

  // 🔵 Seal
  const sealBytes = fs.readFileSync("certificate-template/seal.png");
  const sealImg = await pdfDoc.embedPng(sealBytes);

  page.drawImage(sealImg, {
    x: 650,
    y: 70,
    width: 80,
    height: 80,
  });

  // 🔐 QR Code
  const qrData = `https://certificate-verification-system-tpcf.onrender.com/verify/${data.certificateId}`;
  const qrImage = await QRCode.toBuffer(qrData);

  const qrEmbed = await pdfDoc.embedPng(qrImage);

  page.drawImage(qrEmbed, {
    x: 650,
    y: 400,
    width: 80,
    height: 80,
  });

  return await pdfDoc.save();
}

module.exports = generatePDF;