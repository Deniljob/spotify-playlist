const express = require("express");

const router = express.Router();

const {
  login,
  callback,
  refresh,
} = require("../controller/authenticationController");

router.get("/login", login);

router.post("/refresh", refresh);

router.post("/callback", callback);

module.exports = router;
