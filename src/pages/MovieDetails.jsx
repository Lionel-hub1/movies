import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";

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
        <div className="h-full animate-ping text-white flex justify-center items-center">
          <h1 className="text-3xl">Loading...</h1>
        </div>
      ) : (
        <div className="relative w-full px-14 text-white flex justify-center items-center">
          <img
            className="w-1/2 absolute hidden"
            src={`http://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
            alt=""
          />
          <div className={"flex bg-[url()]"}>
            <YouTube
              className="z-50 w-1/2"
              videoId={movieVideo}
              opts={{
                height: "590",
                width: "100%",
                playerVars: {
                  autoplay: 0,
                  controls: 0,
                  modestbranding: 1,
                  loop: 1,
                },
              }}
            />
            <div className="w-1/2 flex flex-col px-5">
              <h1 className="text-7xl font-bold font-['Bebas_Neue']">
                {movieDetails.title}
              </h1>
              {/* Genres */}
              <div className="flex space-x-3">
                {movieDetails.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="py-1 px-3 text-lg font-['Inter'] text-headText bg-slate-400 bg-opacity-55 rounded"
                  >
                    #{genre.name}
                  </span>
                ))}
              </div>
              <p className="text-2xl font-['Inter'] text-bodyText py-4">
                {movieDetails.overview}
              </p>
              <span className="text-xl font-['Inter'] text-headText">
                Runtime: {movieDetails.runtime} minutes
              </span>
              <span className="text-xl font-['Inter'] text-headText">
                Release Date: {movieDetails.release_date}
              </span>
              <div className="flex h-full justify-between items-center mt-5">
                <span className="space-x-3">
                  <span className="text-lg text-primary">votes:</span>
                  <span className="text-3xl">{movieDetails.vote_count}</span>
                </span>
                <span className="space-x-3">
                  <span className="text-lg text-primary">Rating:</span>
                  <span className="text-3xl">{movieDetails.vote_average}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieDetails;
