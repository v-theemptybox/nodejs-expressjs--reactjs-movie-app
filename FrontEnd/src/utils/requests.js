const API_KEY = "504b85f6fe0a10a9c7f35945e14e7ddf";

// change request to routes match with backend
const requests = {
  fetchTrending: `/trending`,
  fetchTopRated: `/top-rate`,
  fetchActionMovies: `/discover?genre=28`,
  fetchComedyMovies: `/discover?genre=35`,
  fetchHorrorMovies: `/discover?genre=27`,
  fetchRomanceMovies: `/discover?genre=10749`,
  fetchDocumentaries: `/discover?genre=99`,
  fetchSearch: `/search`,
  fetchGenre: `/genre`,
};

export default requests;
