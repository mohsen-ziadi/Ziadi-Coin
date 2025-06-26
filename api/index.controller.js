const BlockChain = require("../blockchainApp/code/blockchain");
const blockchain = new BlockChain();

async function getBlocks(req, res) {
  return res.status(200).json({
    success: true,
    message: "Your blockchian >>",
    blockchain,
  });
}

async function mineBlock(req, res) {

  const { data } = req.body;

  blockchain.addBlock({ data });
  res.redirect("/api/blocks");
}

module.exports = {
  getBlocks,
  mineBlock,
};
