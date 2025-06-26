const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  constructor({ timestamp, lastHash, hash, data, difficulty, nonce }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    let timestamp, hash;
    const lastHash = lastBlock.hash;
    const { difficulty } = lastBlock;
    let nonce = 0;
    do {
      timestamp = Date.now();
      nonce++;
      hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));
    return new this({
      timestamp,
      lastHash,
      hash,
      data,
      difficulty,
      nonce,
    });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    if (timestamp - originalBlock.timestamp > MINE_RATE) {
      console.log("difficulty is loweres");
      return difficulty - 1;
    }
    console.log("difficulty is raises");
    return difficulty + 1;
  }
}

module.exports = Block;
