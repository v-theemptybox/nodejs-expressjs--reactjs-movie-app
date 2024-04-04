import React, { useEffect, useState } from "react";

import requests from "../../utils/requests";
import axios from "../../utils/axios";
import Nav from "../../components/browse/Nav";
import SearchResult from "../../components/search/SearchResult";
import "./Search.css";

const Search = () => {
  const [query, setQuery] = useState([]);
  const [media, setMedia] = useState("");
  const [language, setLanguage] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);
  const [genreList, setGenreList] = useState([]);
  const [genre, setGenre] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchGenre, {
        headers: { Authorization: "8qlOkxz4wq" },
      });
      setGenreList(request.data.results);
      return request;
    }
    fetchData();
  }, []);

  const handleSelectGenre = (e) => {
    setGenre(e.target.value);
  };

  const handleSelectMedia = (e) => {
    setMedia(e.target.value);
  };
  const handleSelectLanguage = (e) => {
    setLanguage(e.target.value);
  };
  const handleInputYear = (e) => {
    setReleaseYear(e.target.value);
  };

  // console.log(media, language, releaseYear);

  const handleSearch = () => {
    setQuery([searchInput, media, language, releaseYear, genre]);
  };

  const resetSearch = () => {
    setQuery("");
    setSearchInput("");
  };

  return (
    <div className="app">
      <Nav />
      <div className="s009">
        <form>
          <div className="inner-form">
            <div className="basic-search">
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Type Keywords"
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
                <div className="icon-wrap">
                  <svg
                    className="svg-inline--fa fa-search fa-w-16"
                    fill="#ccc"
                    aria-hidden="true"
                    data-prefix="fas"
                    data-icon="search"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="advance-search">
              <div className="row third">
                <div className="input-field">
                  <div className="result-count">
                    <select
                      name="genre"
                      id="genre"
                      onChange={handleSelectGenre}
                    >
                      <option value={0}>Genre</option>
                      {!genreList && <span>Loading...</span>}
                      {genreList &&
                        genreList.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.name}
                          </option>
                        ))}
                    </select>
                    <select
                      name="media"
                      id="media"
                      onChange={handleSelectMedia}
                    >
                      <option value="">Media Type</option>
                      <option value="movie">Movie</option>
                      <option value="tv">TV</option>
                      <option value="person">Person</option>
                    </select>
                    <select
                      name="language"
                      id="language"
                      onChange={handleSelectLanguage}
                    >
                      <option value="">Language</option>
                      <option value="en">English</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                    </select>
                    <label htmlFor="year">Year: </label>
                    <input
                      type="number"
                      min={1900}
                      value={releaseYear}
                      id="year"
                      name="year"
                      onChange={handleInputYear}
                      style={{ width: "100px", padding: "0" }}
                    />
                  </div>
                  <div className="group-btn">
                    <button
                      className="btn-delete"
                      onClick={resetSearch}
                      type="button"
                    >
                      RESET
                    </button>
                    <button
                      className="btn-search"
                      type="button"
                      onClick={() => handleSearch()}
                    >
                      SEARCH
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {query.length !== 0 && <SearchResult query={query} />}
    </div>
  );
};

export default Search;
