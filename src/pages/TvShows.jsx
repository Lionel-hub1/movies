import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ICONS } from "../data/constants";

const TvShowCard = ({ show }) => {
    return (
        <Link
            to={`/tv/${show.id}`}
            className="flex flex-col h-full overflow-hidden transition-all duration-300 bg-gray-800 rounded-lg shadow-md hover:shadow-xl group"
        >
            <div className="relative aspect-[2/3] overflow-hidden">
                {show.poster_path ? (
                    <img
                        src={`http://image.tmdb.org/t/p/w342${show.poster_path}`}
                        alt={show.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-700">
                        <span className="text-gray-500">No image</span>
                    </div>
                )}
                <div className="absolute p-1 px-2 text-xs font-bold bg-black rounded-full top-2 right-2 bg-opacity-70">
                    {show.vote_average ? show.vote_average.toFixed(1) : "N/A"} ★
                </div>
            </div>
            <div className="flex flex-col flex-grow p-4">
                <h3 className="mb-1 text-lg font-bold transition-colors line-clamp-1 group-hover:text-primary">{show.name}</h3>
                <p className="mb-2 text-sm text-gray-400">
                    {show.first_air_date ? new Date(show.first_air_date).getFullYear() : "Unknown"}
                </p>
                <p className="flex-grow text-sm text-gray-300 line-clamp-2">
                    {show.overview || "No description available"}
                </p>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-700">
                    <span className="text-xs text-gray-400">
                        {show.original_language?.toUpperCase() || "EN"}
                    </span>
                    <span className="px-3 py-1 text-sm transition-colors rounded-md bg-primary group-hover:bg-opacity-80">
                        View Details
                    </span>
                </div>
            </div>
        </Link>
    );
};

const TvShows = () => {
    const [activeTab, setActiveTab] = useState("popular");
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [featuredShow, setFeaturedShow] = useState(null);

    useEffect(() => {
        const fetchTvShows = async () => {
            setLoading(true);
            setError(null);
            setPage(1);

            let endpoint;
            switch (activeTab) {
                case "top_rated":
                    endpoint = `https://api.themoviedb.org/3/tv/top_rated?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=1`;
                    break;
                case "airing_today":
                    endpoint = `https://api.themoviedb.org/3/tv/airing_today?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=1`;
                    break;
                case "on_the_air":
                    endpoint = `https://api.themoviedb.org/3/tv/on_the_air?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=1`;
                    break;
                default:
                    endpoint = `https://api.themoviedb.org/3/tv/popular?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=1`;
            }

            try {
                const { data } = await axios.get(endpoint);
                setShows(data.results);
                setHasMore(data.page < data.total_pages);

                // Set featured show
                if (data.results.length > 0) {
                    const featured = data.results.find(show => show.backdrop_path) || data.results[0];

                    // Get more details about the featured show
                    const detailResponse = await axios.get(
                        `https://api.themoviedb.org/3/tv/${featured.id}?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&append_to_response=credits`
                    );

                    setFeaturedShow(detailResponse.data);
                }
            } catch (err) {
                console.error("Error fetching TV shows:", err);
                setError("Failed to load TV shows. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTvShows();
    }, [activeTab]);

    const loadMoreShows = async () => {
        if (loading || !hasMore) return;

        const nextPage = page + 1;
        let endpoint;

        switch (activeTab) {
            case "top_rated":
                endpoint = `https://api.themoviedb.org/3/tv/top_rated?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=${nextPage}`;
                break;
            case "airing_today":
                endpoint = `https://api.themoviedb.org/3/tv/airing_today?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=${nextPage}`;
                break;
            case "on_the_air":
                endpoint = `https://api.themoviedb.org/3/tv/on_the_air?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=${nextPage}`;
                break;
            default:
                endpoint = `https://api.themoviedb.org/3/tv/popular?api_key=7bbf8e63fe34ab1b017214ade09357d1&language=en-US&page=${nextPage}`;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(endpoint);
            setShows(prev => [...prev, ...data.results]);
            setPage(nextPage);
            setHasMore(nextPage < data.total_pages);
        } catch (err) {
            console.error("Error loading more TV shows:", err);
            setError("Failed to load more TV shows. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        { id: "popular", name: "Popular" },
        { id: "top_rated", name: "Top Rated" },
        { id: "on_the_air", name: "On Air" },
        { id: "airing_today", name: "Airing Today" },
    ];

    return (
        <div className="min-h-screen text-headText">
            {/* Featured Show Hero Section */}
            {featuredShow && !loading && (
                <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
                    {featuredShow.backdrop_path && (
                        <img
                            src={`http://image.tmdb.org/t/p/original${featuredShow.backdrop_path}`}
                            alt={featuredShow.name}
                            className="object-cover w-full h-full"
                        />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-start p-6 md:p-12 md:flex-row md:items-end">
                        {featuredShow.poster_path && (
                            <div className="hidden w-40 mb-4 mr-8 overflow-hidden rounded-lg shadow-2xl md:block lg:w-48 md:mb-0">
                                <img
                                    src={`http://image.tmdb.org/t/p/w342${featuredShow.poster_path}`}
                                    alt={featuredShow.name}
                                    className="w-full"
                                />
                            </div>
                        )}
                        <div className="max-w-3xl">
                            <h1 className="mb-2 text-3xl font-bold md:text-4xl lg:text-5xl drop-shadow-lg">
                                {featuredShow.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 mb-3">
                                {featuredShow.first_air_date && (
                                    <span className="text-sm">
                                        {new Date(featuredShow.first_air_date).getFullYear()}
                                    </span>
                                )}
                                {featuredShow.vote_average > 0 && (
                                    <span className="flex items-center">
                                        <img src={ICONS.starIc} alt="Rating" className="w-5 h-5 mr-1" />
                                        {featuredShow.vote_average.toFixed(1)}
                                    </span>
                                )}
                                {featuredShow.number_of_seasons > 0 && (
                                    <span className="px-2 py-1 text-sm bg-gray-800 rounded">
                                        {featuredShow.number_of_seasons} {featuredShow.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                                    </span>
                                )}
                            </div>

                            <p className="mb-4 text-sm text-gray-300 md:text-base line-clamp-2 md:line-clamp-3">
                                {featuredShow.overview}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {featuredShow.genres?.slice(0, 4).map(genre => (
                                    <span
                                        key={genre.id}
                                        className="px-3 py-1 text-xs rounded-full bg-primary bg-opacity-80"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            <Link to={`/tv/${featuredShow.id}`}>
                                <button className="flex items-center px-6 py-2 transition-colors rounded-lg bg-primary hover:bg-opacity-80">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                                    </svg>
                                    View Details
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-4 pb-16 mx-auto sm:px-8 lg:px-12 max-w-7xl">
                {/* Tabs Navigation */}
                <div className="flex justify-center my-8 overflow-x-auto">
                    <div className="flex p-1 space-x-1 bg-gray-800 rounded-lg">
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

                {error ? (
                    <div className="p-4 my-8 text-center bg-red-900 rounded-lg bg-opacity-20">
                        <p className="text-red-400">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 mt-4 transition-all rounded-lg bg-primary hover:bg-opacity-80"
                        >
                            Try Again
                        </button>
                    </div>
                ) : loading && shows.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center">
                            <span className="w-16 h-16 mb-4 animate-spin">
                                <img src={ICONS.loadingIc} alt="Loading" />
                            </span>
                            <p className="animate-pulse">Loading TV shows...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {shows.map((show) => (
                                <TvShowCard key={show.id} show={show} />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={loadMoreShows}
                                    className="flex items-center px-8 py-3 transition-all rounded-lg bg-primary hover:bg-opacity-80"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-5 h-5 mr-2 animate-spin">
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

export default TvShows;
