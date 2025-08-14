import { Link } from "react-router-dom";
import { ICONS } from "../data/constants";

const FooterLion = () => {
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    const socialLinks = [
        { name: "Facebook", icon: "fab fa-facebook-f", url: "#" },
        { name: "Twitter", icon: "fab fa-twitter", url: "#" },
        { name: "Instagram", icon: "fab fa-instagram", url: "#" }
    ];

    const sections = [
        {
            title: "Navigation",
            links: [
                { name: "Home", url: "/" },
                { name: "Movies", url: "/movies" },
                { name: "TV Shows", url: "/tvShow" },
                { name: "Genre", url: "/genre" }
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Terms of Use", url: "#" },
                { name: "Privacy Policy", url: "#" },
                { name: "Cookie Policy", url: "#" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "FAQ", url: "#" },
                { name: "Contact Us", url: "#" },
                { name: "Help Center", url: "#" }
            ]
        }
    ];

    return (
        <footer className="bg-gray-900 mt-12">
            <div className="container px-4 py-12 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo and Description */}
                    <div>
                        <div className="flex items-center mb-4 space-x-2">
                            <img className="w-8 h-8" src={ICONS.logo} alt="Logo" />
                            <img src={ICONS.brand} alt="Brand" className="h-6" />
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            Discover the best movies and TV shows from around the world, all in one place.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    aria-label={link.name}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-primary hover:text-white transition-colors"
                                >
                                    <i className={link.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    {sections.map((section, index) => (
                        <div key={index}>
                            <h3 className="mb-4 text-lg font-bold text-white">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            to={link.url}
                                            className="text-sm text-gray-400 hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Copyright */}
            <div className="py-4 bg-black bg-opacity-40">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
                        <p className="text-sm text-gray-500">
                            © {getCurrentYear()} Movie Explorer — All rights reserved
                        </p>
                        <p className="text-sm text-gray-500">
                            Developed by {" "}
                            <a
                                href="mailto:ndabagajeanlionel@gmail.com"
                                className="text-primary hover:underline"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                @lionel
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterLion;