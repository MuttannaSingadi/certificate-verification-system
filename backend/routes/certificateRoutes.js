const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");

const { generateCertificate } = require("../controllers/certificateController");


// ✅ GET ALL CERTIFICATES
router.get("/", async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🔥 GENERATE CERTIFICATE (must be above :id)
router.post("/generate/:id", generateCertificate);


// ✅ GET CERTIFICATE BY ID
router.get("/:id", async (req, res) => {
  try {
    const cert = await Certificate.findOne({
      certificateId: req.params.id
    });

    if (!cert) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(cert);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ ADD NEW CERTIFICATE
router.post("/", async (req, res) => {
  try {
    const { name, email, course, certificateId } = req.body;

    if (!name || !email || !course || !certificateId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await Certificate.findOne({ certificateId });
    if (existing) {
      return res.status(400).json({ message: "Certificate already exists" });
    }

    const newCert = new Certificate({ name, email, course, certificateId });

    await newCert.save();

    res.status(201).json({
      message: "Certificate added successfully",
      data: newCert
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ UPDATE certificate
router.put("/:id", async (req, res) => {
  try {
    const updated = await Certificate.findOneAndUpdate(
      { certificateId: req.params.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ DELETE certificate
router.delete("/:id", async (req, res) => {
  try {
    const cert = await Certificate.findOneAndDelete({
      certificateId: req.params.id
    });

    if (!cert) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;