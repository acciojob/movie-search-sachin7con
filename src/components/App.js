//SGN, JSP, JSLN, JSSR, JBB, JSRK, JMD, JSM
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './../styles/App.css';
import 'regenerator-runtime/runtime';

const apiKey = '99eb9fd1';

// Component to display the list of items (movies)
const ItemList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const fetchMovies = async (query) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
      
      if (response && response.data && response.data.Response === "False") {
        setErrorMessage("Invalid movie name. Please try again.");
        setMovies([]);
      } else if (response && response.data && response.data.Search) {
        setMovies(response.data.Search);
        setErrorMessage('');
      } else {
        setErrorMessage("No movies found.");
        setMovies([]);
      }
    } catch (error) {
      console.error("Error in fetching data", error);
      setErrorMessage("An error occurred, please try again later.");
      setMovies([]);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchMovies(searchTerm);
    } else {
      setErrorMessage("Please enter a valid movie name.");
      setMovies([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container">
      <label>
        Search Movies <br />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter movie title..."
        />
      </label>
      <button onClick={handleSearch}>Search</button>

      {errorMessage && <div className="error">{errorMessage}</div>}

      <div className="movie-result">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.imdbID} className="movie-item">
              <Link to={`/movie/${movie.imdbID}`}>
                <p>{movie.Title}</p>
                <p>{movie.Year}</p>
                <img src={movie.Poster} alt={`${movie.Title} Poster`} />
              </Link>
            </div>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </div>
  );
};

// Component to display the detail of a specific movie
const ItemDetail = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
        if (response && response.data && response.data.Response === "False") {
          setErrorMessage("Movie not found.");
        } else {
          setMovie(response.data);
          setErrorMessage('');
        }
      } catch (error) {
        console.error("Error fetching movie details", error);
        setErrorMessage("An error occurred, please try again later.");
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (errorMessage) {
    return <div className="error">{errorMessage}</div>;
  }

  return movie ? (
    <div className="movie-detail">
      <h2>{movie.Title} ({movie.Year})</h2>
      <p>{movie.Plot}</p>
      <img src={movie.Poster} alt={`${movie.Title} Poster`} />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/movie/:id" element={<ItemDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
