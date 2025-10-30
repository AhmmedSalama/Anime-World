import { Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import './index.css';
import Home from './Pages/Home.js';
import AnimeList from './Pages/AnimeList.js';
import NewSeason from './Pages/NewSeason.js';
import AnimeDetails from './Pages/AnimeDetails.js';
import RandomAnime from './Pages/RandomAnime.js';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AnimeList" element={<AnimeList />} />
        <Route path="/AnimeDetails/:id" element={<AnimeDetails />} />
        <Route path="/new-season" element={<NewSeason />} />
        <Route path="/RandomAnime" element={<RandomAnime/>} />
      </Routes>
    </div>
  );
}

export default App;
