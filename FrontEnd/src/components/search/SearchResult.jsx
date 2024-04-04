import React, { useState, useEffect } from "react";

import axios from "../../utils/axios";
import requests from "../../utils/requests";

import "./SearchResult.css";

const base_url = "https://image.tmdb.org/t/p/original";

const SearchResult = ({ query }) => {
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState("");

  const url = `${requests.fetchSearch}`;
  useEffect(() => {
    async function fetchData() {
      try {
        // by default: req_media_type = "",  req_language ="", req_year = 0, req_genre = 0
        // app will load all option if one of them has default value
        const request = await axios.post(
          url,
          {
            keyword: query[0],
            req_media_type: query[1],
            req_language: query[2],
            req_year: +query[3],
            req_genre: +query[4],
          },
          {
            headers: { Authorization: "8qlOkxz4wq" },
          }
        );

        if (request.data.results.length === 0) {
          setMovies([]);
          setMessage("No movies found!");
        } else {
          setMessage("");
          setMovies(request.data.results);
        }

        return request;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setMovies([]);
          setMessage(error.response.data.message);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    }

    if (query) {
      fetchData();
    } else {
      setMovies([]);
    }
  }, [url, query]);

  return (
    <div className="row">
      <h2>Search Result</h2>
      <div className="row_posters search-resul-container sc2">
        {movies &&
          movies.map((movie) => {
            return (
              <img
                key={movie.id}
                className={`row_poster row_posterLarge`}
                src={`${base_url}${movie.poster_path}`}
                alt={movie.name}
              />
            );
          })}
      </div>
      {message && <h3>{message}</h3>}
    </div>
  );
};

export default SearchResult;
