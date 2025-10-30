import { Link } from "react-router-dom";
import TrendingList from "../components/TrendingList";
import { useEffect, useState } from "react";
function Home() {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.jikan.moe/v4/seasons/now")
      .then((res) => res.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.data.length);
        setAnime(data.data[randomIndex]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching anime:", error);
        setLoading(false);
      });
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

  const bgImage =
    anime?.images?.jpg?.large_image_url || anime?.images?.webp?.large_image_url;
  return (
    <div className="home-pag bg-black p-4 flex items-center justify-center">
      <div className="container">
      {/* الجريد */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* قسم New - ياخد 7 أعمدة */}
        <div className="md:col-span-7  rounded-2xl shadow-lg ">
          <h2 className="text-2xl font-bold mb-4 text-white  pb-2">
            ✨ New
          </h2>
              <div className="relative rounded-2xl overflow-hidden h-[526px]">
      {/* الصورة */}
      <img
        src={bgImage}
        alt={anime.title}
        className="w-full h-full object-center"
      />

      {/* طبقة شفافة فوق الصورة */}
      <Link to={`/AnimeDetails/${anime.mal_id}`} className="absolute inset-0 bg-black/50"></Link>

      {/* النص فوق الصورة */}
      <div className="absolute bottom-0 left-0 p-6">
        <p  className="text-sm  text-white">Home | TV</p>
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">
          {anime.title}
        </h1>
        <p className="text-gray-300 mt-2 text-sm">
          {anime.type} • EP {anime.episodes || "?"}
        </p>
          <p className="text-gray-300 mt-2 text-sm">
          {anime.synopsis.slice(0,400)}...
        </p>
      </div>
            </div>
           
        </div>

        {/* قسم Trending - ياخد الباقي (5 أعمدة) */}
        <div className="md:col-span-5  rounded-2xl">
          <h2 className="text-2xl font-bold mb-4 text-white  pb-2">
            ✨ Trending
          </h2>
          <TrendingList />
        </div>
      </div>
      <div className="bg-[#ffffff] h-[250px] w-full mt-5 rounded-lg relative ">
        <img
        src={bgImage}
        alt={anime.title}
        className=" h-full w-2/5 absolute right-0 top-0 object-fill rounded-lg "
      />

      <div className="absolute inset-0 bg-black/50"></div>

          <div className="z-10 absolute p-6">
        <h3 className="uppercase font-semibold text-2xl  text-white">
          read my {anime.title} manga online
        </h3>
        <p className="font-semibold mt-2  text-white">
          Highest Quality | No signups | No Ads
        </p>
        <div className="mt-6">
        <a href={anime.url} className="px-4 py-2 mr-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-150">
          Read Now
        </a>
          <a href={anime.url} className="px-4 py-2 underline text-white  font-semiboldtransition duration-150">
          Go To Website
        </a>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default Home;
