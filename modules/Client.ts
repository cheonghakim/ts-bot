import { AxiosPromise } from "axios";

const { StreamDefault } = require("./StreamDefault");
const { Tmi } = require("./tmi");
//외부 모듈
const shell = require("shelljs");
const express = require("express");
const dotenv = require("dotenv");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json);
dotenv.config();

type messageLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

interface DefaultClient {
  streammer: string;
  botName: string;
  botAuth: string;
  stream: any;
  tmi: any;
  control: string[];
  client: any;
  admin: string;

  connect: any;
}

class Client implements DefaultClient {
  streammer: string;
  botName: string;
  botAuth: string;
  stream: AxiosPromise;
  tmi: typeof Tmi;
  control: string[];
  client: any;
  admin: string;
  level: messageLevel;

  connections: any[];
  constructor(
    streammer: string,
    botName: string,
    botAuth: string,
    admin: string,
    level: messageLevel = "info"
  ) {
    this.streammer = streammer;
    this.botName = botName;
    this.botAuth = botAuth;
    this.admin = admin;
    this.level = level;

    this.stream = new StreamDefault(this.streammer);
    this.tmi = new Tmi(this.streammer, this.botName, this.botAuth);
    console.log(this.tmi);
    //tmi 연결
    this.client = this.tmi.tmiConnect();
    this.connect();

    //관리자
    this.control = [this.admin];

    this.connections = [];
  }

  async connect() {
    try {
      this.client.connect();
      this.client.on(
        "message",
        async (channel: any, tags: any, message: string, self: string) => {
          if (self) return;
          const [type, streammer, admin] = message?.split(" ");
          if (type && type === "connect" && streammer && admin) {
            this.connections.push(
              new CalledClient(
                streammer,
                this.botName,
                this.botAuth,
                admin,
                "info"
              )
            );
            this.client.say(channel, `${streammer}의 채팅창에 연결 되었어요.`);
          } else {
            this.client.say(channel, `connect (스트리머) (관리자)를 입력해요.`);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

class CalledClient implements DefaultClient {
  streammer: string;
  botName: string;
  botAuth: string;
  stream: AxiosPromise;
  tmi: typeof Tmi;
  control: string[];
  client: any;
  admin: string;
  level: messageLevel;

  constructor(
    streammer: string,
    botName: string,
    botAuth: string,
    admin: string,
    level: messageLevel = "info"
  ) {
    this.streammer = streammer;
    this.botName = botName;
    this.botAuth = botAuth;
    this.admin = admin;
    this.level = level;

    this.stream = new StreamDefault(this.streammer);
    this.tmi = new Tmi(this.streammer, this.botName, this.botAuth);
    console.log(this.tmi);
    //tmi 연결
    this.client = this.tmi.tmiConnect();
    this.connect();

    //관리자
    this.control = [this.admin];
  }
  connect: any;

  async checkNonDefaultMessages(
    channel: any,
    tags: any,
    message: string,
    self: string
  ) {
    if (message?.trim() === "isConnect") {
      this.client.say(channel, `연결 되었어요`);
    }
    //
    if (message.includes("shell") && this.control.includes(tags.username)) {
      try {
        const splited = message.split(" ");
        if (splited) {
          splited.splice(0, 1);
          if (shell[splited[0]]) {
            const { stdout, stderr, code } = shell[splited[0]](
              splited.slice(1).join(" ")
            );
            if (stderr)
              this.client.say(channel, `${decodeURIComponent(stderr)}`);
            if (stdout) this.client.say(channel, decodeURIComponent(stdout));
          }
        }
      } catch (error: unknown) {
        this.client.say(channel, `${error as Error}`);
      }
    } else if (
      message.includes("shell") &&
      !this.control.includes(tags.username)
    ) {
      this.client.say(channel, `권한이 없어요 :(`);
    }
  }
  async checkChatting(channel: any, tags: any, message: string, self: string) {
    if (message === "test") {
      return true;
    }

    return false;
  }
}

module.exports = {
  Client,
};
