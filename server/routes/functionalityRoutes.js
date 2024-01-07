const express = require("express");

const router = express.Router();

const functionalityController = require("../controller/functionalityController");

router.post("/playList", functionalityController.playList);

router.post("/download", functionalityController.downloadAudios);

module.exports = router;
