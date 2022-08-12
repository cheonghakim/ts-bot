import { AxiosPromise } from "axios";
const { default: axios } = require("axios");

interface DefaultFuncs {
  streammer: string;
  getChatters(): AxiosPromise;
}

class StreamDefault implements DefaultFuncs {
  streammer: string;
  constructor(streammer: string) {
    this.streammer = streammer;
  }

  async getChatters() {
    let chatterListUrl = `https://tmi.twitch.tv/group/user/${this.streammer}/chatters`;
    try {
      const result = await axios.get(chatterListUrl);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  StreamDefault,
};
