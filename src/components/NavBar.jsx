import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ICONS } from "../data/constants";

function NavBar({ paths, activeness, location }) {
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 30) {
      header.classList.add("bg-black"); // Change 'bg-blue-500' to the Tailwind CSS class for the color you want
    } else {
      header.classList.remove("bg-black");
    }
  });

  return (
    <header className="text-gray-600 h-28 body-font sticky top-0 z-50 transition-colors duration-300">
      <div className="flex justify-between py-5 px-14 flex-col md:flex-row items-center">
        <Link
          to="/"
          className="flex w-1/2 title-font font-medium items-center mb-4 md:mb-0 space-x-3"
        >
          <img className="w-14 h-14" src={ICONS.logo} alt="" />
          <img src={ICONS.brand} alt="" />
        </Link>
        <nav className="md:ml-auto w-1/2 flex flex-wrap font-semibold items-center text-headText justify-center space-x-10">
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
