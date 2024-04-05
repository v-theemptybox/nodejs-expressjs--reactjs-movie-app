const Movies = require("../models/Movies");
const Genre = require("../models/Genre");
const Videos = require("../models/VideoList");
const MediaType = require("../models/MediaType");

const paging = require("../utils/paging");

const PAGE_SIZE = 20;

// Fetch trending movies
exports.getTrendingMovies = (req, res, next) => {
  const movies = Movies.all();

  // get page through query params
  const page = +req.query.page || 1;
  // descending sort movies by popularity
  const sortedMovies = movies.sort((a, b) => b.popularity - a.popularity);
  // each page has 20 items
  const results = paging(sortedMovies, PAGE_SIZE, page);

  res.status(200).json({
    results,
    page,
    total_pages: Math.ceil(sortedMovies.length / PAGE_SIZE),
  });
};

// Fetch top rate movies
exports.getTopRateMovies = (req, res, next) => {
  const movies = Movies.all();

  const page = +req.query.page || 1;
  // descending sort movies by vote_average
  const sortedMovies = movies.sort((a, b) => b.vote_average - a.vote_average);

  const results = paging(sortedMovies, PAGE_SIZE, page);

  res.status(200).json({
    results,
    page,
    total_pages: Math.ceil(sortedMovies.length / PAGE_SIZE),
  });
};

// Fetch movies by genre
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

  const results = paging(filteredMovies, PAGE_SIZE, page);

  // get movie names from genre
  const foundedGenre = genre.find((genreData) => genreData.id === genre_id);
  const genre_name = foundedGenre.name;

  res.status(200).json({
    results,
    page,
    total_pages: Math.ceil(filteredMovies.length / PAGE_SIZE),
    genre_name,
  });
};

// Post trailer or teaser of movie
exports.postTrailer = (req, res, next) => {
  const videos = Videos.all();
  const filmId = req.body.film_id;
  console.log(req.body.film_id);

  // check film_id is null
  if (!filmId) {
    return res.status(400).json({ message: "Not found film_id param" });
  }

  // check film_id is not in videoList.json
  const isVideoIdValid = videos.some((video) => video.id === filmId);
  if (!isVideoIdValid) {
    return res.status(404).json({ message: "Not found video" });
  }

  const foundedVideo = videos.find((video) => video.id === filmId);
  const officialVideos = foundedVideo.videos
    .filter(
      (video) =>
        // video must be official
        (video.official &&
          // video must be upload in YouTube
          video.site === "YouTube" &&
          // video must be Trailer or Teaser
          video.type === "Trailer") ||
        video.type === "Teaser"
    )
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at)); // get new video first

  if (!officialVideos) {
    return res.status(404).json({ message: "Not found video" });
  }

  // get the latest published video
  let latestPublishedVideo = officialVideos.find(
    (video) => video.type === "Trailer"
  );
  if (!latestPublishedVideo) {
    latestPublishedVideo = officialVideos[0];
  }

  res.status(200).json({
    results: latestPublishedVideo,
  });
};

// Get genre list of movies
exports.getGenre = (req, res, next) => {
  const genre = Genre.all();
  res.status(200).json({
    results: genre,
  });
};

// Search movies by keyword
exports.postSearch = (req, res, next) => {
  const movies = Movies.all();
  const keyword = req.body.keyword;
  const req_media_type = req.body.req_media_type;
  const req_language = req.body.req_language;
  const req_year = req.body.req_year;
  const req_genre = req.body.req_genre;

  const page = +req.query.page || 1;

  if (!keyword) {
    res.status(400).json({ message: "Not found keyword param" });
  }

  // check title or overview has keyword
  let filteredMovies = movies.filter(
    (movie) =>
      movie.title?.toLowerCase().includes(keyword.toLowerCase()) ||
      movie.overview?.toLowerCase().includes(keyword.toLowerCase())
  );

  // check if user passing genre
  if (req_genre) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.genre_ids.includes(req_genre)
    );
  }

  // check if user passing media type data
  if (req_media_type) {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.media_type === req_media_type
    );
  }

  // check if user passing language
  if (req_language) {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.original_language === req_language
    );
  }

  // check if user pass release year
  if (req_year) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.release_date
        ? new Date(movie.release_date).getFullYear() === req_year
        : new Date(movie.first_air_date).getFullYear() === req_year
    );
  }

  const results = paging(filteredMovies, PAGE_SIZE, 1);

  res.status(200).json({
    results,
    page,
    total_pages: Math.ceil(filteredMovies.length / PAGE_SIZE),
  });
};
