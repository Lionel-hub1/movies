import PropTypes from "prop-types";

const MovieCard = ({ item }) => {
  return (
    <div className="flex flex-col w-[13rem]">
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
          <span className="text-sm">{item.vote_count}</span>
          <span className="text-sm">{item.vote_average}</span>
        </div>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  item: PropTypes.object.isRequired,
};

export default MovieCard;
