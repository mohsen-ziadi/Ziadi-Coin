const { Router } = require("express");
const router = Router();
const { getBlocks , mineBlock } = require("./index.controller");

router.get("/blocks", getBlocks);
router.post("/mine", mineBlock);

module.exports = router;
