const fs = require("fs");
const path = require("path");

module.exports = {
  routing(app) {
    const files = fs.readdirSync(__dirname);
    files.forEach((item) => {
      if (item === "index.js") return;
      const route = require(path.resolve(__dirname, item));
      app.use(route.routes()).use(route.allowedMethods());
    });
  },
};
