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

      const { timestamp, lastHash, hash, data } = block;

      if (lastHash !== actualLastHash) {
        console.error(`The lastHash block [${i}] not equal to actualLastHash [${i-1}]>>>`);
        return false;
      }
      if (hash !== cryptoHash(timestamp, lastHash, data)) {
        console.error(`The hash of this block [${i}] not equal hash of blocks data >>>`);
        return false;
      }
    }

    console.log("This chain is valid >>");
    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("the incoming chain must be longer");
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("the incoming chian must be valid");
      return;
    }
    console.log("replacing chain with: ", chain);
    this.chain = chain;
  }
}

module.exports = Blockchain;
