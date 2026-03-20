const Certificate = require("../models/Certificate");
const generatePDF = require("../utils/pdfGenerator");
const fs = require("fs");

exports.generateCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const cert = await Certificate.findOne({ certificateId: id });

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const pdfBytes = await generatePDF(cert);

    const filePath = `uploads/certificates/${id}.pdf`;

    fs.writeFileSync(filePath, pdfBytes);

    res.json({
      message: "Certificate generated successfully",
      fileUrl: `https://certificate-verification-system-tpcf.onrender.com/${filePath}`
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating certificate" });
  }
};