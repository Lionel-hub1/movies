import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState } from "react";

const MovieCard = ({ item, size = "normal" }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!item) return null;

  const defaultPoster = "https://via.placeholder.com/300x450?text=No+Image";
  const posterUrl = item.poster_path
    ? `http://image.tmdb.org/t/p/w500${item.poster_path}`
    : defaultPoster;

  const releaseYear = item.release_date
    ? new Date(item.release_date).getFullYear()
    : "N/A";

  const rating = item.vote_average
    ? item.vote_average.toFixed(1)
    : "N/A";

  // Calculate classes based on size
  const cardSizeClasses = {
    small: "min-w-[10rem]",
    normal: "min-w-[13rem]",
    large: "min-w-[16rem]"
  };

  const imageHeightClasses = {
    small: "min-h-[15rem]",
    normal: "min-h-[20rem]",
    large: "min-h-[24rem]"
  };

  return (
    <Link
      to={`/movie/${item.id}`}
      className={`group flex flex-col ${cardSizeClasses[size]} overflow-hidden bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          className={`w-full ${imageHeightClasses[size]} object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          src={imageError ? defaultPoster : posterUrl}
          alt={item.title || "Movie poster"}
          onError={() => setImageError(true)}
        />

        {/* Overlay with additional information on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 flex flex-col justify-end opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}>
          <div className="transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            {item.overview && (
              <p className="text-sm text-gray-300 line-clamp-3 mb-2">{item.overview}</p>
            )}
            <button className="bg-primary text-white text-sm py-1 px-3 rounded mt-2 hover:bg-opacity-80 transition-colors">
              View Details
            </button>
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1 px-2 text-xs font-bold">
          {rating} ★
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-lg font-bold text-white font-['Bebas_Neue'] line-clamp-1">
          {item.title || "Untitled"}
        </h3>

        <div className="flex justify-between text-sm text-gray-400 items-center mt-2">
          <span>{releaseYear}</span>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 rounded-full inline-flex bg-primary"></div>
            <span>{item.original_language?.toUpperCase() || "EN"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

MovieCard.propTypes = {
  item: PropTypes.object.isRequired,
  size: PropTypes.oneOf(["small", "normal", "large"])
};

export default MovieCard;
