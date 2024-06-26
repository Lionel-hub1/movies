import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { ICONS } from "../data/constants";

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState({});
  const [movieVideo, setMovieVideo] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setIsLoggedIn(true);
    }
    const getMovieDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=7bbf8e63fe34ab1b017214ade09357d1&append_to_response=videos`
        );
        setMovieDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    const getMovieVideo = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=7bbf8e63fe34ab1b017214ade09357d1`
        );
        
        setMovieVideo(data.results[0].key || data.results[0].key);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getMovieDetails();
    getMovieVideo();
  }, [id, isLoggedIn]);

  return (
    <>
      {loading ? (
        <div className="h-full text-white flex justify-center items-center">
          <span className="w-20 h-20 animate-spin">
            <img src={ICONS.loadingIc} alt="" />
          </span>
        </div>
      ) : (
        movieDetails.title && (
          <div className="relative w-full lg:px-14 text-white flex justify-center items-center">
            <img
              className="w-full max-h-screen object-cover object-top absolute z-[4] opacity-5 "
              src={`http://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt=""
            />
            <div className={` flex flex-col xl:flex-row`}>
              <div className="relative z-30 w-full xl:w-1/2 h-[20rem] lg:h-[30rem] xl:h-auto">
                {!isLoggedIn && (
                  <div className="absolute flex font['Inter'] flex-col text-xl space-y-3 items-center justify-center w-full h-full bg-black bg-opacity-90">
                    <p>You are not signed in...</p>
                    <button
                      onClick={() => {
                        navigate("/login", {
                          state: { prevLocation: location.pathname },
                        });
                      }}
                      className="bg-primary py-1 text-2xl font-black px-3 rounded-lg"
                    >
                      Login
                    </button>
                    <p>to play the movie</p>
                  </div>
                )}
                <YouTube
                  className="z-30 w-screen xl:w-full h-full object-cover object-top"
                  videoId={movieVideo}
                  opts={{
                    height: "100%",
                    width: "100%",
                    playerVars: {
                      autoplay: 0,
                      modestbranding: 1,
                      loop: 1,
                    },
                  }}
                />
              </div>
              <div className="z-10 px-8 w-full h-auto mt-5 xl:mt-0 xl:w-1/2 flex flex-col xl:px-5">
                <h1 className="text-3xl lg:text-7xl font-bold font-['Bebas_Neue']">
                  {movieDetails.title}
                </h1>
                <div className="flex flex-wrap space-x-1 lg:space-x-3">
                  {movieDetails
                    ? movieDetails.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="flex flex-wrap py-1 px-2 lg:px-3 text-xs lg:text-lg font-['Inter'] text-headText bg-slate-400 bg-opacity-55 rounded"
                        >
                          #{genre.name}
                        </span>
                      ))
                    : ""}
                </div>

                <p className="lg:text-2xl font-['Inter'] text-bodyText py-4">
                  {movieDetails.overview}
                </p>
                <span className="text-sm lg:text-xl font-['Inter'] text-headText">
                  Runtime: {movieDetails.runtime} minutes
                </span>
                <span className="text-sm lg:text-xl font-['Inter'] text-headText">
                  Release Date: {movieDetails.release_date}
                </span>
                <div className="flex h-full justify-between items-center mt-5">
                  <span className="flex items-center space-x-3">
                    <span className="text-lg text-primary">
                      <img
                        className="w-6 h-6 lg:w-8 lg:h-8"
                        src={ICONS.likeIc}
                        alt=""
                      />
                    </span>
                    <span className="text-lg lg:text-3xl">
                      {movieDetails.vote_count}
                    </span>
                  </span>
                  <span className="flex items-center space-x-3">
                    <img
                      className="w-6 h-6 lg:w-8 lg:h-8"
                      src={ICONS.starIc}
                      alt=""
                    />
                    <span className="text-lg lg:text-3xl">
                      {movieDetails.vote_average.toFixed(1)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default MovieDetails;
