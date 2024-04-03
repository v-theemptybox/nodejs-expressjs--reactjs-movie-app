const express = require("express");
const cors = require("cors");

const app = express();

const auth = require("./middleware/auth");
const movieRoutes = require("./routes/movie");

app.use(cors());
// body parser to json
app.use(express.json());

app.use(auth.Auth);

app.use("/api/movies", movieRoutes);

// handling non matching request from the client
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// server setup
app.listen(5000, () => {
  console.log("Start the server!");
});
