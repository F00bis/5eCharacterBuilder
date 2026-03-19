import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAllFeats, getFeatById, getFeatByName, getSRDFeats, getFeatsByPrerequisite, seedFeats } from './feats';
import { db } from './index';
import type { Feat } from '../types/feats';

vi.mock('./index', () => ({
  db: {
    feats: {
      toArray: vi.fn(),
      get: vi.fn(),
      where: vi.fn(),
      filter: vi.fn(),
      count: vi.fn(),
      bulkAdd: vi.fn(),
      first: vi.fn(),
    },
  },
}));

const mockFeats: Feat[] = [
  {
    id: 1,
    name: 'Alert',
    description: 'Always on the lookout for danger...',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: true
  },
  {
    id: 2,
    name: 'Athlete',
    description: 'You have undergone extensive physical training...',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: true,
    halfFeatChoiceAbility: 'strength',
    isSRD: true
  },
  {
    id: 3,
    name: 'Custom Feat',
    description: 'A custom feat added by the user',
    prerequisites: '',
    statModifiers: {},
    isHalfFeat: false,
    isSRD: false
  }
];

describe('feats db', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllFeats calls db.feats.toArray', async () => {
    vi.mocked(db.feats.toArray).mockResolvedValue(mockFeats);

    const result = await getAllFeats();

    expect(db.feats.toArray).toHaveBeenCalled();
    expect(result).toEqual(mockFeats);
  });

  it('getFeatById calls db.feats.get', async () => {
    const mockFeat = mockFeats[0];
    vi.mocked(db.feats.get).mockResolvedValue(mockFeat);

    const result = await getFeatById(1);

    expect(db.feats.get).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockFeat);
  });

  it('getFeatByName calls db.feats.where with name index', async () => {
    const mockWhere = {
      equals: vi.fn().mockReturnThis(),
      first: vi.fn().mockResolvedValue(mockFeats[0])
    };
    vi.mocked(db.feats.where).mockReturnValue(mockWhere as any);

    const result = await getFeatByName('Alert');

    expect(db.feats.where).toHaveBeenCalledWith('name');
    expect(mockWhere.equals).toHaveBeenCalledWith('Alert');
    expect(result).toEqual(mockFeats[0]);
  });

  it('getSRDFeats filters feats by isSRD flag', async () => {
    vi.mocked(db.feats.filter).mockReturnValue({
      toArray: vi.fn().mockResolvedValue(mockFeats.filter(f => f.isSRD))
    } as any);

    const result = await getSRDFeats();

    expect(db.feats.filter).toHaveBeenCalled();
    const srdFeats = await result;
    expect(srdFeats.length).toBe(2);
    expect(srdFeats.every(f => f.isSRD)).toBe(true);
  });

  it('getFeatsByPrerequisite returns all feats when prerequisite is empty', async () => {
    vi.mocked(db.feats.toArray).mockResolvedValue(mockFeats);

    const result = await getFeatsByPrerequisite('');

    expect(db.feats.toArray).toHaveBeenCalled();
    expect(result).toEqual(mockFeats);
  });

  it('getFeatsByPrerequisite filters by prerequisite', async () => {
    const mockWhere = {
      equals: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue([mockFeats[0]])
    };
    vi.mocked(db.feats.where).mockReturnValue(mockWhere as any);

    const result = await getFeatsByPrerequisite('Dexterity 13 or higher');

    expect(db.feats.where).toHaveBeenCalledWith('prerequisite');
    expect(mockWhere.equals).toHaveBeenCalledWith('Dexterity 13 or higher');
    expect(result).toEqual([mockFeats[0]]);
  });

  it('seedFeats adds feats when database is empty', async () => {
    vi.mocked(db.feats.count).mockResolvedValue(0);
    vi.mocked(db.feats.bulkAdd).mockResolvedValue([1, 2, 3] as any);

    await seedFeats();

    expect(db.feats.count).toHaveBeenCalled();
    expect(db.feats.bulkAdd).toHaveBeenCalled();
  });

  it('seedFeats does not add feats when database already has data', async () => {
    vi.mocked(db.feats.count).mockResolvedValue(3);

    await seedFeats();

    expect(db.feats.count).toHaveBeenCalled();
    expect(db.feats.bulkAdd).not.toHaveBeenCalled();
  });
});
