import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCharacterById, updateCharacter, getAllCharacters, deleteCharacter, addCharacter } from './characters';
import { db } from './index';
import type { Character } from '../types';

vi.mock('./index', () => ({
  db: {
    characters: {
      get: vi.fn(),
      update: vi.fn(),
      toArray: vi.fn(),
      delete: vi.fn(),
      add: vi.fn(),
    },
  },
}));

describe('characters db', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('getCharacterById calls db.characters.get', async () => {
    const mockChar = { id: 1, name: 'Test' } as Character;
    vi.mocked(db.characters.get).mockResolvedValue(mockChar);

    const result = await getCharacterById(1);

    expect(db.characters.get).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockChar);
  });

  it('addCharacter calls db.characters.add and returns id', async () => {
    const mockChar = { name: 'Test Character' } as Character;
    vi.mocked(db.characters.add).mockResolvedValue(42);

    const result = await addCharacter(mockChar);

    expect(db.characters.add).toHaveBeenCalledWith(mockChar);
    expect(result).toBe(42);
  });

  it('updateCharacter calls db.characters.update with updatedAt', async () => {
    vi.mocked(db.characters.update).mockResolvedValue(1);

    const updates = { name: 'New Name' };
    const result = await updateCharacter(1, updates);

    expect(db.characters.update).toHaveBeenCalledWith(1, {
      name: 'New Name',
      updatedAt: new Date('2023-01-01T00:00:00Z'),
    });
    expect(result).toBe(1);
  });

  it('getAllCharacters calls db.characters.toArray', async () => {
    const mockChars = [{ id: 1, name: 'Test 1' }, { id: 2, name: 'Test 2' }] as Character[];
    vi.mocked(db.characters.toArray).mockResolvedValue(mockChars);

    const result = await getAllCharacters();

    expect(db.characters.toArray).toHaveBeenCalled();
    expect(result).toEqual(mockChars);
  });

  it('deleteCharacter calls db.characters.delete', async () => {
    vi.mocked(db.characters.delete).mockResolvedValue(undefined);

    await deleteCharacter(1);

    expect(db.characters.delete).toHaveBeenCalledWith(1);
  });
});
