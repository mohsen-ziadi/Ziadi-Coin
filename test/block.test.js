const Block = require("../code/block");
const { GENESIS_DATA } = require("../code/config");
const cryptoHash = require("../code/crypto-hash");

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

  it("has a timestamp, lastHash, hash and data property", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.difficulty).toEqual(difficulty);
    expect(block.nonce).toEqual(nonce);
  });

  describe("genesis()", () => {
    const genesisblock = Block.genesis();
    it("return a block instance", () => {
      expect(genesisblock instanceof Block).toEqual(true);
    });

    it("return the genesis data", () => {
      expect(genesisblock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = Block.genesis();
    const data = "mined data";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("return a block instance", () => {
      expect(minedBlock instanceof Block).toEqual(true);
    });

    it("set the `lastHash` to the `hash` of the lastBlock", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("sets the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("sets the `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("creates a SHA-256 `hash` based on the proper inputs", () => {
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

    it("sets a `hash` that maches the difficulty criteria", () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
        "0".repeat(minedBlock.difficulty)
      );
    });
  });
});
