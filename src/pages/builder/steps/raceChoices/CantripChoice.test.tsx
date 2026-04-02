import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CantripChoice } from './CantripChoice';

const mockOnChange = vi.fn();

vi.mock('../../../../db/spells', () => ({
  getCantripsByClass: vi.fn().mockResolvedValue([
    { name: 'fire bolt', level: 0, school: 'Evocation' },
    { name: 'light', level: 0, school: 'Evocation' },
    { name: 'mage hand', level: 0, school: 'Conjuration' },
    { name: 'prestidigitation', level: 0, school: 'Transmutation' },
    { name: 'ray of frost', level: 0, school: 'Evocation' },
  ]),
}));

describe('CantripChoice', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders cantrip dropdown after loading', async () => {
    render(<CantripChoice value="" onChange={mockOnChange} spellClass="wizard" />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('calls onChange when cantrip is selected', async () => {
    render(<CantripChoice value="" onChange={mockOnChange} spellClass="wizard" />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'fire bolt' } });

    expect(mockOnChange).toHaveBeenCalledWith('fire bolt');
  });

  it('displays selected cantrip', async () => {
    render(<CantripChoice value="fire bolt" onChange={mockOnChange} spellClass="wizard" />);

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('fire bolt');
    });
  });

  it('shows label text', () => {
    render(<CantripChoice value="" onChange={mockOnChange} spellClass="wizard" />);

    expect(screen.getByText('Choose a Cantrip')).toBeInTheDocument();
  });
});
