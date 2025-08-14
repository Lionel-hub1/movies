import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { ICONS } from "../data/constants";
import { useState, useEffect } from "react";

function NavBar({ paths, activeness, location, scrolled }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status on component mount and when localStorage changes
    const checkLoginStatus = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();

    // Listen for storage events (for multi-tab support)
    window.addEventListener("storage", checkLoginStatus);

    // Close menu on resize to desktop view
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-background shadow-lg" : ""
        }`}
    >
      <div className="flex items-center justify-between py-4 px-4 sm:px-8 lg:px-14">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3"
          aria-label="Go to homepage"
        >
          <img className="w-10 h-10 sm:w-12 sm:h-12" src={ICONS.logo} alt="" />
          <img src={ICONS.brand} alt="Movies" className="hidden sm:block h-6" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-8">
          {paths.map((path, index) => (
            <Link
              key={index}
              to={path.path}
              className={`font-['Inter'] text-base transition-colors duration-300 ${location.pathname === path.path
                  ? activeness
                  : "text-headText hover:text-white"
                }`}
            >
              <span className="flex items-center space-x-1">
                {path.icon && <span>{path.icon}</span>}
                <span>{path.name}</span>
              </span>
            </Link>
          ))}
        </nav>

        {/* User actions */}
        <div className="flex items-center space-x-4">
          {/* Search button */}
          <button
            className="hidden md:flex items-center text-headText hover:text-white"
            onClick={() => navigate("/explore")}
            aria-label="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>

          {/* User menu or login button */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden md:block">{user?.name || "User"}</span>
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl z-50">
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Signed in as{" "}
                    <span className="font-medium text-white">{user?.email}</span>
                  </div>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              state={{ prevLocation: location.pathname }}
              className="py-2 px-4 bg-primary rounded-lg text-white hover:bg-opacity-80 transition-colors text-sm md:text-base"
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="xl:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="xl:hidden bg-gray-900 pb-4 px-4 sm:px-8 space-y-1 border-t border-gray-800"
        >
          {paths.map((path, index) => (
            <Link
              key={index}
              to={path.path}
              className={`block py-3 text-base ${location.pathname === path.path
                  ? "text-white font-bold"
                  : "text-headText"
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center space-x-2">
                {path.icon && <span>{path.icon}</span>}
                <span>{path.name}</span>
              </span>
            </Link>
          ))}

          {isLoggedIn && (
            <button
              className="block w-full text-left py-3 text-red-400 hover:text-red-300"
              onClick={logout}
            >
              Sign out
            </button>
          )}
        </nav>
      )}
    </header>
  );
}

NavBar.propTypes = {
  paths: PropTypes.array.isRequired,
  activeness: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  scrolled: PropTypes.bool,
};

export default NavBar;
