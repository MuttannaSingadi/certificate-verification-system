const xlsx = require("xlsx");
const Certificate = require("../models/Certificate");

exports.uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    // 🔥 Map Excel → DB schema
    const data = rawData.map((item, index) => ({
      name: item.name || item.Name,
      email: item.email || item.Email,
      course: item.course || item.Course,
      certificateId:
        item.certificateId ||
        item["Certificate ID"] ||
        `CERT${Date.now()}${index}` // unique fallback
    }));

    // 🔥 Insert with duplicate skip
    let insertedCount = 0;

    try {
      const result = await Certificate.insertMany(data, {
        ordered: false // ✅ skip duplicates
      });

      insertedCount = result.length;

    } catch (err) {
      // ⚠️ Mongo throws error for duplicates but still inserts valid ones
      if (err.writeErrors) {
        insertedCount = err.result.result.nInserted;
      } else {
        throw err;
      }
    }

    res.json({
      message: "Upload completed",
      inserted: insertedCount,
      total: data.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};