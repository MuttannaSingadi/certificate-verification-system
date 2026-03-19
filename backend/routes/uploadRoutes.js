const express = require("express");
const router = express.Router();
const multer = require("multer");

const { uploadStudents } = require("../controllers/uploadController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/students", upload.single("file"), uploadStudents);

module.exports = router;