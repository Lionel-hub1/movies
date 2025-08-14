import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { ICONS } from "../data/constants";

const Movies = () => {
    const [activeTab, setActiveTab] = useState("popular");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [yearFilter, setYearFilter] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");

    const fetchMovies = async (reset = false) => {
        const newPage = reset ? 1 : page;
        let endpoint;

        switch (activeTab) {
            case "top_rated":
                endpoint = `https://api.themoviedb.org/3/movie/top_rated?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=${newPage}`;
                break;
            case "upcoming":
                endpoint = `https://api.themoviedb.org/3/movie/upcoming?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=${newPage}`;
                break;
            case "now_playing":
                endpoint = `https://api.themoviedb.org/3/movie/now_playing?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=${newPage}`;
                break;
            default:
                endpoint = `https://api.themoviedb.org/3/movie/popular?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=${newPage}`;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(endpoint);

            let filteredResults = data.results;

            // Apply year filter if selected
            if (yearFilter) {
                const year = parseInt(yearFilter);
                filteredResults = filteredResults.filter(movie => {
                    const movieYear = new Date(movie.release_date).getFullYear();
                    return movieYear === year;
                });
            }

            // Apply rating filter if selected
            if (ratingFilter) {
                const minRating = parseInt(ratingFilter);
                filteredResults = filteredResults.filter(movie => {
                    return movie.vote_average >= minRating;
                });
            }

            if (reset) {
                setMovies(filteredResults);
            } else {
                setMovies(prev => [...prev, ...filteredResults]);
            }

            setHasMore(newPage < data.total_pages);
            setPage(reset ? 2 : newPage + 1);
        } catch (err) {
            console.error("Error fetching movies:", err);
            setError("Failed to load movies. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Reset and fetch movies when tab changes or filters change
        setPage(1);
        fetchMovies(true);
    }, [activeTab, yearFilter, ratingFilter]);

    const tabItems = [
        { id: "popular", name: "Popular" },
        { id: "top_rated", name: "Top Rated" },
        { id: "upcoming", name: "Upcoming" },
        { id: "now_playing", name: "Now Playing" },
    ];

    const yearOptions = [
        { value: "", label: "All Years" },
        { value: "2023", label: "2023" },
        { value: "2022", label: "2022" },
        { value: "2021", label: "2021" },
        { value: "2020", label: "2020" },
        { value: "2019", label: "2019" },
    ];

    const ratingOptions = [
        { value: "", label: "All Ratings" },
        { value: "8", label: "8+ Rating" },
        { value: "7", label: "7+ Rating" },
        { value: "6", label: "6+ Rating" },
        { value: "5", label: "5+ Rating" },
    ];

    return (
        <div className="min-h-screen px-4 sm:px-8 lg:px-12 pb-16 text-headText">
            <div className="py-8 max-w-7xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Bebas_Neue'] mb-8 text-center">
                    Movies Collection
                </h1>

                {/* Tabs Navigation */}
                <div className="flex justify-center mb-8 overflow-x-auto">
                    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
                        {tabItems.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm md:text-base rounded-lg transition-all ${activeTab === tab.id
                                        ? "bg-primary text-white"
                                        : "hover:bg-gray-700"
                                    }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 justify-center mb-8">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="year-filter" className="text-sm">Year:</label>
                        <select
                            id="year-filter"
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            {yearOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label htmlFor="rating-filter" className="text-sm">Rating:</label>
                        <select
                            id="rating-filter"
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            {ratingOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error ? (
                    <div className="bg-red-900 bg-opacity-20 p-4 rounded-lg text-center my-8">
                        <p className="text-red-400">{error}</p>
                        <button
                            onClick={() => fetchMovies(true)}
                            className="mt-4 bg-primary px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Movies Grid */}
                        {loading && movies.length === 0 ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="flex flex-col items-center">
                                    <span className="w-16 h-16 animate-spin mb-4">
                                        <img src={ICONS.loadingIc} alt="Loading" />
                                    </span>
                                    <p className="animate-pulse">Loading movies...</p>
                                </div>
                            </div>
                        ) : movies.length === 0 ? (
                            <div className="text-center py-16">
                                <h3 className="text-xl font-bold mb-2">No movies found</h3>
                                <p className="text-gray-400 mb-6">Try adjusting your filters</p>
                                <button
                                    onClick={() => {
                                        setYearFilter("");
                                        setRatingFilter("");
                                    }}
                                    className="bg-primary px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                                {movies.map((movie) => (
                                    <MovieCard key={`${movie.id}-${activeTab}`} item={movie} />
                                ))}
                            </div>
                        )}

                        {/* Load More Button */}
                        {hasMore && movies.length > 0 && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => fetchMovies()}
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Movies;
