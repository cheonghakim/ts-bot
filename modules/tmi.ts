const tmi = require("tmi.js");

interface TmiConnect {
  process: string;
  bot: string;
  token: string;
  tmiConnect: any;
}

type messageLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

class Tmi implements TmiConnect {
  process: string;
  bot: string;
  token: string;
  constructor(process: string, bot: string, token: string) {
    this.process = process;
    this.bot = bot;
    this.token = token;
  }

  tmiConnect(level: messageLevel) {
    return new tmi.Client({
      options: { debug: true, messagesLogLevel: level },
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username: this.bot,
        password: this.token,
      },
      channels: [this.process],
    });
  }
}

module.exports = {
  Tmi,
};
