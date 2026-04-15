import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, email, and password are required",
    });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// PROFILE
router.get("/profile", protect, async (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.user,
  });
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "If this email exists, a code has been sent." });

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    user.resetPasswordCodeHash = codeHash;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // TODO: send email here with Nodemailer.
    // Dev fallback:
    console.log(`Reset code for ${email}: ${code}`);

    return res.json({ message: "If this email exists, a code has been sent." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// RESET PASSWORD
router.post("/verify-reset-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid or expired code" });

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    if (
      user.resetPasswordCodeHash !== codeHash ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const resetToken = jwt.sign(
      { id: user._id, type: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.json({ message: "Code verified", resetToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  const { resetToken, password } = req.body;

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.type !== "reset") {
      return res.status(401).json({ message: "Invalid reset token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordCodeHash = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }
});

console.log("authRoutes loaded");

export default router;