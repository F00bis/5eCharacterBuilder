import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCharacterBuilder } from '../../../contexts/CharacterBuilderContextTypes';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import EquipmentPackages from './EquipmentPackages';

vi.mock('../../../db/equipment', () => ({
  getAllEquipment: vi.fn().mockResolvedValue([
    { name: 'Light Crossbow', weight: '5', equipmentCategory: 'Weapon', weaponCategory: 'Martial', damage: '1d8', cost: '25 gp' },
    { name: 'Bolts', weight: '0.5', equipmentCategory: 'Ammo', cost: '1 gp' },
    { name: 'Simple Weapon', weight: '2', equipmentCategory: 'Weapon', weaponCategory: 'Simple', damage: '1d6' },
    { name: 'Club', weight: '2', equipmentCategory: 'Weapon', weaponCategory: 'Simple', damage: '1d4', cost: '1 sp' },
    { name: 'Dagger', weight: '1', equipmentCategory: 'Weapon', weaponCategory: 'Simple', damage: '1d4', cost: '2 gp' },
    { name: 'Greataxe', weight: '7', equipmentCategory: 'Weapon', weaponCategory: 'Martial', damage: '1d12', cost: '30 gp' },
    { name: 'Leather Armor', weight: '10', equipmentCategory: 'Armor', armorCategory: 'Light', armorClass: '11', cost: '10 gp' },
    { name: 'Longbow', weight: '2', equipmentCategory: 'Weapon', weaponCategory: 'Martial', damage: '1d8', cost: '50 gp' },
    { name: 'Arrows', weight: '0.5', equipmentCategory: 'Ammo', cost: '1 gp' },
  ]),
}));

vi.mock('../../../db/classes', () => ({
  getClassByName: vi.fn().mockImplementation((name: string) => {
    if (name === 'Sorcerer') {
      return Promise.resolve({
        name: 'Sorcerer',
        startingEquipment: {
          startingGoldFormula: '3d4 * 10',
          startingGoldAverage: 75,
          choices: [
            {
              label: 'Choose your weapon:',
              options: [
                { label: '(a) Light Crossbow and Bolts', items: ['Light Crossbow', 'Bolts'], type: 'bundle' },
                { label: '(b) Simple Weapon', items: ['Club', 'Dagger'], type: 'choice' }
              ]
            }
          ],
          fixedEquipment: ['Leather Armor', 'Component Pouch']
        }
      });
    }
    if (name === 'Fighter') {
      return Promise.resolve({
        name: 'Fighter',
        startingEquipment: {
          startingGoldFormula: '5d4 * 10',
          startingGoldAverage: 125,
          choices: [
            {
              label: 'Choose your armor:',
              options: [
                { label: '(a) Chain Mail', items: ['Chain Mail'], type: 'bundle' },
                { label: '(b) Leather Armor, Longbow, and Arrows', items: ['Leather Armor', 'Longbow', 'Arrows'], type: 'bundle' }
              ]
            },
            {
              label: 'Choose your weapon:',
              options: [
                { label: '(a) Martial Weapon and Shield', items: ['Greataxe', 'Dagger'], type: 'choice' },
                { label: '(b) Two Martial Weapons', items: ['Greataxe', 'Dagger'], type: 'choice' }
              ]
            }
          ],
          fixedEquipment: ["Dungeoneer's Pack"]
        }
      });
    }
    return Promise.resolve(null);
  }),
}));

function EquipmentPackagesWithSetup({ className }: { className: string }) {
  const { dispatch } = useCharacterBuilder();

  useEffect(() => {
    dispatch({ type: 'UPDATE_DRAFT', updates: { classes: [{ className, level: 1 }] } });
  }, [dispatch, className]);

  return <EquipmentPackages currentClassName={className} isLevel1={true} />;
}

describe('EquipmentPackages', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders equipment choices when class is selected', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentPackagesWithSetup className="Sorcerer" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Choose your weapon:')).toBeInTheDocument();
    });
  });

  it('shows bundle items without dropdown when option type is bundle', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentPackagesWithSetup className="Sorcerer" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('(a) Light Crossbow and Bolts')).toBeInTheDocument();
    });

    const radioButton = screen.getByRole('radio', { name: '(a) Light Crossbow and Bolts' });
    radioButton.click();

    await waitFor(() => {
      expect(screen.getByText('You will receive:')).toBeInTheDocument();
      expect(screen.getByText('Light Crossbow')).toBeInTheDocument();
      expect(screen.getByText('Bolts')).toBeInTheDocument();
    });

    expect(screen.queryByPlaceholderText('Select an item...')).not.toBeInTheDocument();
  });

  it('shows dropdown when option type is choice', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentPackagesWithSetup className="Sorcerer" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('(b) Simple Weapon')).toBeInTheDocument();
    });

    const radioButton = screen.getByRole('radio', { name: '(b) Simple Weapon' });
    radioButton.click();

    await waitFor(() => {
      expect(screen.getByText('Select Item:')).toBeInTheDocument();
    });
  });

  it('validates bundle selection without requiring dropdown', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentPackagesWithSetup className="Sorcerer" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('(a) Light Crossbow and Bolts')).toBeInTheDocument();
    });

    const radioButton = screen.getByRole('radio', { name: '(a) Light Crossbow and Bolts' });
    radioButton.click();

    await waitFor(() => {
      expect(screen.getByText('You will receive:')).toBeInTheDocument();
    });
  });

  it('requires dropdown selection for choice options', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentPackagesWithSetup className="Sorcerer" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('(b) Simple Weapon')).toBeInTheDocument();
    });

    const radioButton = screen.getByRole('radio', { name: '(b) Simple Weapon' });
    radioButton.click();

    await waitFor(() => {
      expect(screen.getByText('Select Item:')).toBeInTheDocument();
    });
  });

  it('displays multiple bundle options correctly', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentPackagesWithSetup className="Fighter" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Choose your armor:')).toBeInTheDocument();
    });

    expect(screen.getByText('(a) Chain Mail')).toBeInTheDocument();
    expect(screen.getByText('(b) Leather Armor, Longbow, and Arrows')).toBeInTheDocument();
  });

  it('shows choice dropdown for choice type options in Fighter', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentPackagesWithSetup className="Fighter" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Choose your weapon:')).toBeInTheDocument();
    });

    const radioButton = screen.getByRole('radio', { name: '(a) Martial Weapon and Shield' });
    radioButton.click();

    await waitFor(() => {
      expect(screen.getByText('Select Item:')).toBeInTheDocument();
    });
  });

  it('shows message when no class is selected', () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentPackages currentClassName="" isLevel1={true} />
      </CharacterBuilderProvider>
    );
    
    expect(screen.getByText(/Please select a class first/i)).toBeInTheDocument();
  });

  it('displays fixed equipment section', async () => {
    render(
      <CharacterBuilderProvider>
        <EquipmentPackagesWithSetup className="Sorcerer" />
      </CharacterBuilderProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Fixed Equipment (from class and background)')).toBeInTheDocument();
      expect(screen.getByText('Leather Armor')).toBeInTheDocument();
      expect(screen.getByText('Component Pouch')).toBeInTheDocument();
    });
  });
});
