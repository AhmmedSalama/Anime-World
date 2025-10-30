import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AnimeList() {
  const [AllAnime, SetAllAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  function getAllAnime() {
    fetch("https://api.jikan.moe/v4/anime")
      .then((response) => response.json())
      .then((data) => {
        SetAllAnime(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching anime:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    getAllAnime(); // ✅ هنا بنستدعي الفنكشن
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
    <div className="AnimeList p-4 flex items-center justify-center">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Anime List</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AllAnime.map((anime) => (
            <Link
              to={`/AnimeDetails/${anime.mal_id}`}
              key={anime.mal_id}
              className="bg-[#1a1a1a] p-4 rounded-xl hover:bg-[#2a2a2a] transition duration-300 shadow-md hover:shadow-lg"
            >
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-64 object-cover rounded-lg mb-3"
              />
              <h1 className="text-white text-lg font-semibold">
                {anime.title}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {anime.type} • {anime.episodes || "?"} Episodes
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnimeList;
