import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState({});

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=7bbf8e63fe34ab1b017214ade09357d1`
        );
        console.log("These are Movie details response: ", data);
        setMovieDetails(data);
      } catch (error) {
        console.error(error);
      }
    };
    getMovieDetails();
  }, [id]);

  return <div>MovieDetails for {movieDetails.title}</div>;
};

export default MovieDetails;
