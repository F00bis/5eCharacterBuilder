import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DraconicAncestryChoice } from './DraconicAncestryChoice';

const mockOnChange = vi.fn();

describe('DraconicAncestryChoice', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all 10 dragon types', () => {
    render(<DraconicAncestryChoice value="" onChange={mockOnChange} />);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(11);
    expect(options[0]).toHaveTextContent('Select Dragon Type');
    expect(options[1]).toHaveTextContent('Black');
    expect(options[2]).toHaveTextContent('Blue');
    expect(options[3]).toHaveTextContent('Brass');
    expect(options[4]).toHaveTextContent('Bronze');
    expect(options[5]).toHaveTextContent('Copper');
    expect(options[6]).toHaveTextContent('Gold');
    expect(options[7]).toHaveTextContent('Green');
    expect(options[8]).toHaveTextContent('Red');
    expect(options[9]).toHaveTextContent('Silver');
    expect(options[10]).toHaveTextContent('White');
  });

  it('calls onChange when selection changes', () => {
    render(<DraconicAncestryChoice value="" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Red' } });

    expect(mockOnChange).toHaveBeenCalledWith('Red');
  });

  it('displays the selected value', () => {
    render(<DraconicAncestryChoice value="Gold" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('Gold');
  });

  it('shows label text', () => {
    render(<DraconicAncestryChoice value="" onChange={mockOnChange} />);

    expect(screen.getByText('Draconic Ancestry')).toBeInTheDocument();
  });
});
