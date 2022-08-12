const argv = process.argv.slice(2);
function getValue(name) {
  let value;
  for (const arg of argv) {
    const array = arg.split("=");
    const currentName = array[0];
    const currentValue = array[1];
    if (currentName === name) {
      value = currentValue;
      break;
    }
  }
  return value;
}

const value = getValue("dotenv_config_path");
if (value) {
  require("dotenv").config({
    path: value
  });
} else {
  require("dotenv").config();
}
