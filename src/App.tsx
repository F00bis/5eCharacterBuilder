import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CharacterView } from './pages/CharacterView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/characters/:characterId" element={<CharacterView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
