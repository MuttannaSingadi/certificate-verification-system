const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");

// ✅ API
router.get("/users", getAllUsers);

module.exports = router;