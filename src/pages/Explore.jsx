import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import { ICONS } from "../data/constants";
import { debounce } from "lodash"; // You may need to install this: npm install lodash

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Handle search input with debounce
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        // Load popular movies if search is empty
        try {
          setLoading(true);
          setError(null);
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=1`
          );
          setMovies(response.data.results);
          setTotalResults(response.data.total_results);
          setHasMore(response.data.page < response.data.total_pages);
          setPage(1);
        } catch (err) {
          console.error("Error fetching popular movies:", err);
          setError("Failed to load movies. Please try again.");
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=7bbf8e63fe34ab1b017214ade09357d1&query=${term}&page=1`
        );
        setMovies(response.data.results);
        setTotalResults(response.data.total_results);
        setHasMore(response.data.page < response.data.total_pages);
        setPage(1);
      } catch (err) {
        console.error("Error searching movies:", err);
        setError("Failed to search movies. Please try again.");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    // Handle sticky header
    const handleScroll = () => {
      const searching = document.querySelector("#searcher");
      if (window.scrollY > 30) {
        searching?.classList.add("bg-background", "shadow-lg");
      } else {
        searching?.classList.remove("bg-background", "shadow-lg");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Initial load of popular movies
    if (initialLoad) {
      debouncedSearch("");
    } else {
      debouncedSearch(searchTerm);
    }

    // Cleanup the debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch, initialLoad]);

  const loadMoreMovies = async () => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    const endpoint = searchTerm.trim()
      ? `https://api.themoviedb.org/3/search/movie?api_key=7bbf8e63fe34ab1b017214ade09357d1&query=${searchTerm}&page=${nextPage}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=${nextPage}`;

    try {
      setLoading(true);
      const response = await axios.get(endpoint);
      setMovies(prev => [...prev, ...response.data.results]);
      setPage(nextPage);
      setHasMore(nextPage < response.data.total_pages);
    } catch (err) {
      console.error("Error loading more movies:", err);
      setError("Failed to load more movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="text-headText min-h-screen pb-16">
      <div
        id="searcher"
        className="sticky top-16 z-10 pt-4 pb-4 px-4 sm:px-8 flex flex-col items-center space-y-3 transition-all duration-300"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Bebas_Neue'] mb-4">
          Explore Movies
        </h1>

        <div className="w-full max-w-3xl relative">
          <input
            className="outline-none border-2 border-primary rounded-lg p-3 pl-10 w-full text-background focus:shadow-lg transition-all"
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search movies by title, actor, or director..."
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <p className="text-sm sm:text-base">
          {loading ? 'Searching...' : `${totalResults} results found`}
        </p>
      </div>

      {error && (
        <div className="mx-4 sm:mx-8 my-6 p-4 bg-red-900 bg-opacity-20 rounded-lg text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => debouncedSearch(searchTerm)}
            className="mt-4 bg-primary px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="px-4 sm:px-8 mt-6">
        {loading && movies.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <span className="w-16 h-16 animate-spin mb-4">
                <img src={ICONS.loadingIc} alt="Loading" />
              </span>
              <p className="animate-pulse">Searching for movies...</p>
            </div>
          </div>
        ) : movies.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-xl font-bold mb-2">No movies found</h2>
            <p className="text-gray-400">Try different search terms or explore our popular movies.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MovieCard key={`${movie.id}-${movie.title}`} item={movie} />
            ))}
          </div>
        )}

        {hasMore && movies.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMoreMovies}
              className="bg-primary px-8 py-3 rounded-lg hover:bg-opacity-80 transition-all flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 animate-spin mr-2">
                    <img src={ICONS.loadingIc} alt="Loading" className="w-full h-full" />
                  </span>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
