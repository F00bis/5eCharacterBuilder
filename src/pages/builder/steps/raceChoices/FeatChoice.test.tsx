import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeatChoice } from './FeatChoice';

const mockOnChange = vi.fn();

vi.mock('../../../../db/feats', () => ({
  getAllFeats: vi.fn().mockResolvedValue([
    { id: 1, name: 'Grappler', description: 'Grappling feat' },
    { id: 2, name: 'Magic Initiate', description: 'Magic feat' },
    { id: 3, name: 'Sentinel', description: 'Combat feat' },
  ]),
}));

describe('FeatChoice', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders feat dropdown after loading', async () => {
    render(<FeatChoice value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('calls onChange when feat is selected', async () => {
    render(<FeatChoice value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Sentinel' } });

    expect(mockOnChange).toHaveBeenCalledWith('Sentinel');
  });

  it('displays selected feat', async () => {
    render(<FeatChoice value="Sentinel" onChange={mockOnChange} />);

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('Sentinel');
    });
  });

  it('shows label text', () => {
    render(<FeatChoice value="" onChange={mockOnChange} />);

    expect(screen.getByText('Choose a Feat')).toBeInTheDocument();
  });
});
