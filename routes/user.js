const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

// POST /api/login
// params: email, password
router.post("/login", userController.loginUser);

// POST /api/register
// params: name, email, password
router.post("/register", userController.registerUser);

// GET /api/logout
router.get("/logout", userController.logoutUser);

// GET /api/getUser
router.get("/getUser", userController.getUser);

module.exports = router;
