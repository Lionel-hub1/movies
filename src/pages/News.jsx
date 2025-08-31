import { useState, useEffect } from "react";
import { ICONS } from "../data/constants";

const NewsCard = ({ news, featured = false }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getImageUrl = (news) => {
        return news.urlToImage || `https://images.unsplash.com/photo-1489599577372-f975b57d5814?w=600&h=400&fit=crop&crop=center`;
    };

    return featured ? (
        <div className="flex flex-col h-full col-span-1 overflow-hidden transition-all duration-300 bg-gray-800 shadow-lg md:col-span-2 rounded-xl hover:shadow-2xl md:flex-row">
            <div className="relative overflow-hidden md:w-1/2 h-60 md:h-auto">
                <img
                    src={getImageUrl(news)}
                    alt={news.title}
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
                    onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1489599577372-f975b57d5814?w=600&h=400&fit=crop&crop=center`;
                    }}
                />
                <span className="absolute px-3 py-1 text-sm font-medium text-white rounded-full top-4 left-4 bg-primary">
                    Featured
                </span>
            </div>
            <div className="flex flex-col justify-between p-6 md:w-1/2">
                <div>
                    <span className="text-sm font-semibold text-primary">
                        {news.source?.name || 'Entertainment News'}
                    </span>
                    <h2 className="mt-2 mb-4 text-xl font-bold md:text-2xl line-clamp-3">{news.title}</h2>
                    <p className="text-gray-400 line-clamp-3">{news.description || 'No description available'}</p>
                </div>
                <div className="flex items-center justify-between mt-6">
                    <span className="text-sm text-gray-500">
                        By {news.author || news.source?.name || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(news.publishedAt)}</span>
                </div>
                {news.url && (
                    <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 mt-4 text-white transition-colors rounded bg-primary hover:bg-opacity-80"
                    >
                        Read Full Article
                    </a>
                )}
            </div>
        </div>
    ) : (
        <div className="flex flex-col h-full overflow-hidden transition-all duration-300 bg-gray-800 shadow-lg rounded-xl hover:shadow-2xl">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getImageUrl(news)}
                    alt={news.title}
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
                    onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1489599577372-f975b57d5814?w=600&h=400&fit=crop&crop=center`;
                    }}
                />
                <span className="absolute px-3 py-1 text-xs text-white bg-gray-900 bg-opacity-75 rounded-full top-4 left-4">
                    {news.source?.name || 'News'}
                </span>
            </div>
            <div className="flex flex-col justify-between flex-grow p-5">
                <div>
                    <h2 className="mb-3 text-lg font-bold line-clamp-2">{news.title}</h2>
                    <p className="text-sm text-gray-400 line-clamp-3">
                        {news.description || 'No description available'}
                    </p>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <span>{news.author || news.source?.name || 'Unknown'}</span>
                    <span>{formatDate(news.publishedAt)}</span>
                </div>
                {news.url && (
                    <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-sm text-primary hover:underline"
                    >
                        Read more →
                    </a>
                )}
            </div>
        </div>
    );
};

const News = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const NEWS_API_KEY = '9150c5853f814a09a2d0a0eff71d031a';

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=movie OR cinema OR hollywood OR film OR entertainment&sortBy=publishedAt&pageSize=30&language=en&apiKey=${NEWS_API_KEY}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'error') {
                throw new Error(data.message || 'Failed to fetch news');
            }

            const transformedNews = data.articles?.filter(article =>
                article.title &&
                article.title !== '[Removed]' &&
                article.description &&
                article.description !== '[Removed]' &&
                article.urlToImage &&
                article.source?.name
            ).map((article, index) => ({
                id: index + 1,
                title: article.title,
                description: article.description,
                content: article.content,
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                source: { name: article.source?.name },
                author: article.author || article.source?.name,
                featured: index === 0
            })) || [];

            if (transformedNews.length === 0) {
                setError('No news articles found. Please try again later.');
            } else {
                setNewsItems(transformedNews);
            }

        } catch (err) {
            console.error('Error fetching news:', err);
            if (err.message.includes('429')) {
                setError('Too many requests. Please try again in a moment.');
            } else if (err.message.includes('401')) {
                setError('API key error. Please check the configuration.');
            } else if (err.message.includes('500')) {
                setError('Server error. Please try again later.');
            } else {
                setError('Unable to fetch latest news. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const filterNewsByCategory = (category) => {
        if (category === 'all') return newsItems;

        return newsItems.filter(item => {
            const searchText = (item.title + ' ' + item.description).toLowerCase();
            switch (category) {
                case 'marvel':
                    return searchText.includes('marvel') || searchText.includes('superhero') || searchText.includes('mcu');
                case 'streaming':
                    return searchText.includes('streaming') || searchText.includes('netflix') || searchText.includes('disney') || searchText.includes('hulu') || searchText.includes('amazon prime');
                case 'box office':
                    return searchText.includes('box office') || searchText.includes('opening') || searchText.includes('weekend') || searchText.includes('earnings') || searchText.includes('revenue');
                case 'festivals':
                    return searchText.includes('festival') || searchText.includes('awards') || searchText.includes('ceremony') || searchText.includes('cannes') || searchText.includes('oscar') || searchText.includes('golden globe');
                default:
                    return true;
            }
        });
    };

    const featuredNews = newsItems.find(item => item.featured);
    const filteredNews = filterNewsByCategory(activeTab);

    return (
        <div className="min-h-screen px-4 pb-16 sm:px-8 lg:px-12 text-headText">
            <div className="py-8 mx-auto max-w-7xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Bebas_Neue'] mb-6 text-center">
                    Latest Movie News & Updates
                </h1>

                <div className="flex justify-center py-2 mb-8 overflow-x-auto whitespace-nowrap">
                    <div className="flex p-1 bg-gray-800 rounded-full">
                        {['All', 'Marvel', 'Streaming', 'Box Office', 'Festivals'].map((category) => (
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
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center">
                            <span className="w-16 h-16 mb-4 animate-spin">
                                <img src={ICONS.loadingIc} alt="Loading" />
                            </span>
                            <p className="animate-pulse">Loading latest news...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="py-8 text-center">
                        <div className="max-w-md p-6 mx-auto mb-6 bg-red-900 rounded-lg bg-opacity-20">
                            <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 className="mb-2 text-lg font-bold text-red-400">Failed to Load News</h3>
                            <p className="text-red-300">{error}</p>
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={fetchNews}
                                className="px-6 py-2 mr-4 transition-colors rounded-lg bg-primary hover:bg-opacity-80"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 text-white transition-colors border border-gray-600 rounded-lg hover:border-primary"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                ) : newsItems.length === 0 ? (
                    <div className="py-16 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                        </svg>
                        <h3 className="mb-2 text-xl font-bold">No News Available</h3>
                        <p className="text-gray-400">There are no news articles available at the moment. Please try again later.</p>
                        <button
                            onClick={fetchNews}
                            className="px-6 py-2 mt-4 transition-colors rounded-lg bg-primary hover:bg-opacity-80"
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Featured News */}
                        {featuredNews && activeTab === 'all' && (
                            <NewsCard news={featuredNews} featured={true} />
                        )}

                        {/* News Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredNews
                                .filter(news => !news.featured || activeTab !== 'all')
                                .map(news => (
                                    <NewsCard key={news.id} news={news} />
                                ))}
                        </div>

                        {filteredNews.length === 0 && activeTab !== 'all' && (
                            <div className="py-16 text-center">
                                <h3 className="mb-2 text-xl font-bold">No news found in this category</h3>
                                <p className="text-gray-400">Try selecting a different category or check back later</p>
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className="px-6 py-2 mt-4 transition-colors rounded-lg bg-primary hover:bg-opacity-80"
                                >
                                    View All News
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default News;
