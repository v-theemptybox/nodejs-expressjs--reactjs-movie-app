const fs = require("fs");
const path = require("path");

const Movies = {
  all: function () {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/movieList.json"), "utf8")
    );
  },
};

module.exports = Movies;
