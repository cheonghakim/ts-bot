import { AxiosPromise } from "axios";

const axios = require("axios");

axios.interceptors.response.use(
  (res: AxiosPromise) => {
    return res;
  },
  (err: Error) => {
    return Promise.reject(err);
  }
);
