import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import MovieDetails from "./pages/MovieDetails";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Genre from "./pages/Genre";
import News from "./pages/News";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/genre" element={<Genre />} />
          <Route path="/news" element={<News />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tvShow" element={<TvShows />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="login/" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
