import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CharacterView } from './pages/CharacterView';
import { CharacterList } from './pages/CharacterList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharacterList />} />
        <Route path="/characters/:characterId" element={<CharacterView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
