const { Client } = require("./modules/Client");

try {
  new Client(
    process.env.TEST,
    process.env.DOYA_BOT,
    process.env.DOYA_AUTH,
    process.env.ADMIN
  );
} catch (error) {
  console.log(error);
}
