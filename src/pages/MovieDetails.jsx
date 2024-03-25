import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState({});
  const [movieVideo, setMovieVideo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=7bbf8e63fe34ab1b017214ade09357d1`
        );
        console.log("These are Movie details response: ", data);
        setMovieDetails(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    const getMovieVideo = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=7bbf8e63fe34ab1b017214ade09357d1`
        );
        console.log("These are Movie video response: ", data.results[0]);
        setMovieVideo(data.results[0].key);
      } catch (error) {
        console.error(error);
      }
    };
    getMovieDetails();
    getMovieVideo();
  }, [id]);

  return (
    <>
      {loading ? (
        <div className="h-full animate-ping text-white w-screen flex justify-center items-center">
          <h1 className="text-3xl">Loading...</h1>
        </div>
      ) : (
        <div className="min-h-screen w-screen text-white flex justify-center items-center">
          <div className="flex">
            <img
              className="w-1/2"
              src={`http://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt=""
            />
            <div className="w-1/2 px-4 flex flex-col">
              <video
                className="h-32"
                src={`https://www.youtube.com/watch?v=${movieVideo}`}
                controls
              />
              <h1 className="text-9xl font-bold">{movieDetails.title}</h1>
              <p className="text-4xl">{movieDetails.overview}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieDetails;
