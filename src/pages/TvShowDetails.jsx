import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { ICONS } from "../data/constants";

const TvShowDetails = () => {
    const { id } = useParams();
    const [showDetails, setShowDetails] = useState({});
    const [showVideo, setShowVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFadingIn, setIsFadingIn] = useState(false);

    useEffect(() => {
        const fetchShowData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch TV show details and videos in parallel
                const [detailsResponse, videosResponse] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=7bbf8e63fe34ab1b017214ade09357d1&append_to_response=credits,similar`),
                    axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=7bbf8e63fe34ab1b017214ade09357d1`)
                ]);

                setShowDetails(detailsResponse.data || {});

                // Find the best video - prefer trailers first
                const videos = videosResponse.data?.results || [];
                const trailer = videos.find(video => video.type === "Trailer" && video.site === "YouTube");
                const teaser = videos.find(video => video.type === "Teaser" && video.site === "YouTube");
                const anyVideo = videos.find(video => video.site === "YouTube");

                setShowVideo(trailer?.key || teaser?.key || anyVideo?.key || null);

                setTimeout(() => {
                    setIsFadingIn(true);
                    setLoading(false);
                }, 300);
            } catch (err) {
                console.error("Error fetching TV show data:", err);
                setError("Failed to load TV show information. Please try again later.");
                setLoading(false);
            }
        };

        fetchShowData();

        return () => {
            setIsFadingIn(false);
        };
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
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
                        <p className="text-lg animate-pulse">Loading TV show details...</p>
                    </div>
                </div>
            ) : (
                <div className={`relative flex items-center justify-center w-full min-h-screen text-white bg-gradient-to-b from-gray-900 to-black transition-opacity duration-500 ${isFadingIn ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Background poster */}
                    {showDetails.backdrop_path && (
                        <div className="fixed top-0 left-0 z-0 w-full h-full">
                            <div className="absolute inset-0 bg-black bg-opacity-85"></div>
                            <img
                                className="object-cover w-full h-full opacity-30"
                                src={`http://image.tmdb.org/t/p/original${showDetails.backdrop_path}`}
                                alt=""
                            />
                        </div>
                    )}

                    <div className="z-10 flex flex-col w-full px-4 py-8 pb-16 max-w-7xl sm:px-6 lg:px-8 lg:py-12">
                        {/* Title Section with Rating Badge */}
                        <div className="relative mb-8">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-['Bebas_Neue'] leading-tight">
                                    {showDetails.name || "Title Not Available"}
                                    {showDetails.first_air_date && (
                                        <span className="ml-2 text-2xl text-gray-400 sm:text-3xl">
                                            ({new Date(showDetails.first_air_date).getFullYear()})
                                        </span>
                                    )}
                                </h1>

                                {showDetails.vote_average > 0 && (
                                    <div className="flex items-center">
                                        <div className={`
                      flex items-center justify-center 
                      rounded-full w-16 h-16 md:w-20 md:h-20 border-4
                      ${showDetails.vote_average >= 8 ? 'border-green-500 text-green-500' :
                                                showDetails.vote_average >= 6 ? 'border-yellow-500 text-yellow-500' :
                                                    'border-red-500 text-red-500'}
                    `}>
                                            <span className="text-2xl font-bold md:text-3xl">
                                                {Math.round(showDetails.vote_average * 10)}
                                            </span>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-300">User<br />Score</span>
                                    </div>
                                )}
                            </div>

                            {/* Tagline */}
                            {showDetails.tagline && (
                                <p className="mt-2 text-lg italic text-gray-400 sm:text-xl">
                                    "{showDetails.tagline}"
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-8 xl:flex-row">
                            {/* Left column: Video/Poster and Overview */}
                            <div className="w-full xl:w-2/3">
                                {/* Video section */}
                                <div className="relative mb-8 overflow-hidden rounded-lg shadow-2xl aspect-video">
                                    {showVideo ? (
                                        <YouTube
                                            className="w-full h-full"
                                            videoId={showVideo}
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
                                            {showDetails.poster_path ? (
                                                <img
                                                    className="object-contain w-full h-full"
                                                    src={`http://image.tmdb.org/t/p/w500${showDetails.poster_path}`}
                                                    alt={showDetails.name || "TV show poster"}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-4 text-center">
                                                    <svg className="w-16 h-16 mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                    </svg>
                                                    <p className="text-xl">No media available</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Overview */}
                                <div className="mb-8">
                                    <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Overview</h2>
                                    <p className="text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
                                        {showDetails.overview || "No overview available for this TV show."}
                                    </p>
                                </div>

                                {/* Cast section */}
                                {showDetails.credits?.cast?.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Top Cast</h2>
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                            {showDetails.credits.cast.slice(0, 5).map((person) => (
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
                                        {showDetails.genres && showDetails.genres.length > 0 ? (
                                            showDetails.genres.map((genre) => (
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

                                {/* TV Show metadata */}
                                <div className="p-6 mb-6 bg-gray-800 bg-opacity-50 rounded-lg">
                                    <h3 className="mb-3 text-xl font-bold">Show Info</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-400">First Air Date:</span>
                                            <p>{formatDate(showDetails.first_air_date)}</p>
                                        </div>
                                        {showDetails.last_air_date && (
                                            <div>
                                                <span className="text-gray-400">Last Air Date:</span>
                                                <p>{formatDate(showDetails.last_air_date)}</p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-gray-400">Status:</span>
                                            <p>{showDetails.status || "Unknown"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Seasons:</span>
                                            <p>{showDetails.number_of_seasons || 0}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Episodes:</span>
                                            <p>{showDetails.number_of_episodes || 0}</p>
                                        </div>
                                        {showDetails.episode_run_time?.length > 0 && (
                                            <div>
                                                <span className="text-gray-400">Episode Runtime:</span>
                                                <p>{showDetails.episode_run_time[0]} minutes</p>
                                            </div>
                                        )}
                                        {showDetails.networks?.length > 0 && (
                                            <div>
                                                <span className="text-gray-400">Network:</span>
                                                <p>{showDetails.networks.map(n => n.name).join(", ")}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg">
                                    <h3 className="mb-3 text-xl font-bold">Stats</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col items-center p-3 bg-gray-900 rounded-lg">
                                            <img className="w-8 h-8 mb-2" src={ICONS.likeIc} alt="Votes" />
                                            <span className="text-sm text-gray-400">Vote Count</span>
                                            <span className="text-2xl font-bold">
                                                {showDetails.vote_count?.toLocaleString() || 0}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 bg-gray-900 rounded-lg">
                                            <img className="w-8 h-8 mb-2" src={ICONS.starIc} alt="Rating" />
                                            <span className="text-sm text-gray-400">Rating</span>
                                            <span className="text-2xl font-bold">
                                                {showDetails.vote_average ? showDetails.vote_average.toFixed(1) : "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Similar Shows */}
                        {showDetails.similar?.results?.length > 0 && (
                            <div className="mt-12 mb-8">
                                <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Similar Shows</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                    {showDetails.similar.results.slice(0, 5).map(show => (
                                        <Link
                                            key={show.id}
                                            to={`/tv/${show.id}`}
                                            className="overflow-hidden transition-transform bg-gray-800 rounded-lg cursor-pointer hover:scale-105 group"
                                        >
                                            {show.poster_path ? (
                                                <img
                                                    src={`http://image.tmdb.org/t/p/w342${show.poster_path}`}
                                                    alt={show.name}
                                                    className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-48 bg-gray-700">
                                                    <span className="text-gray-500">No image</span>
                                                </div>
                                            )}
                                            <div className="p-3">
                                                <h3 className="font-bold truncate transition-colors group-hover:text-primary">{show.name}</h3>
                                                {show.first_air_date && (
                                                    <p className="text-sm text-gray-400">
                                                        {new Date(show.first_air_date).getFullYear()}
                                                    </p>
                                                )}
                                                {show.vote_average > 0 && (
                                                    <div className="flex items-center mt-1">
                                                        <svg className="w-3 h-3 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-xs text-gray-400">{show.vote_average.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
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

export default TvShowDetails;
