const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");
const hexToBinary = require('hex-to-binary')

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
    const lastHash = lastBlock.hash;
    let timestamp, hash;
    let { difficulty } = lastBlock;
    let nonce = 0;
    do {
      timestamp = Date.now();
      nonce++;
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      });
      hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
    } while (hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty));
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
    if (difficulty < 1) return 1;
    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }
}

module.exports = Block;
