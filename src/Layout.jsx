import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ICONS } from "./data/constants";
import FooterLion from "./components/FooterLion";
import { useEffect, useState } from "react";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import OfflineWarning from "./components/OfflineWarning";

const Layout = () => {
  const location = useLocation();
  const paths = [
    { path: "/", name: "Home", icon: "🏠" },
    { path: "/explore", name: "Explore", icon: "🔍" },
    { path: "/genre", name: "Genre", icon: "🎭" },
    { path: "/news", name: "News", icon: "📰" },
    { path: "/movies", name: "Movies", icon: "🎬" },
    { path: "/tvShow", name: "TV Shows", icon: "📺" },
  ];

  const activeness = "font-black text-white";
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      <OfflineWarning />
      <div className="absolute -z-[2] bg-background w-full min-h-full"></div>
      <img
        className="absolute -z-[1] max-h-[35rem] w-full object-cover object-top"
        src={ICONS.topBackground}
        alt=""
      />

      {/* Pass scrolled state to NavBar */}
      <NavBar
        paths={paths}
        activeness={activeness}
        location={location}
        scrolled={scrolled}
      />

      <main className="pt-16"> {/* Add padding top to account for fixed navbar */}
        <Outlet />
      </main>

      <FooterLion />
      <PwaInstallPrompt />
    </div>
  );
};

export default Layout;
