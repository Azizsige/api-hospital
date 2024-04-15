// controllers/userController.js
const User = require("../models/User");
const { checkRole } = require("../middleware/authMiddleware");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const e = require("express");

// cek validasi token jika benar
const checkToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: "false", message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is blacklisted
    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ status: "false", message: "Token is blacklisted" });
    }

    // Set user to request object
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(403)
      .json({ status: "false", message: "Invalid token or token expired" });
  }
};

const getAllUser = async (req, res) => {
  //  melakukan pengecekan role user yg login
  const role = req.role.role;
  try {
    if (role === "super admin") {
      const users = await User.find({})
        .select("-password")
        .populate("taskNames");
      return res.status(200).json({ status: "true", users });
    } else {
      //  cari user dengan role admin
      const users = await User.find({ role: "admin" })
        .select("-password -refreshToken")
        .populate("taskNames");
      return res.status(200).json({ status: "true", users });
    }
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const getUserTaskNameById = async (req, res) => {
  const { userId } = req.body.payload;
  try {
    const user = await User.findById(userId)
      .populate("taskNames")
      .select("taskNames");
    return res.status(200).json({ status: "true", user });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const getAllUserJustRoleName = async (req, res) => {
  try {
    const users = await User.find({}).select("role");
    return res.status(200).json({ status: "true", users });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });

    // Validasi request menggunakan Express Validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Dapatkan data msg dari array errors
      const extractedErrors = errors.array().map((err) => ({ msg: err.msg }));
      return res.status(400).json({ errors: extractedErrors });
    }

    if (existingUser) {
      return res.status(400).json({
        status: "false",
        message: `${username} has already existed!`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;

    if (role === "super admin") {
      // Jika role adalah super admin, tambahkan semua data dari koleksi TaskName ke user.taskNames
      const allTaskNames = await TaskName.find();
      user = await User.create({
        username,
        role,
        password: hashedPassword,
        taskNames: allTaskNames.map((task) => task._id),
      });
    } else {
      // Jika role adalah admin, gunakan nilai default untuk taskNames
      user = await User.create({
        username,
        role,
        password: hashedPassword,
      });
    }

    await user.save();

    res.status(201).json({
      status: "true",
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "false",
      message: "Internal Server Error or Token has been expired",
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ _id: id });

    if (!existingUser) {
      return res
        .status(400)
        .json({ status: "false", message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      id,
      {
        username,
        password: hashedPassword,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ status: "true", message: `${username} has been updated`, user });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const ids = req.params.id.split(",");

  try {
    const deleteUsers = await User.deleteMany({ _id: { $in: ids } });

    if (deleteUsers.deletedCount === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "User not found" });
    }

    return res
      .status(200)
      .json({ status: "true", message: "User has been deleted" });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

module.exports = {
  getAllUser,
  getUserTaskNameById,
  getAllUserJustRoleName,
  addUser,
  updateUser,
  deleteUser,
  checkToken,
};
