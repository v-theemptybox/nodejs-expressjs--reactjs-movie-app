const Movies = require("../models/Movies");
const Genre = require("../models/Genre");
const Videos = require("../models/VideoList");

const paging = require("../utils/paging");

const PAGE_SIZE = 20;

// fetch trending movies
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

// fetch top rate movies
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

// search movies by keyword
exports.postSearch = (req, res, next) => {
  const movies = Movies.all();
  const keyword = req.body.keyword;

  const page = +req.query.page || 1;

  if (!keyword) {
    res.status(400).json({ message: "Not found keyword param" });
  }

  // check title or overview has keyword
  const filteredMovies = movies.filter(
    (movie) =>
      movie.title?.toLowerCase().includes(keyword.toLowerCase()) ||
      movie.overview?.toLowerCase().includes(keyword.toLowerCase())
  );

  const results = paging(filteredMovies, PAGE_SIZE, page);

  res.status(200).json({
    results,
    page,
    total_pages: Math.ceil(filteredMovies.length / PAGE_SIZE),
  });
};
