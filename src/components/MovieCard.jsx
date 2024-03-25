import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MovieCard = ({ item }) => {
  return (
    <Link to={`/movie/${item.id}`} className="cursor flex flex-col w-[13rem]">
      <img
        className="w-full h-64 object-cover"
        src={`http://image.tmdb.org/t/p/w500${item.poster_path}`}
        alt=""
      />
      <div className="flex flex-col ">
        <span className="text-lg font-bold line-clamp-1">
          {item.title || "Title"}
        </span>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm">{item.release_date.slice(0, 4)}</span>
          <span className="flex items-center space-x-1">
            <div className="w-1 h-1 rounded-full inline-flex bg-primary"></div>
            <span className="text-sm">{item.vote_average.toFixed(1)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

MovieCard.propTypes = {
  item: PropTypes.object.isRequired,
};

export default MovieCard;
