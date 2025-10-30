import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import VideoProgressBar from "../components/VideoProgressBar";

function RandomAnime() {
  const [anime, setAnime] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [characters, setCharacters] = useState([]);

  // ✅ جلب الأنمي العشوائي أول مرة فقط
  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/random/anime`)
      .then((res) => res.json())
      .then((data) => {
        setAnime(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching anime:", error);
        setLoading(false);
      });
  }, []);

  // ✅ جلب الأنميات المرتبطة بعد تحميل الأنمي الرئيسي
  useEffect(() => {
    if (!anime) return;
    fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/relations`)
      .then((res) => res.json())
      .then((data) => {
        const animeRelations = data.data
          ?.flatMap((rel) => rel.entry)
          .filter((item) => item.type === "anime");
        setRelated(animeRelations || []);
      })
      .catch((err) => console.error(err));
  }, [anime]);

  // ✅ جلب الشخصيات
  useEffect(() => {
    if (!anime) return;
    fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/characters`)
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching characters:", error);
      });
  }, [anime]);

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

  const synopsis = anime?.synopsis || "No synopsis available.";
  const mainImage = anime?.images?.jpg?.large_image_url;

  return (
    <div className="AnimeDetails p-4 flex items-center justify-center">
      <div className="container">
        {/* ✅ خلفية صورة الأنمي مطفية */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `url(${mainImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* طبقة تعتيم */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

          {/* المحتوى */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 text-white p-6">
            {/* صورة الأنمي */}
            <div className="md:col-span-5 rounded-2xl">
              <img
                src={mainImage}
                alt={anime.title}
                className="w-full h-auto rounded-lg shadow-lg shadow-yellow-400/10"
              />
            </div>

            {/* تفاصيل الأنمي */}
            <div className="md:col-span-7 rounded-2xl">
              <div>
                <p className="text-sm text-gray-400 mb-5">Home | TV</p>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                  {anime.title}
                </h1>
                <p className="text-gray-300 mt-5 mb-5 text-sm">
                  {anime.type} • EP {anime.episodes || "?"}
                </p>

                {/* الوصف */}
                <div className="mt-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {showMore ? synopsis : `${synopsis.slice(0, 400)}...`}
                  </p>

                  {synopsis.length > 400 && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="mt-2 text-yellow-400 hover:text-yellow-300 transition"
                    >
                      {showMore ? "Show Less ▲" : "Show More ▼"}
                    </button>
                  )}
                </div>
              </div>

              {/* Continue Watching */}
              <div className="bg-[#1a1a1a]/80 rounded-2xl p-5 mt-6 shadow-lg shadow-yellow-400/10">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-[#ff9c00] font-medium"
                >
                  <div className="bg-green-500 p-3 rounded-full inline-flex items-center justify-center hover:bg-green-600 transition">
                    <PlayCircle className="text-white" />
                  </div>
                  Continue Watching
                </Link>

                <p className="text-gray-300 mt-2 text-sm">
                  {anime.type} • EP {anime.episodes || "?"}
                </p>

                <p className="text-gray-300 mt-2 text-sm mb-3">
                  {anime.synopsis.slice(0, 200)}...
                </p>

                <VideoProgressBar
                  currentTime="18:09"
                  totalTime="24:12"
                  progress={75}
                />
              </div>

              {/* ✅ سلايدر الأنميات المرتبطة */}
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">📺 Related Anime</h2>

                {related.length > 0 ? (
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={3}
                    navigation
                    breakpoints={{
                      1024: { slidesPerView: 3 },
                      768: { slidesPerView: 2 },
                      0: { slidesPerView: 1 },
                    }}
                    className="mySwiper"
                  >
                    {related.map((item) => (
                      <SwiperSlide key={item.mal_id}>
                        <div className="bg-[#111]/80 rounded-xl p-3 flex gap-4 items-start hover:bg-[#1a1a1a] transition transform hover:scale-[1.03] duration-300">
                          <img
                            src={mainImage}
                            alt={item.name}
                            className="w-24 h-36 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                              {item.name.slice(0, 25)}
                            </h3>
                            <p className="text-gray-300 mt-2 text-sm">
                              EP 11 • EP 24
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <p className="text-gray-400 text-center">
                    No related anime found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ قسم الشخصيات */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">
            Characters & Voice Actors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {characters.map((char) => (
              <div
                key={char.character.mal_id}
                className="flex items-center gap-4 bg-[#1a1a1a] rounded-xl p-4 hover:bg-[#222] transition"
              >
                <img
                  src={char.character.images.jpg.image_url}
                  alt={char.character.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-700"
                />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400">
                    {char.character.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {char.voice_actors?.[0]?.person?.name || "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RandomAnime;
