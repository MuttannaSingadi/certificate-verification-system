require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const certificateRoutes = require("./routes/certificateRoutes");


const app = express();

/* Connect MongoDB */
connectDB();

/* Middleware */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* Test Route */
app.get("/", (req, res) => {
  res.send("Certificate Verification API Running");
});

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/certificates", certificateRoutes);


/* Handle Unknown Routes */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});