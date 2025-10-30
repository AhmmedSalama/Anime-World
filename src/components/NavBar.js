import { NavLink, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const MenuIcon = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8 text-white"
  >
    {isOpen ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    )}
  </svg>
);

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  // تحديد موقع الـ dropdown بالنسبة للإنبوت
  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.left, width: rect.width });
    }
  }, [search]);

  // 🧠 Debounce logic
  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setIsLoading(true);
      fetch(`https://api.jikan.moe/v4/anime?q=${search}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.data || []);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }, 700);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsMenuOpen(false);
  };

  const mobileMenuClasses = `
    transition-all duration-500 ease-in-out
    ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
    overflow-hidden
    w-full 
    lg:max-h-full lg:opacity-100 lg:flex lg:w-auto
  `;

  const getLinkClasses = ({ isActive }) => {
    const base = "block text-center px-3 py-2 rounded-md text-sm font-medium transition duration-150";
    const hover = "hover:bg-gray-700 hover:text-[#db9d3c]";
    const active = "bg-gray-700 text-[#ff9c00]";
    const inactive = "text-white";
    return `${base} ${hover} ${isActive ? active : inactive}`;
  };

  return (
    <>
      <nav className="bg-black shadow-xl items-center justify-center flex p-4 sticky top-0 z-[9999]">
        <div className="container flex flex-col lg:flex-row items-center justify-between relative">
          {/* Logo & Menu Button */}
          <div className="flex justify-between items-center w-full lg:w-auto">
            <img src="imgs/logo.png" alt="Anime World Logo" className="h-9 mr-2" />
            <button
              className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 block lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon isOpen={isMenuOpen} />
            </button>
          </div>

          {/* Search & Links */}
          <div className={mobileMenuClasses}>
            <div className="flex flex-col lg:flex-row items-center justify-center w-full space-y-4 lg:space-y-0 lg:space-x-8 mt-4 lg:mt-0">
              {/* 🔍 Search Input */}
              <div className="relative w-full lg:w-[326px] order-1 lg:mr-5">
                <input
                  ref={inputRef}
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  type="text"
                  placeholder="Search Anime..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-white bg-gray-900 border-2 border-gray-700 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition duration-150 shadow-md"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
              </div>

              {/* Links */}
              <ul className="flex flex-col lg:flex-row justify-center space-y-2 lg:space-y-0 lg:space-x-4 order-2 mt-4 lg:mt-0 w-full lg:w-auto list-none m-0 p-0">
                <li>
                  <NavLink to="/" end className={getLinkClasses} onClick={handleLinkClick}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/AnimeList" className={getLinkClasses} onClick={handleLinkClick}>
                    Anime List
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/new-season" className={getLinkClasses} onClick={handleLinkClick}>
                    New Season
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/RandomAnime" className={getLinkClasses} onClick={handleLinkClick}>
                    Random Anime
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* 📋 Dropdown (ثابت فوق المحتوى) */}
      {search && (
        <div
          style={{
            position: "fixed",
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 9999999,
          }}
          className="bg-gray-800 border border-gray-700 rounded-lg max-h-60 overflow-y-auto shadow-2xl"
        >
          {isLoading ? (
            <p className="p-2 text-gray-400 text-center">Loading...</p>
          ) : results.length > 0 ? (
            results.map((anime) => (
              <Link
                to={`/AnimeDetails/${anime.mal_id}`}
                key={anime.mal_id}
                onClick={() => {
                  setResults([]);
                  setSearch("");
                }}
                className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer transition rounded-md bg-[#1a1a1a]"
              >
                {anime.images?.jpg?.image_url && (
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="w-10 h-14 object-cover rounded-md"
                  />
                )}
                <span className="text-white">{anime.title}</span>
              </Link>
            ))
          ) : (
            <p className="p-2 text-gray-400 text-center">No results found</p>
          )}
        </div>
      )}
    </>
  );
}

export default NavBar;
