import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import MovieCard from "../components/MovieCard";
import { ICONS } from "../data/constants";
import axios from "axios";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const [trendingResponse, popularResponse] = await Promise.all([
          axios.get("https://api.themoviedb.org/3/trending/movie/week?api_key=7bbf8e63fe34ab1b017214ade09357d1"),
          axios.get("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=7bbf8e63fe34ab1b017214ade09357d1")
        ]);

        // Get top trending movies
        const trending = trendingResponse.data.results;
        setTrendingMovies(trending.slice(0, 12));

        // Select top 2 for featured section (with backdrop images)
        const withBackdrops = trending.filter(movie => movie.backdrop_path);
        setFeaturedMovies(withBackdrops.slice(0, 2));

        setRecommendedMovies(popularResponse.data.results.slice(0, 12));
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Function to watch movie trailer
  const watchTrailer = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=7bbf8e63fe34ab1b017214ade09357d1`
      );

      const videos = response.data.results;
      // Find trailer
      const trailer = videos.find(video =>
        video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
      } else {
        // If no trailer found, redirect to movie details
        window.location.href = `/movie/${movieId}`;
      }
    } catch (err) {
      console.error("Failed to fetch trailer:", err);
      // Fallback to movie details page
      window.location.href = `/movie/${movieId}`;
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 xl:px-20 text-bodyText">
      {/* Hero Section */}
      <section className="flex flex-col pt-8 mb-16 xl:flex-row">
        <div className="relative flex flex-col items-center xl:items-start w-full xl:w-1/2 xl:border-r-[1px] xl:border-linesColor pb-10">
          <span className="hidden xl:inline-flex h-[1px] w-1/3 right-0 bg-linesColor absolute"></span>

          <h1 className="font-['Bebas_Neue'] text-center xl:text-left">
            <span className="block text-4xl font-normal md:text-6xl lg:text-7xl">
              Find movies
            </span>
            <span className="block mt-2 text-5xl font-normal md:text-7xl lg:text-8xl top-grad">
              TV shows and more
            </span>
          </h1>

          <p className="max-w-2xl px-4 py-6 text-base text-center md:py-8 xl:text-start xl:px-0 md:text-lg">
            Discover the latest blockbusters, classic films, and trending TV shows all in one place.
            Our curated collection brings you the best of entertainment from around the world.
            Stream, explore, and enjoy your favorite content anytime, anywhere.
          </p>

          <div className="flex space-x-4">
            <Link to="/explore">
              <button className="px-6 py-2 transition-all duration-300 border-2 rounded-lg border-primary text-primary hover:bg-primary hover:text-white">
                Explore Now
              </button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="hidden xl:flex items-center justify-center w-1/2 h-[45rem]">
            <div className="flex flex-col items-center">
              <span className="w-16 h-16 mb-4 animate-spin">
                <img src={ICONS.loadingIc} alt="Loading" />
              </span>
              <p className="text-lg animate-pulse">Loading trending movies...</p>
            </div>
          </div>
        ) : (
          <div className="relative hidden xl:block p-10 h-[45rem] w-1/2 xl:border-b-[1px] xl:border-linesColor">
            <div className="relative flex items-center justify-center w-full h-full">
              {featuredMovies.length >= 2 && (
                <>
                  {/* First featured movie (front) */}
                  <div className="absolute bottom-0 left-0 z-10 w-2/3 transition-transform duration-500 transform h-5/6 hover:scale-105">
                    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-2xl">
                      <div onClick={() => watchTrailer(featuredMovies[0].id)}
                        className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center mx-auto my-auto transition-opacity cursor-pointer w-30 h-30 opacity-90 hover:opacity-100">
                        <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity opacity-0 hover:opacity-60"></div>
                        <img className="w-20 h-20 filter drop-shadow-lg relative z-20" src={ICONS.playIc} alt="Play" />
                      </div>
                      <img
                        className="object-cover w-full h-full rounded-lg"
                        src={`http://image.tmdb.org/t/p/w780${featuredMovies[0].backdrop_path}`}
                        alt={featuredMovies[0].title}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-2xl font-bold text-white">{featuredMovies[0].title}</h3>
                        <div className="flex items-center text-sm text-gray-300">
                          <span>{new Date(featuredMovies[0].release_date).getFullYear()}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <img src={ICONS.starIc} alt="Rating" className="w-4 h-4 mr-1" />
                            {featuredMovies[0].vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second featured movie (back) */}
                  <div className="absolute top-0 right-0 w-2/3 overflow-hidden transition-transform duration-500 transform rounded-lg shadow-xl h-5/6 hover:translate-y-2">
                    <div onClick={() => watchTrailer(featuredMovies[1].id)}
                      className="relative w-full h-full cursor-pointer group">
                      <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity opacity-0 group-hover:opacity-60 z-10"></div>
                      <img
                        className="object-cover w-full h-full rounded-lg"
                        src={`http://image.tmdb.org/t/p/w780${featuredMovies[1].backdrop_path}`}
                        alt={featuredMovies[1].title}
                      />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <img className="w-20 h-20 filter drop-shadow-lg" src={ICONS.playIc} alt="Play" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-xl font-bold text-white">{featuredMovies[1].title}</h3>
                        <div className="flex items-center text-sm text-gray-300">
                          <span>{new Date(featuredMovies[1].release_date).getFullYear()}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <img src={ICONS.starIc} alt="Rating" className="w-4 h-4 mr-1" />
                            {featuredMovies[1].vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-2 h-2 -mb-1 rounded-full bg-linesColor"></div>
          </div>
        )}
      </section>

      {loading && !featuredMovies.length ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <span className="w-16 h-16 mb-4 animate-spin">
              <img src={ICONS.loadingIc} alt="Loading" />
            </span>
            <p className="text-lg animate-pulse">Loading movies...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 my-8 text-center bg-red-900 rounded-lg bg-opacity-20">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 transition-all rounded-lg bg-primary hover:bg-opacity-80"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Trending Section */}
          <section className="mb-16">
            <div className="flex items-center w-full my-8 group">
              <div className="flex items-center">
                <img className="w-auto h-6 mr-2 md:h-8" src={ICONS.fireIc} alt="Trending" />
                <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">Trending</h2>
              </div>
              <span className="h-[1px] w-full mx-4 bg-linesColor hidden sm:inline-flex"></span>
              <Link to="/movies" className="text-sm transition-colors duration-300 whitespace-nowrap md:text-base group-hover:text-primary">
                See More →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 md:gap-10">
              {trendingMovies.map((movie) => (
                <MovieCard key={movie.id} item={movie} />
              ))}
            </div>
          </section>

          {/* Recommended Section */}
          <section className="mb-16">
            <div className="flex flex-col w-full my-8 sm:flex-row sm:items-center group">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl sm:mb-0">
                YOU MAY ALSO LIKE
              </h2>
              <span className="h-[1px] w-full mx-4 bg-linesColor hidden xl:inline-flex"></span>
              <Link to="/explore" className="text-sm transition-colors duration-300 whitespace-nowrap md:text-base group-hover:text-primary sm:ml-auto">
                See More →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 md:gap-10">
              {recommendedMovies.map((movie) => (
                <MovieCard key={movie.id} item={movie} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
