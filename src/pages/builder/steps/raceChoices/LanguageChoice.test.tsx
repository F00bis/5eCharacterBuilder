import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageChoice } from './LanguageChoice';

const mockOnChange = vi.fn();

describe('LanguageChoice', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all languages as options', () => {
    render(<LanguageChoice value="" onChange={mockOnChange} knownLanguages={[]} />);

    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(10);
  });

  it('calls onChange when language is selected', () => {
    render(<LanguageChoice value="" onChange={mockOnChange} knownLanguages={[]} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Elvish' } });

    expect(mockOnChange).toHaveBeenCalledWith('Elvish');
  });

  it('displays selected language', () => {
    render(<LanguageChoice value="Elvish" onChange={mockOnChange} knownLanguages={[]} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('Elvish');
  });

  it('excludes known languages from options', () => {
    render(<LanguageChoice value="" onChange={mockOnChange} knownLanguages={['Common', 'Dwarvish']} />);

    const options = screen.getAllByRole('option');
    const commonOption = options.find(opt => opt.getAttribute('value') === 'Common');
    const dwarvishOption = options.find(opt => opt.getAttribute('value') === 'Dwarvish');

    expect(commonOption).toBeDisabled();
    expect(dwarvishOption).toBeDisabled();
  });

  it('shows label text', () => {
    render(<LanguageChoice value="" onChange={mockOnChange} knownLanguages={[]} />);

    expect(screen.getByText('Choose a Language')).toBeInTheDocument();
  });
});
