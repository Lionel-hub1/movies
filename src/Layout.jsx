import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ICONS } from "./data/constants";

const Layout = () => {
  const location = useLocation();
  const paths = [
    { path: "/", name: "Home" },
    { path: "/Explore", name: "Explore" },
    { path: "/genre", name: "Genre" },
    { path: "/news", name: "News" },
    { path: "/movies", name: "Movies" },
    { path: "/tvShow", name: "TvShows" },
  ];
  const activeness = "font-black text-white";

  return (
    <>
      <div className="relative h-full w-full bg-background">
        <div></div>
        <img
          className="absolute h-[40rem] w-full"
          src={ICONS.topBackground}
          alt=""
        />
        <NavBar paths={paths} activeness={activeness} location={location} />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
