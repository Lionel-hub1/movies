import { useState, useEffect } from "react";
import { ICONS } from "../data/constants";

// Mock news data since we don't have a news API
const mockNewsData = [
    {
        id: 1,
        title: "Avatar 3 Delayed Again, James Cameron Cites Technical Challenges",
        excerpt: "James Cameron's third installment in the Avatar franchise faces new delays as the team works through complex visual effects and underwater filming challenges.",
        date: "2023-07-15",
        author: "Michael Scott",
        category: "Production",
        image: "https://source.unsplash.com/random/600x400/?avatar",
        featured: true
    },
    {
        id: 2,
        title: "Marvel Announces New Slate of Films for Phase 5",
        excerpt: "Kevin Feige revealed Marvel's ambitious plans for the next few years, including new heroes and returning favorites in the MCU's expanding multiverse saga.",
        date: "2023-08-02",
        author: "Sarah Johnson",
        category: "Announcements",
        image: "https://source.unsplash.com/random/600x400/?marvel"
    },
    {
        id: 3,
        title: "Christopher Nolan's Next Film to Focus on Quantum Physics",
        excerpt: "After the success of 'Oppenheimer', Nolan is reportedly developing a new project that will explore the stranger aspects of quantum mechanics and time dilation.",
        date: "2023-07-28",
        author: "David Mitchell",
        category: "Development",
        image: "https://source.unsplash.com/random/600x400/?science"
    },
    {
        id: 4,
        title: "Streaming Wars Intensify as New Platform Launches",
        excerpt: "A new contender enters the crowded streaming market with exclusive content and aggressive pricing, challenging established services like Netflix and Disney+.",
        date: "2023-08-05",
        author: "Emily Richards",
        category: "Industry",
        image: "https://source.unsplash.com/random/600x400/?streaming"
    },
    {
        id: 5,
        title: "Iconic Hollywood Studio Celebrates 100 Years",
        excerpt: "One of Hollywood's oldest studios marks its centennial with special releases, events, and a documentary chronicling its impact on cinema history.",
        date: "2023-07-20",
        author: "Robert Turner",
        category: "History",
        image: "https://source.unsplash.com/random/600x400/?hollywood"
    },
    {
        id: 6,
        title: "Breakthrough CGI Technology Promises to Revolutionize Special Effects",
        excerpt: "A new rendering system developed by leading VFX company allows for real-time photorealistic effects that could significantly reduce post-production time.",
        date: "2023-08-10",
        author: "Alicia Chen",
        category: "Technology",
        image: "https://source.unsplash.com/random/600x400/?cgi"
    }
];

const NewsCard = ({ news, featured = false }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return featured ? (
        <div className="col-span-1 md:col-span-2 bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row h-full">
            <div className="md:w-1/2 h-60 md:h-auto relative overflow-hidden">
                <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                </span>
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between">
                <div>
                    <span className="text-primary text-sm font-semibold">{news.category}</span>
                    <h2 className="text-xl md:text-2xl font-bold mt-2 mb-4">{news.title}</h2>
                    <p className="text-gray-400">{news.excerpt}</p>
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <span className="text-sm text-gray-500">By {news.author}</span>
                    <span className="text-sm text-gray-500">{formatDate(news.date)}</span>
                </div>
            </div>
        </div>
    ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
            <div className="h-48 relative overflow-hidden">
                <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <span className="absolute top-4 left-4 bg-gray-900 bg-opacity-75 text-white px-3 py-1 rounded-full text-xs">
                    {news.category}
                </span>
            </div>
            <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                    <h2 className="text-lg font-bold mb-3">{news.title}</h2>
                    <p className="text-sm text-gray-400 line-clamp-3">{news.excerpt}</p>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                    <span>{news.author}</span>
                    <span>{formatDate(news.date)}</span>
                </div>
            </div>
        </div>
    );
};

const News = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        // Simulating API loading delay
        const timer = setTimeout(() => {
            setNewsItems(mockNewsData);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const filterNewsByCategory = (category) => {
        if (category === 'all') return newsItems;
        return newsItems.filter(item => item.category.toLowerCase() === category.toLowerCase());
    };

    const featuredNews = newsItems.find(item => item.featured);
    const filteredNews = filterNewsByCategory(activeTab);

    return (
        <div className="min-h-screen px-4 sm:px-8 lg:px-12 pb-16 text-headText">
            <div className="py-8 max-w-7xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Bebas_Neue'] mb-6 text-center">
                    Latest Movie News & Updates
                </h1>

                <div className="flex justify-center mb-8 overflow-x-auto whitespace-nowrap py-2">
                    <div className="bg-gray-800 rounded-full p-1 flex">
                        {['All', 'Announcements', 'Production', 'Industry', 'Technology'].map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveTab(category.toLowerCase())}
                                className={`px-4 py-2 rounded-full text-sm transition-all ${activeTab === category.toLowerCase()
                                        ? "bg-primary text-white"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <span className="w-16 h-16 animate-spin mb-4">
                                <img src={ICONS.loadingIc} alt="Loading" />
                            </span>
                            <p className="animate-pulse">Loading news...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Featured News */}
                        {featuredNews && activeTab === 'all' && (
                            <NewsCard news={featuredNews} featured={true} />
                        )}

                        {/* News Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNews
                                .filter(news => !news.featured || activeTab !== 'all')
                                .map(news => (
                                    <NewsCard key={news.id} news={news} />
                                ))}
                        </div>

                        {filteredNews.length === 0 && (
                            <div className="text-center py-16">
                                <h3 className="text-xl font-bold mb-2">No news found in this category</h3>
                                <p className="text-gray-400">Try selecting a different category</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
