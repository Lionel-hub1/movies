import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ICONS } from "../data/constants";
import { useState } from "react";

function NavBar({ paths, activeness, location }) {
  const [toggle, setToggle] = useState(true);

  window.addEventListener("resize", function () {
    setToggle(true);
  });

  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 30) {
      header.classList.add("bg-black"); // Change 'bg-blue-500' to the Tailwind CSS class for the color you want
    } else {
      header.classList.remove("bg-black");
    }
  });

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <header className="text-gray-600 h-28 body-font sticky top-0 z-50 transition-colors duration-300">
      <div className="flex justify-between py-5 px-14 2xl:flex-row items-center">
        <Link
          to="/"
          className="flex w-1/2 title-font font-medium items-center mb-4 md:mb-0 space-x-3"
        >
          <img className="w-14 h-14" src={ICONS.logo} alt="" />
          <img src={ICONS.brand} alt="" />
        </Link>
        <nav
          className={`${
            toggle ? "hidden 2xl:flex" : "flex absolute top-0 right-0"
          } bg-background 2xl:bg-transparent flex-col 2xl:flex-row md:ml-auto 2xl:w-1/2 font-semibold items-center text-headText justify-center space-x-10`}
        >
          <div className="2xl:hidden cursor-pointer">
            <svg
              className="text-gray-300"
              onClick={() => handleToggle()}
              height="2rem"
              width="2rem"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          {paths.map((path, index) => {
            return (
              <Link
                key={index}
                to={path.path}
                className={`font-['Inter'] text-xl ${
                  location.pathname === path.path ? activeness : "font-normal"
                } hover:text-[#fff] transition duration-300 ease-in-out`}
              >
                {path.name}
              </Link>
            );
          })}
        </nav>
        <div className="2xl:hidden cursor-pointer">
          <svg
            className={``}
            onClick={() => handleToggle()}
            viewBox="0 0 512 512"
            fill="white"
            height="1.4em"
            width="1.5em"
          >
            <path d="M0 96c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm64 160c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zm384 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h384c17.7 0 32 14.3 32 32z" />
          </svg>
        </div>
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
