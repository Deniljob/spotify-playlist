const express = require("express");

const router = express.Router();

const functionalityController = require("../controller/functionalityController");

router.post("/playList", functionalityController.playList);

router.post("/download", functionalityController.downloadAudios);

router.post(
  "/download-single-audio",
  functionalityController.downloadSingleAudio
);

module.exports = router;
