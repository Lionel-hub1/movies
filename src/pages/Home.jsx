import { useState } from "react";
import CustomButton from "../components/CustomButton";
import MovieCard from "../components/MovieCard";
import { ICONS } from "../data/constants";
import { useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [mayLike, setMayLike] = useState([]);
  const getMovies = async () => {
    try {
      const { data } = await axios.get(
        "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=7bbf8e63fe34ab1b017214ade09357d1"
      );
      setMovies(data.results.slice(0, 12));
      setMayLike(data.results.slice(8, 24));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="text-bodyText px-20 h-full">
      <div className="flex items-end h-[45rem]">
        <div className="relative flex flex-col h-[26rem] border-r-[2px] border-linesColor w-[50%] bottom-0">
          <span className="absolute inline-flex h-[1px] w-1/3 right-0 bg-linesColor"></span>
          <span className="font-['Bebas_Neue'] text-7xl font-normal">
            Find movies
          </span>
          <span className="font-['Bebas_Neue'] text-8xl font-normal top-grad">
            TV shows and more
          </span>
          <p className="py-8 text-lg w-[62ch]">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis
            nisi nesciunt, exercitationem voluptatibus dolores ea consequuntur,
            incidunt commodi odio minima alias voluptas itaque eaque, aliquid
            et. Explicabo deserunt non necessitatibus.
          </p>
          <CustomButton value="Watch Tutorial" />
        </div>
        <div className="relative flex flex-col p-2 h-[45rem] w-[50%] bottom-0 right-0 border-b-[2px] border-linesColor">
          <div className="relative flex w-full h-full items-center justify-center">
            <div className="absolute w-[28rem] bottom-0 left-0 z-10">
              <div className="relative w-full h-full">
                <img
                  className="absolute top-0 bottom-0 my-auto right-0 left-0 mx-auto w-30 h-30 object-cover"
                  src={ICONS.playIc}
                  alt=""
                />
                <img
                  className="w-full h-full object-cover"
                  src={ICONS.topFrontImg}
                  alt=""
                />
              </div>
            </div>
            <img
              className="absolute w-[28rem] top-0 right-0"
              src={ICONS.topBackImg}
              alt=""
            />
          </div>
          <div className="absolute bottom-0 right-0 w-2 h-2 -mb-1 rounded-full inline-flex bg-linesColor"></div>
        </div>
      </div>
      <div className="w-full">
        <div className="w-full flex items-center my-6">
          <span className="text-4xl w-fit font-bold">
            <span className="flex">
              <img src={ICONS.fireIc} alt="" />
              Trending
            </span>
          </span>
          <span className="inline-flex h-[1px] mx-10 w-full bg-linesColor"></span>
          <span className="break-before-all">See&nbsp;More</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 space-x-2 space-y-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} item={movie} />
          ))}
        </div>
        <div className="w-full flex items-center my-6">
          <span className="text-4xl w-fit font-bold">
            <span className="flex">
              {/* <img src={ICONS.fireIc} alt="" /> */}
              YOU&nbsp;MAY&nbsp;ALSO&nbsp;LIKE&nbsp;THIS
            </span>
          </span>
          <span className="inline-flex h-[1px] mx-10 w-full bg-linesColor"></span>
          <span className="break-before-all">See&nbsp;More</span>
        </div>
        <div className="grid grid-cols-6 space-x-2 space-y-5">
          {mayLike.map((movie) => (
            <MovieCard key={movie.id} item={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
