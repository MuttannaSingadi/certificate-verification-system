const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* GET ALL */
router.get("/", protect, adminOnly, async (req, res) => {
  const data = await Certificate.find();
  res.json(data);
});

/* ADD */
router.post("/", protect, adminOnly, async (req, res) => {
  const cert = new Certificate(req.body);
  await cert.save();
  res.json({ message: "Added" });
});

/* UPDATE */
router.put("/:id", protect, adminOnly, async (req, res) => {
  const updated = await Certificate.findOneAndUpdate(
    { certificateId: req.params.id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

/* DELETE */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Certificate.findOneAndDelete({
    certificateId: req.params.id
  });
  res.json({ message: "Deleted" });
});

/* GET BY CERTIFICATE ID (PUBLIC) */
router.get("/:id", async (req, res) => {
  try {
    const cert = await Certificate.findOne({
      certificateId: req.params.id
    });

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json(cert);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;