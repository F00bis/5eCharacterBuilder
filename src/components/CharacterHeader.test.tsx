import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterHeader } from './CharacterHeader';
import type { Character } from '../types';

const baseCharacter: Character = {
  id: 1,
  name: 'Test Hero',
  race: 'Human',
  background: 'Soldier',
  alignment: 'Neutral',
  classes: [
    { className: 'Fighter', level: 5 },
    { className: 'Wizard', level: 2 },
  ],
  abilityScores: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  level: 7,
  xp: 3500,
  portrait: null,
  hp: 40,
  maxHp: 40,
  currentHp: 40,
  tempHp: 0,
  ac: 16,
  speed: 30,
  initiative: 0,
  vision: {},
  deathSaves: { successes: 0, failures: 0 },
  proficiencyBonus: 3,
  skills: [],
  equipment: [],
  spellSlots: [],
  spells: [],
  statusEffects: [],
  feats: [],
  notes: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CharacterHeader', () => {
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  it('renders character data correctly', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('Test Hero')).toBeInTheDocument();
    expect(screen.getAllByText('Human').length).toBeGreaterThan(0);
    expect(screen.getByText(/Level 7 Fighter/)).toBeInTheDocument();
    expect(screen.getByText(/3,500/)).toBeInTheDocument();
    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Alignment')).toBeInTheDocument();
  });

  it('displays default portrait when no portrait is set', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    const portrait = screen.getByAltText('Character portrait') as HTMLImageElement;
    expect(portrait.src).toContain('data:image/svg+xml');
  });

  it('displays custom portrait when set', () => {
    const characterWithPortrait = {
      ...baseCharacter,
      portrait: 'data:image/png;base64,test',
    };
    render(<CharacterHeader character={characterWithPortrait} onUpdate={mockOnUpdate} />);

    const portrait = screen.getByAltText('Character portrait') as HTMLImageElement;
    expect(portrait.src).toBe('data:image/png;base64,test');
  });

  it('opens modal when portrait is clicked', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    const portrait = screen.getByAltText('Character portrait');
    fireEvent.click(portrait);

    expect(screen.getByText('Change Portrait')).toBeInTheDocument();
    expect(screen.getByText('Upload File')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paste image URL')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    const portrait = screen.getByAltText('Character portrait');
    fireEvent.click(portrait);

    expect(screen.getByText('Change Portrait')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(screen.queryByText('Change Portrait')).not.toBeInTheDocument();
  });

  it('allows name inline editing', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    const nameElement = screen.getByText('Test Hero');
    fireEvent.click(nameElement);

    const input = screen.getByDisplayValue('Test Hero') as HTMLInputElement;
    expect(input).toBe(document.activeElement);

    fireEvent.change(input, { target: { value: 'New Name' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnUpdate).toHaveBeenCalledWith({ name: 'New Name' });
  });

  it('cancels name editing on Escape', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    const nameElement = screen.getByText('Test Hero');
    fireEvent.click(nameElement);

    const input = screen.getByDisplayValue('Test Hero') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Name' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(mockOnUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Test Hero')).toBeInTheDocument();
  });

  it('allows XP inline editing', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    const xpElement = screen.getByText(/3,500/);
    fireEvent.click(xpElement);

    const input = screen.getByDisplayValue('3500') as HTMLInputElement;
    expect(input).toBe(document.activeElement);

    fireEvent.change(input, { target: { value: '5000' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnUpdate).toHaveBeenCalledWith({ xp: 5000 });
  });

  it('cancels XP editing on Escape', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    const xpElement = screen.getByText(/3,500/);
    fireEvent.click(xpElement);

    const input = screen.getByDisplayValue('3500') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '5000' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(mockOnUpdate).not.toHaveBeenCalled();
    expect(screen.getByText(/3,500/)).toBeInTheDocument();
  });

  it('displays XP progress bar with correct percentage', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    
    const xpProgress = screen.getByText(/0 \/ /);
    expect(xpProgress).toBeInTheDocument();
  });

  it('shows classes tooltip on level field', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    const levelElement = screen.getByText(/Level 7 Fighter/);
    expect(levelElement).toBeInTheDocument();
  });

  it('shows +X for multiclassed characters', () => {
    const multiClassCharacter = {
      ...baseCharacter,
      classes: [
        { className: 'Fighter', level: 3 },
        { className: 'Wizard', level: 2 },
        { className: 'Rogue', level: 1 },
        { className: 'Cleric', level: 1 },
      ],
      level: 7,
    };
    render(<CharacterHeader character={multiClassCharacter} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('+3')).toBeInTheDocument();
    expect(screen.getByText(/Level 7 Fighter/)).toBeInTheDocument();
  });

  it('shows tooltip for XP to next level', () => {
    render(<CharacterHeader character={baseCharacter} onUpdate={mockOnUpdate} />);

    const xpElement = screen.getByText(/3,500/);
    expect(xpElement).toBeInTheDocument();
  });
});
