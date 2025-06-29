const Block = require("../code/block");
const Blockchain = require("../code/blockchain");
const cryptoHash = require("../code/crypto-hash");

describe("Blockchain", () => {
  let errorMock, logMock;
  let blockchain, newChain, orginalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    orginalChain = blockchain.chain;

    errorMock = jest.fn();
    logMock = jest.fn();

    global.console.error = errorMock;
    global.console.log = logMock;
  });

  it("Containes a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("Starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("Add new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("When the chain does not start with the genesis block", () => {
      it("return false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("When the chain does start with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "one" });
        blockchain.addBlock({ data: "two" });
        blockchain.addBlock({ data: "three" });
      });

      describe("and a `lastHash` refrence has changed", () => {
        it("return false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        it("return false", () => {
          blockchain.chain[2].data = "change-data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain does not contain any invalid blocks", () => {
        it("return true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });

    describe("When the chain contains a block with a jumped difficulty", () => {
      it("returns false", () => {
        const lastBlock = blockchain.chain[blockchain.chain.length - 1];
        const lastHash = lastBlock.hash;
        const timestamp = Date.now();
        const nonce = 0;
        const data = [];
        const difficulty = lastBlock.difficulty - 3;
        const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

        const badBlock = new Block({
          timestamp,
          lastHash,
          hash,
          nonce,
          difficulty,
          data,
        });

        blockchain.chain.push(badBlock);

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });
  });

  describe("replaceChain()", () => {
    describe("When the new chain is not longer", () => {
      beforeEach(() => {
        newChain[0] = { new: "chain" };
        blockchain.replaceChain(newChain.chain);
      });
      it("Does not replace the chain", () => {
        expect(blockchain.chain).toEqual(orginalChain);
      });

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("When the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "one" });
        newChain.addBlock({ data: "two" });
        newChain.addBlock({ data: "three" });
        newChain.addBlock({ data: "four" });
      });

      describe("and the chain is invalid", () => {
        it("Does not replace the chain", () => {
          newChain.chain[2].hash = "fake-hash";
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(orginalChain);
        });
      });
      describe("and the chain is valid", () => {
        it("Does replace the chain", () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });
    });
  });
});
