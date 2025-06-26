const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    console.log("The new block added to chain >>");
    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      console.error("The first block of chain not equal to genesis block >>>");
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const actualLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      const { timestamp, lastHash, hash, data, difficulty, nonce } = block;

      if (lastHash !== actualLastHash) {
        console.error(
          `The lastHash block [${i}] not equal to actualLastHash [${i - 1}]>>>`
        );
        return false;
      }
      if (Math.abs(lastDifficulty - difficulty) > 1) {
        console.error(`The chain contains a block with a jumped difficulty>>>`);
        return false;
      }
      if (hash !== cryptoHash(timestamp, lastHash, data, difficulty, nonce)) {
        console.error(
          `The hash of this block [${i}] not equal hash of blocks data >>>`
        );
        return false;
      }
    }

    console.log("This chain is valid >>");
    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chian must be valid");
      return;
    }
    console.log("Replacing chain with: ", chain);
    this.chain = chain;
  }
}

module.exports = Blockchain;
