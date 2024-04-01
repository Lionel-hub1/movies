import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MovieCard = ({ item }) => {
  return item ? (
    <Link
      to={`/movie/${item.id}`}
      className="group flex flex-col min-w-[13rem]"
    >
      <img
        className="w-full min-h-64 object-cover transition ease-in-out duration-300 transform group-hover:scale-[1.02]"
        src={`http://image.tmdb.org/t/p/w500${item.poster_path}`}
        alt=""
      />
      <div className="flex flex-col ">
        <span className="text-2xl font-bold font-['Bebas_Neue'] line-clamp-1">
          {item.title || "Title"}
        </span>
        <div className="flex justify-between text-md items-center mt-4">
          <span>
            {item.release_date ? item.release_date.slice(0, 4) : "None"}
          </span>
          <span className="flex items-center space-x-1">
            <div className="w-1 h-1 rounded-full inline-flex bg-primary"></div>
            <span>
              {item.vote_average ? item.vote_average.toFixed(1) : "None"}
            </span>
          </span>
        </div>
      </div>
    </Link>
  ) : (
    "Null item"
  );
};

MovieCard.propTypes = {
  item: PropTypes.object.isRequired,
};

export default MovieCard;
