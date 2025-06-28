const BlockChain = require("../blockchainApp/code/blockchain");
const Pubsub = require("../utils/Pubsub");
const blockchain = new BlockChain();
const pubsub = new Pubsub({blockchain});

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
  pubsub.broadcastChain();
  res.redirect("/api/blocks");
}

module.exports = {
  getBlocks,
  mineBlock,
};
