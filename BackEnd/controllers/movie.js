const Movies = require("../models/Movies");
const Genre = require("../models/Genre");
const paging = require("../utils/paging");

const PAGE_SIZE = 20;

// fetch trending movies
exports.getTrendingMovies = (req, res, next) => {
  const movies = Movies.all();

  // get page through query params
  const page = +req.query.page || 1;
  // descending sort movies by popularity
  const sortedMovies = movies.sort((a, b) => b.popularity - a.popularity);

  const results = paging(sortedMovies, PAGE_SIZE, page);

  res.status(200).json({
    results,
    page,
    total_pages: Math.ceil(sortedMovies.length / PAGE_SIZE),
  });
};

// fetch top rate movies
exports.getTopRateMovies = (req, res, next) => {
  const movies = Movies.all();

  const page = +req.query.page || 1;
  // descending sort movies by vote_average
  const sortedMovies = movies.sort((a, b) => b.vote_average - a.vote_average);

  res.status(200).json({
    results,
    page,
    total_pages: Math.ceil(sortedMovies.length / PAGE_SIZE),
  });
};

// fetch movies by genre
exports.getMoviesByGenre = (req, res, next) => {
  const movies = Movies.all();
  const genre = Genre.all();

  const genre_id = +req.query.genre;
  const page = +req.query.page || 1;

  // check genre_id is null
  if (!genre_id) {
    return res.status(400).json({ message: "Not found genre param" });
  }

  // check genre_id is not in genreList.json
  const isGenreIdValid = genre.some((genreData) => genreData.id === genre_id);
  if (!isGenreIdValid) {
    return res.status(400).json({ message: "Not found genre id" });
  }

  // filtered movies by genre id
  const filteredMovies = movies.filter((movie) =>
    movie.genre_ids.includes(genre_id)
  );

  // get movie names from genre
  const foundedGenre = genre.find((genreData) => genreData.id === genre_id);
  const genre_name = foundedGenre.name;

  res.status(200).json({
    results: filteredMovies,
    page,
    total_pages: Math.ceil(filteredMovies.length / PAGE_SIZE),
    genre_name,
  });
};
