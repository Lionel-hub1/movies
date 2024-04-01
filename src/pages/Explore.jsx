import { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=7bbf8e63fe34ab1b017214ade09357d1&query=${searchTerm}`
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="text-headText z-50">
      <div className="sticky top-28 z-10 bg-background pb-2 top w-full px-8 flex flex-col items-center space-y-3">
        <h1 className="text-4xl font-bold font-['Bebas_Neue']">
          Explore Movies
        </h1>
        <input
          className="outline-none border-2 border-primary rounded-md p-2 w-full text-background"
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search movies here"
        />
      </div>
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 space-x-2 space-y-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} item={movie} />
        ))}
        <div className="float-end"></div>
      </div>
    </div>
  );
};

export default Explore;
