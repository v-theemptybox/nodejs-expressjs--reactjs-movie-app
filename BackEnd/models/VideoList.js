const fs = require("fs");
const path = require("path");

const Videos = {
  all: function () {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/videoList.json"), "utf8")
    );
  },
};

module.exports = Videos;
