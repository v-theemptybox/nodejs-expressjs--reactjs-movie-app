const fs = require("fs");
const path = require("path");

const MediaType = {
  all: function () {
    return JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../data/mediaTypeList.json"),
        "utf8"
      )
    );
  },
};

module.exports = MediaType;
