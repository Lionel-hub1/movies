import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { ICONS } from "../data/constants";

const Genre = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/genre/movie/list?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US`
                );
                setGenres(response.data.genres);
                // Set action as default genre (id: 28)
                setSelectedGenre(response.data.genres.find(genre => genre.id === 28) || response.data.genres[0]);
            } catch (err) {
                console.error("Error fetching genres:", err);
                setError("Failed to load genres. Please try again later.");
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchMoviesByGenre = async () => {
            if (!selectedGenre) return;

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/discover/movie?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&with_genres=${selectedGenre.id}&sort_by=popularity.desc`
                );
                setMovies(response.data.results);
            } catch (err) {
                console.error(`Error fetching movies for genre ${selectedGenre.name}:`, err);
                setError(`Failed to load ${selectedGenre.name} movies. Please try again later.`);
            } finally {
                setLoading(false);
            }
        };

        fetchMoviesByGenre();
    }, [selectedGenre]);

    return (
        <div className="min-h-screen px-4 sm:px-8 lg:px-12 pb-16 text-headText">
            <div className="py-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Bebas_Neue'] mb-8 text-center">
                    Browse Movies By Genre
                </h1>

                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            onClick={() => setSelectedGenre(genre)}
                            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${selectedGenre?.id === genre.id
                                    ? "bg-primary text-white"
                                    : "bg-gray-800 hover:bg-gray-700"
                                }`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>

                {selectedGenre && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl md:text-3xl font-bold">
                                <span className="text-primary">{selectedGenre.name}</span> Movies
                            </h2>

                            <div className="flex items-center text-sm bg-gray-800 rounded-lg overflow-hidden">
                                <button className="px-3 py-1 hover:bg-gray-700">Popular</button>
                                <button className="px-3 py-1 hover:bg-gray-700">Latest</button>
                                <button className="px-3 py-1 hover:bg-gray-700">Top Rated</button>
                            </div>
                        </div>

                        <p className="text-gray-400 mt-2">
                            Discover the best {selectedGenre.name.toLowerCase()} films from around the world
                        </p>
                    </div>
                )}

                {error ? (
                    <div className="bg-red-900 bg-opacity-20 p-4 rounded-lg text-center my-8">
                        <p className="text-red-400">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-primary px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <span className="w-16 h-16 animate-spin mb-4">
                                <img src={ICONS.loadingIc} alt="Loading" />
                            </span>
                            <p className="animate-pulse">Loading {selectedGenre?.name} movies...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} item={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Genre;
