const cryptoHash = require("./crypto-hash");

const GENESIS_DATA = {
  timestamp: 14040322,
  lastHash: "Hash not found",
  data: [],
  hash: cryptoHash(14040322, "lastHash", []),
};

module.exports = { GENESIS_DATA };
