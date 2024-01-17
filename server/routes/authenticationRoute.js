const express = require("express");

const router = express.Router();

const { login, callback } = require("../controller/authenticationController");

router.get("/login", login);

router.post("/callback", callback);

module.exports = router;
