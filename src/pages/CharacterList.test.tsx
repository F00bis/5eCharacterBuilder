import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CharacterList } from './CharacterList';
import * as dbChars from '../db/characters';
import type { Character } from '../types';
import { DEFAULT_PORTRAIT } from '../utils/imageUtils';

vi.mock('../db/characters', () => ({
  getAllCharacters: vi.fn(),
  deleteCharacter: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Gimli',
    race: 'Human',
    classes: [{ className: 'Fighter', level: 5 }],
    portrait: null,
  } as Character,
  {
    id: 2,
    name: 'Legolas',
    race: 'Elf',
    classes: [{ className: 'Ranger', level: 6 }],
    portrait: 'custom-url.png',
  } as Character,
];

function renderCharacterList() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<CharacterList />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('CharacterList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(dbChars.getAllCharacters).mockReturnValue(new Promise(() => {})); // Never resolves
    renderCharacterList();
    expect(screen.getByText('Loading characters...')).toBeInTheDocument();
  });

  it('renders empty state when no characters exist', async () => {
    vi.mocked(dbChars.getAllCharacters).mockResolvedValue([]);
    renderCharacterList();

    await waitFor(() => {
      expect(screen.queryByText('Loading characters...')).not.toBeInTheDocument();
    });

    const createButtons = screen.getAllByText('Create New Character');
    expect(createButtons.length).toBeGreaterThan(0);
  });

  it('renders list of characters', async () => {
    vi.mocked(dbChars.getAllCharacters).mockResolvedValue(mockCharacters);
    renderCharacterList();

    await waitFor(() => {
      expect(screen.getByText('Gimli')).toBeInTheDocument();
    });

    expect(screen.getByText('Human • Fighter 5')).toBeInTheDocument();
    expect(screen.getByText('Legolas')).toBeInTheDocument();
    expect(screen.getByText('Elf • Ranger 6')).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect((images[0] as HTMLImageElement).src).toContain(DEFAULT_PORTRAIT);
    expect((images[1] as HTMLImageElement).src).toContain('custom-url.png');
  });

it('navigates to character view on click', async () => {
    vi.mocked(dbChars.getAllCharacters).mockResolvedValue(mockCharacters);
    renderCharacterList();

    await waitFor(() => {
      expect(screen.getByText('Gimli')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Gimli'));
    expect(mockNavigate).toHaveBeenCalledWith('/characters/1');
  });

  it('navigates to create character page on create new button click', async () => {
    vi.mocked(dbChars.getAllCharacters).mockResolvedValue(mockCharacters);
    renderCharacterList();

    await waitFor(() => {
      expect(screen.getByText('Create New')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create New'));
    expect(mockNavigate).toHaveBeenCalledWith('/characters/new');
  });

  it('opens delete dialog and deletes character', async () => {
    vi.mocked(dbChars.getAllCharacters).mockResolvedValue([mockCharacters[0]]);
    renderCharacterList();

    await waitFor(() => {
      expect(screen.getByText('Gimli')).toBeInTheDocument();
    });

    // Find and click delete button
    const deleteButton = screen.getByRole('button', { name: '' }); // Trash icon button has no text
    fireEvent.click(deleteButton);

    // Dialog appears
    expect(screen.getByText('Delete Character')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this character? This action cannot be undone.')).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmButton);

    expect(dbChars.deleteCharacter).toHaveBeenCalledWith(1);
    
    // Dialog closes and characters reload
    await waitFor(() => {
      expect(screen.queryByText('Delete Character')).not.toBeInTheDocument();
    });
    expect(dbChars.getAllCharacters).toHaveBeenCalledTimes(2); // Initial load + reload after delete
  });

  it('cancels deletion', async () => {
    vi.mocked(dbChars.getAllCharacters).mockResolvedValue([mockCharacters[0]]);
    renderCharacterList();

    await waitFor(() => {
      expect(screen.getByText('Gimli')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: '' });
    fireEvent.click(deleteButton);

    expect(screen.getByText('Delete Character')).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(dbChars.deleteCharacter).not.toHaveBeenCalled();
    expect(screen.queryByText('Delete Character')).not.toBeInTheDocument();
  });
});
