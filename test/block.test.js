const Block = require("../code/block");
const { GENESIS_DATA, MINE_RATE } = require("../code/config");
const cryptoHash = require("../code/crypto-hash");
const hexToBinary = require('hex-to-binary')


describe("Block", () => {
  const timestamp = 14040322;
  const lastHash = "last hash";
  const hash = "now hashh";
  const data = ["mosi", "python"];
  const difficulty = 1;
  const nonce = 1;

  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    difficulty,
    nonce,
  });

  it("Has a timestamp, lastHash, hash and data property", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.difficulty).toEqual(difficulty);
    expect(block.nonce).toEqual(nonce);
  });

  describe("genesis()", () => {
    const genesisblock = Block.genesis();
    it("Return a block instance", () => {
      expect(genesisblock instanceof Block).toEqual(true);
    });

    it("Return the genesis data", () => {
      expect(genesisblock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = Block.genesis();
    const data = "mined data";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("Return a block instance", () => {
      expect(minedBlock instanceof Block).toEqual(true);
    });

    it("Set the `lastHash` to the `hash` of the lastBlock", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("Sets the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("Sets the `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("Creates a SHA-256 `hash` based on the proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          lastBlock.hash,
          data,
          minedBlock.difficulty,
          minedBlock.nonce
        )
      );
    });

    it("Sets a `hash` that maches the difficulty criteria", () => {
      expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual(
        "0".repeat(minedBlock.difficulty)
      );
    });

    it("Adjust the difficulty ", () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];
      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe("adjustDifficulty()", () => {
    it("Raises the difficulty for a quickly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });

    it("Lowers the difficulty for a slowly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });

    it("Has a lower limit of 1", () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
  });
});
