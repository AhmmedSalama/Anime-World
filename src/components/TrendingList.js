import { useEffect, useState } from "react";
import { Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function TrendingList() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.jikan.moe/v4/top/anime?limit=5")
      .then((res) => res.json())
      .then((data) => {
        setAnimes(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trending anime:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-white text-center">Loading trending anime...</p>;
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-4">
      <ul className="space-y-4">
        {animes.map((anime, index) => (
          <li
            key={anime.mal_id}
            
          >
            <Link to={`/AnimeDetails/${anime.mal_id}`} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition overflow-hidden">
            <span className="text-gray-400 font-bold w-6 text-right">
              {String(index + 1).padStart(2, "0")}
            </span>

            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              className="w-12 h-16 object-cover rounded-md"
            />

            <div className="flex-1">
              <h3 className="text-white text-sm truncate">{anime.title}</h3>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {anime.members}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={14} /> {anime.favorites}
                </span>
              </div>
            </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrendingList;
  