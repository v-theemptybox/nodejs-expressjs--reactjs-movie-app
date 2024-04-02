const express = require("express");

const app = express();

const movieRoutes = require("./routes/movie");

app.use("/api/movies", movieRoutes);

app.listen(5000, () => {
  console.log("Start the server!");
});
