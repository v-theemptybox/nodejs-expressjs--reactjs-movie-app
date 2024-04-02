const express = require("express");

const movieController = require("../controllers/movie");

const router = express.Router();

// trending route
router.get("/trending", movieController.getTrendingMovies);

// top rate route
router.get("/top-rate", movieController.getTopRateMovies);

// get movies by genre route
router.get("/discover", movieController.getMoviesByGenre);

module.exports = router;