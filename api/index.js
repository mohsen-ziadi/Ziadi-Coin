const { Router } = require("express");
const router = Router();

router.use("/", (req,res) => {
  return res.status(201).json({
    success: true,
    message: "hello mosi",
  });
});

module.exports = router;
