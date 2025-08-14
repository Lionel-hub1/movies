import { Link } from "react-router-dom";
import { ICONS } from "../data/constants";

const NoPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="max-w-md">
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 rounded-full bg-primary bg-opacity-20">
          <span className="text-5xl font-bold text-primary">404</span>
        </div>

        <h1 className="mb-4 text-5xl font-bold text-white">Page not found</h1>

        <p className="mb-8 text-lg text-bodyText">
          Sorry! We couldn't find the page you're looking for. The page may have
          been moved or doesn't exist.
        </p>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 font-semibold transition-all duration-300 rounded-lg bg-primary hover:bg-opacity-80"
          >
            Go Back Home
          </Link>

          <Link
            to="/explore"
            className="px-6 py-3 font-semibold text-white transition-all duration-300 border border-gray-600 rounded-lg hover:border-primary"
          >
            Explore Movies
          </Link>
        </div>

        <div className="flex items-center justify-center mt-12 space-x-2 text-gray-500">
          <img src={ICONS.logo} alt="Logo" className="w-8 h-8" />
          <span>Movie Explorer</span>
        </div>
      </div>
    </div>
  );
};

export default NoPage;
