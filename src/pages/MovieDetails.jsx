import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { ICONS } from "../data/constants";

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState({});
  const [movieVideo, setMovieVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFadingIn, setIsFadingIn] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch movie details and videos in parallel for better performance
        const [detailsResponse, videosResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=7bbf8e63fe34ab1b017214ade09357d1&append_to_response=credits,similar`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=7bbf8e63fe34ab1b017214ade09357d1`)
        ]);

        setMovieDetails(detailsResponse.data || {});

        // Find the best video - prefer trailers first
        const videos = videosResponse.data?.results || [];
        const trailer = videos.find(video => video.type === "Trailer" && video.site === "YouTube");
        const teaser = videos.find(video => video.type === "Teaser" && video.site === "YouTube");
        const anyVideo = videos.find(video => video.site === "YouTube");

        setMovieVideo(trailer?.key || teaser?.key || anyVideo?.key || null);

        // Add a slight delay before showing content for smoother transition
        setTimeout(() => {
          setIsFadingIn(true);
          setLoading(false);
        }, 300);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Failed to load movie information. Please try again later.");
        setLoading(false);
      }
    };

    fetchMovieData();

    // Cleanup function to reset fade state when component unmounts or id changes
    return () => {
      setIsFadingIn(false);
    };
  }, [id]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-md p-6 text-center bg-gray-800 rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-red-400">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 transition-all duration-300 rounded-lg bg-primary hover:bg-opacity-80"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen text-white bg-gradient-to-b from-gray-900 to-black">
          <div className="flex flex-col items-center">
            <span className="w-20 h-20 mb-4 animate-spin">
              <img src={ICONS.loadingIc} alt="Loading" />
            </span>
            <p className="text-lg animate-pulse">Loading movie details...</p>
          </div>
        </div>
      ) : (
        <div className={`relative flex items-center justify-center w-full min-h-screen text-white bg-gradient-to-b from-gray-900 to-black transition-opacity duration-500 ${isFadingIn ? 'opacity-100' : 'opacity-0'}`}>
          {/* Background poster with parallax effect */}
          {movieDetails.backdrop_path && (
            <div className="fixed top-0 left-0 z-0 w-full h-full">
              <div className="absolute inset-0 bg-black bg-opacity-85"></div>
              <img
                className="object-cover w-full h-full opacity-30"
                src={`http://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                alt=""
              />
            </div>
          )}

          <div className="z-10 flex flex-col w-full px-4 py-8 max-w-7xl sm:px-6 lg:px-8 lg:py-12">
            {/* Title Section with Rating Badge */}
            <div className="relative mb-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-['Bebas_Neue'] leading-tight">
                  {movieDetails.title || "Title Not Available"}
                  {movieDetails.release_date && (
                    <span className="ml-2 text-2xl text-gray-400 sm:text-3xl">
                      ({new Date(movieDetails.release_date).getFullYear()})
                    </span>
                  )}
                </h1>

                {movieDetails.vote_average > 0 && (
                  <div className="flex items-center">
                    <div className={`
                      flex items-center justify-center 
                      rounded-full w-16 h-16 md:w-20 md:h-20 border-4
                      ${movieDetails.vote_average >= 8 ? 'border-green-500 text-green-500' :
                        movieDetails.vote_average >= 6 ? 'border-yellow-500 text-yellow-500' :
                          'border-red-500 text-red-500'}
                    `}>
                      <span className="text-2xl font-bold md:text-3xl">
                        {Math.round(movieDetails.vote_average * 10)}
                      </span>
                    </div>
                    <span className="ml-2 text-sm text-gray-300">User<br />Score</span>
                  </div>
                )}
              </div>

              {/* Tagline */}
              {movieDetails.tagline && (
                <p className="mt-2 text-lg italic text-gray-400 sm:text-xl">
                  "{movieDetails.tagline}"
                </p>
              )}
            </div>

            <div className="flex flex-col gap-8 xl:flex-row">
              {/* Left column: Video/Poster and Quick Facts */}
              <div className="w-full xl:w-2/3">
                {/* Video section with fallback */}
                <div className="relative mb-8 overflow-hidden rounded-lg shadow-2xl aspect-video">
                  {movieVideo ? (
                    <YouTube
                      className="w-full h-full"
                      videoId={movieVideo}
                      opts={{
                        height: "100%",
                        width: "100%",
                        playerVars: {
                          autoplay: 0,
                          modestbranding: 1,
                          controls: 1,
                        },
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-900">
                      {movieDetails.poster_path ? (
                        <img
                          className="object-contain w-full h-full"
                          src={`http://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                          alt={movieDetails.title || "Movie poster"}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <svg className="w-16 h-16 mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h18M3 16h18"></path>
                          </svg>
                          <p className="text-xl">No media available</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Movie overview */}
                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Overview</h2>
                  <p className="text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
                    {movieDetails.overview || "No overview available for this movie."}
                  </p>
                </div>

                {/* Cast section (if available from credits) */}
                {movieDetails.credits?.cast?.length > 0 && (
                  <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Top Cast</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {movieDetails.credits.cast.slice(0, 5).map((person) => (
                        <div key={person.id} className="overflow-hidden bg-gray-800 rounded-lg">
                          {person.profile_path ? (
                            <img
                              src={`http://image.tmdb.org/t/p/w185${person.profile_path}`}
                              alt={person.name}
                              className="object-cover w-full h-40"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-40 bg-gray-700">
                              <span className="text-gray-500">No image</span>
                            </div>
                          )}
                          <div className="p-2">
                            <p className="font-bold truncate">{person.name}</p>
                            <p className="text-sm text-gray-400 truncate">{person.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column: Info and stats */}
              <div className="w-full xl:w-1/3">
                {/* Genre tags */}
                <div className="p-6 mb-6 bg-gray-800 bg-opacity-50 rounded-lg">
                  <h3 className="mb-3 text-xl font-bold">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movieDetails.genres && movieDetails.genres.length > 0 ? (
                      movieDetails.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 text-sm transition-colors duration-300 bg-gray-700 rounded-full hover:bg-primary"
                        >
                          {genre.name}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 text-sm bg-gray-700 rounded-full">
                        No genres listed
                      </span>
                    )}
                  </div>
                </div>

                {/* Movie metadata */}
                <div className="p-6 mb-6 bg-gray-800 bg-opacity-50 rounded-lg">
                  <h3 className="mb-3 text-xl font-bold">Movie Info</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Release Date:</span>
                      <p>{formatDate(movieDetails.release_date)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Runtime:</span>
                      <p>{formatRuntime(movieDetails.runtime)}</p>
                    </div>
                    {movieDetails.budget > 0 && (
                      <div>
                        <span className="text-gray-400">Budget:</span>
                        <p>${(movieDetails.budget).toLocaleString()}</p>
                      </div>
                    )}
                    {movieDetails.revenue > 0 && (
                      <div>
                        <span className="text-gray-400">Revenue:</span>
                        <p>${(movieDetails.revenue).toLocaleString()}</p>
                      </div>
                    )}
                    {movieDetails.production_companies?.length > 0 && (
                      <div>
                        <span className="text-gray-400">Production:</span>
                        <p>{movieDetails.production_companies.map(c => c.name).join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats and metrics */}
                <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg">
                  <h3 className="mb-3 text-xl font-bold">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center p-3 bg-gray-900 rounded-lg">
                      <img
                        className="w-8 h-8 mb-2"
                        src={ICONS.likeIc}
                        alt="Votes"
                      />
                      <span className="text-sm text-gray-400">Vote Count</span>
                      <span className="text-2xl font-bold">
                        {movieDetails.vote_count?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-900 rounded-lg">
                      <img
                        className="w-8 h-8 mb-2"
                        src={ICONS.starIc}
                        alt="Rating"
                      />
                      <span className="text-sm text-gray-400">Rating</span>
                      <span className="text-2xl font-bold">
                        {movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Movies */}
            {movieDetails.similar?.results?.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Similar Movies</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {movieDetails.similar.results.slice(0, 5).map(movie => (
                    <div key={movie.id} className="overflow-hidden transition-transform bg-gray-800 rounded-lg cursor-pointer hover:scale-105">
                      {movie.poster_path ? (
                        <img
                          src={`http://image.tmdb.org/t/p/w342${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-48 bg-gray-700">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="font-bold truncate">{movie.title}</h3>
                        {movie.release_date && (
                          <p className="text-sm text-gray-400">
                            {new Date(movie.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MovieDetails;
