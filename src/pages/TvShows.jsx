import { useState, useEffect } from "react";
import axios from "axios";
import { ICONS } from "../data/constants";

const TvShowCard = ({ show }) => {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <div className="relative aspect-[2/3] overflow-hidden">
                {show.poster_path ? (
                    <img
                        src={`http://image.tmdb.org/t/p/w342${show.poster_path}`}
                        alt={show.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1 px-2 text-xs font-bold">
                    {show.vote_average ? show.vote_average.toFixed(1) : "N/A"} ★
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{show.name}</h3>
                <p className="text-gray-400 text-sm mb-2">
                    {show.first_air_date ? new Date(show.first_air_date).getFullYear() : "Unknown"}
                </p>
                <p className="text-sm text-gray-300 line-clamp-2 flex-grow">
                    {show.overview || "No description available"}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                        {show.original_language?.toUpperCase() || "EN"}
                    </span>
                    <button className="bg-primary text-sm py-1 px-3 rounded-md hover:bg-opacity-80 transition-colors">
                        Details
                    </button>
                </div>
            </div>
        </div>
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
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent z-10"></div>
                    {featuredShow.backdrop_path && (
                        <img
                            src={`http://image.tmdb.org/t/p/original${featuredShow.backdrop_path}`}
                            alt={featuredShow.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 flex flex-col md:flex-row items-start md:items-end">
                        {featuredShow.poster_path && (
                            <div className="hidden md:block w-40 lg:w-48 rounded-lg overflow-hidden shadow-2xl mr-8 mb-4 md:mb-0">
                                <img
                                    src={`http://image.tmdb.org/t/p/w342${featuredShow.poster_path}`}
                                    alt={featuredShow.name}
                                    className="w-full"
                                />
                            </div>
                        )}
                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
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
                                    <span className="text-sm bg-gray-800 px-2 py-1 rounded">
                                        {featuredShow.number_of_seasons} {featuredShow.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                                    </span>
                                )}
                            </div>

                            <p className="text-sm md:text-base text-gray-300 mb-4 line-clamp-2 md:line-clamp-3">
                                {featuredShow.overview}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {featuredShow.genres?.slice(0, 4).map(genre => (
                                    <span
                                        key={genre.id}
                                        className="text-xs bg-primary bg-opacity-80 px-3 py-1 rounded-full"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            <button className="bg-primary hover:bg-opacity-80 transition-colors px-6 py-2 rounded-lg flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                                </svg>
                                Watch Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-4 sm:px-8 lg:px-12 pb-16 max-w-7xl mx-auto">
                {/* Tabs Navigation */}
                <div className="flex justify-center my-8 overflow-x-auto">
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
                ) : loading && shows.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <span className="w-16 h-16 animate-spin mb-4">
                                <img src={ICONS.loadingIc} alt="Loading" />
                            </span>
                            <p className="animate-pulse">Loading TV shows...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                            {shows.map((show) => (
                                <TvShowCard key={show.id} show={show} />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={loadMoreShows}
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

export default TvShows;
