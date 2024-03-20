import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ICONS } from "../data/constants";

function NavBar({ paths, activeness, location }) {
  return (
    <header className="text-gray-600 h-28 body-font sticky top-0 z-10">
      <div className="container mx-auto flex flex-wrap py-5 px-14 flex-col md:flex-row items-center">
        <Link
          to="/"
          className="flex title-font font-medium items-center mb-4 md:mb-0 space-x-3"
        >
          <img className="w-10 h-10" src={ICONS.logo} alt="" />
          <img src={ICONS.brand} alt="" />
        </Link>
        <nav className="md:ml-auto flex flex-wrap font-semibold items-center text-headText justify-center space-x-10">
          {paths.map((path, index) => {
            return (
              <Link
                key={index}
                to={path.path}
                className={`font-['Inter'] text-2xl ${
                  location.pathname === path.path ? activeness : "font-normal"
                } hover:text-[#fff] transition duration-300 ease-in-out`}
              >
                {path.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

NavBar.propTypes = {
  paths: PropTypes.array,
  activeness: PropTypes.string,
  location: PropTypes.object,
};

export default NavBar;
