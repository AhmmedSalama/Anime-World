import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function NewSeason() {
  const [seasonAnime, setSeasonAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  function getNewSeasonAnime() {
    fetch("https://api.jikan.moe/v4/seasons/now")
      .then((response) => response.json())
      .then((data) => {
        setSeasonAnime(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching new season anime:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    getNewSeasonAnime();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0d0d0d]">
        <div className="flex flex-col items-center">
          {/* دائرة تحميل */}
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg font-medium">Loading anime...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="NewSeason p-4 flex items-center justify-center">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">
          New Season Animes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {seasonAnime.map((anime) => (
            <Link
              key={anime.mal_id}
              to={`/AnimeDetails/${anime.mal_id}`}
              className="block bg-[#1a1a1a] p-4 rounded-xl hover:bg-[#222] transition transform hover:scale-[1.03]"
            >
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-64 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold text-white truncate">
                {anime.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {anime.type} • {anime.episodes || "?"} EP
              </p>
              <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                {anime.synopsis || "No synopsis available."}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewSeason;
