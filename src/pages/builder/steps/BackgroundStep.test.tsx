import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CharacterBuilderProvider } from '../../../contexts/CharacterBuilderProvider';
import BackgroundStep from './BackgroundStep';

function selectBackground(backgroundId: string) {
  const backgroundSelect = screen.getAllByRole('combobox')[0];
  fireEvent.change(backgroundSelect, { target: { value: backgroundId } });
}

function getEquipmentSection(): HTMLElement {
  const equipmentHeading = screen.getByRole('heading', { name: 'Equipment' });
  const section = equipmentHeading.closest('div');
  if (!section) {
    throw new Error('Equipment section not found');
  }
  return section;
}

describe('BackgroundStep', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders single-package equipment without package radio controls', async () => {
    render(
      <CharacterBuilderProvider>
        <BackgroundStep />
      </CharacterBuilderProvider>
    );

    selectBackground('criminal');

    await screen.findByRole('heading', { name: 'Equipment' });

    const equipmentSection = getEquipmentSection();
    expect(within(equipmentSection).queryAllByRole('radio')).toHaveLength(0);
    expect(within(equipmentSection).getByText('Crowbar')).toBeInTheDocument();
  });

  it('keeps item option select visible for single-package backgrounds', async () => {
    render(
      <CharacterBuilderProvider>
        <BackgroundStep />
      </CharacterBuilderProvider>
    );

    selectBackground('acolyte');

    await screen.findByRole('heading', { name: 'Equipment' });

    const equipmentSection = getEquipmentSection();
    const optionSelect = within(equipmentSection).getByRole('combobox');
    expect(optionSelect).toBeInTheDocument();
    expect(within(optionSelect).getByRole('option', { name: 'Prayer book' })).toBeInTheDocument();
    expect(within(optionSelect).getByRole('option', { name: 'Prayer wheel' })).toBeInTheDocument();
  });

  it('hides equipment package summary when background has one package', async () => {
    render(
      <CharacterBuilderProvider>
        <BackgroundStep />
      </CharacterBuilderProvider>
    );

    selectBackground('criminal');

    await screen.findByRole('heading', { name: 'Equipment' });

    expect(screen.queryByText(/Equipment Package:/i)).not.toBeInTheDocument();
  });
});
