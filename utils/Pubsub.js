const redis = require("redis");
const { v4: uuidv4 } = require("uuid");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class Pubsub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
    this.instanceId = uuidv4();

    this.init();
  }

  async init() {
    await this.publisher.connect();
    await this.subscriber.connect();

    this.subscribeToChannel();

    this.subscriber.on("message", (channel, message) => {
      this.handleMessage(channel, message);
    });
  }

  subscribeToChannel() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel, (message) =>
        this.handleMessage(channel, message)
      );
    });
  }

  async publish({ channel, message }) {
    const wrapped = JSON.stringify({
      senderId: this.instanceId,
      data: message,
    });

    await this.publisher.publish(channel, wrapped);
  }

  async broadcastChain() {
    await this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  handleMessage(channel, rawMessage) {
    let parsed;
    try {
      parsed = JSON.parse(rawMessage);
    } catch (err) {
      console.error("Invalid message format:", rawMessage);
      return;
    }

    if (parsed.senderId === this.instanceId) return; 

    const message = parsed.data;

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(JSON.parse(message));
    }
  }
}

module.exports = Pubsub;
