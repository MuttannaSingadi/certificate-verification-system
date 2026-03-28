const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");

// ✅ Route
router.get("/users", getAllUsers);

module.exports = router;