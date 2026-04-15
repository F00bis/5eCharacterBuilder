import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CharacterView } from './pages/CharacterView';
import { CharacterList } from './pages/CharacterList';
import CharacterCreator from './pages/CharacterCreator';
import { CharacterBuilderProvider } from './contexts/CharacterBuilderProvider';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharacterList />} />
        <Route path="/characters/new" element={
          <CharacterBuilderProvider>
            <CharacterCreator mode="create" />
          </CharacterBuilderProvider>
        } />
        <Route path="/characters/:characterId/level-up" element={
          <CharacterBuilderProvider>
            <CharacterCreator mode="levelup" />
          </CharacterBuilderProvider>
        } />
        <Route path="/characters/:characterId" element={<CharacterView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
