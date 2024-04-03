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
    <div className="text-bodyText px-8 lg:px-20 h-full">
      <div className="flex xl:items-end lg:h-[45rem]">
        <div className="relative items-center xl:items-start w-full flex flex-col min-h-[26rem] xl:border-r-[1px] xl:border-linesColor xl:w-[50%] bottom-0">
          <span className="absolute hidden xl:inline-flex h-[1px] w-1/3 right-0 bg-linesColor"></span>
          <span className="font-['Bebas_Neue'] text-4xl lg:text-7xl font-normal">
            Find movies
          </span>
          <span className="font-['Bebas_Neue'] text-5xl text-center lg:text-start lg:text-8xl font-normal top-grad">
            TV shows and more
          </span>
          <p className="py-8 lg:px-0 text-center xl:text-start px-4 text-lg line-clamp-4 lg:line-clamp-none">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facilis
            nisi nesciunt, exercitationem voluptatibus dolores ea consequuntur,
            incidunt commodi odio minima alias voluptas itaque eaque, aliquid
            et. Explicabo deserunt non necessitatibus.
          </p>
          <CustomButton value="Watch Tutorial" />
        </div>
        <div className="relative hidden xl:block p-10 h-[45rem] w-[50%] bottom-0 right-0 xl:border-b-[1px] xl:border-linesColor">
          <div className="relative flex w-full h-full items-center justify-center">
            <div className="absolute w-2/3 h-5/6 bottom-0 left-0 z-10">
              <div className="relative w-full h-full">
                <img
                  className="absolute top-0 bottom-0 my-auto right-0 left-0 mx-auto w-30 h-30 object-cover"
                  src={ICONS.playIc}
                  alt=""
                />
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={ICONS.topFrontImg}
                  alt=""
                />
              </div>
            </div>
            <img
              className="absolute w-2/3 h-5/6 rounded-lg top-0 right-0 object-cover"
              src={ICONS.topBackImg}
              alt=""
            />
          </div>
          <div className="absolute bottom-0 right-0 w-2 h-2 -mb-1 rounded-full inline-flex bg-linesColor"></div>
        </div>
      </div>
      <div className="w-full">
        <div className="w-full flex items-center my-6">
          <div className="text-lg mr-3 inline-flex lg:text-4xl w-full font-bold">
            <span className="flex items-center">
              <img src={ICONS.fireIc} alt="" />
              Trending
            </span>
          </div>
          <div className="inline-flex h-[1px] w-full bg-linesColor"></div>
          <div className="inline-flex ">See&nbsp;More</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-10">
          {movies.map((movie) => (
            <MovieCard key={movie.id} item={movie} />
          ))}
        </div>
        <div className="w-full flex items-center my-6">
          <span className="text-4xl font-bold">
            <div className="flex">YOU MAY ALSO LIKE THIS</div>
          </span>
          <span className="hidden xl:inline-flex h-[1px] mx-10 w-full bg-linesColor"></span>
          <span className="hidden xl:inline-flex ">See&nbsp;More</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-10">
          {mayLike.map((movie) => (
            <MovieCard key={movie.id} item={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
