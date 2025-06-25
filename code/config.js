const cryptoHash = require("./crypto-hash");
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
  timestamp: 14040322,
  lastHash: "Hash not found",
  data: [],
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  hash: cryptoHash(14040322, "Hash not found", [], 0, INITIAL_DIFFICULTY),
};

module.exports = { GENESIS_DATA };
