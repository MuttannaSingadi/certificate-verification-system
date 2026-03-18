const xlsx = require("xlsx");
const Certificate = require("../models/Certificate");

exports.uploadStudents = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = xlsx.utils.sheet_to_json(sheet);

    await Certificate.insertMany(data);

    res.json({ message: "Students uploaded successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};