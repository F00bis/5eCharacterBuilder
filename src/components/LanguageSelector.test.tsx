import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from './LanguageSelector';

const mockOnChange = vi.fn();

describe('LanguageSelector', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders label', () => {
    render(
      <LanguageSelector
        selectedLanguages={[]}
        onChange={mockOnChange}
        maxSelections={2}
      />
    );

    expect(screen.getByText('Languages')).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(
      <LanguageSelector
        selectedLanguages={[]}
        onChange={mockOnChange}
        maxSelections={2}
        label="Custom Label"
      />
    );

    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('displays known languages as badges when provided', () => {
    render(
      <LanguageSelector
        selectedLanguages={[]}
        onChange={mockOnChange}
        maxSelections={2}
        knownLanguages={['Common', 'Elvish']}
      />
    );

    expect(screen.getByText('Known Languages')).toBeInTheDocument();
    expect(screen.getByText('Common')).toBeInTheDocument();
    expect(screen.getByText('Elvish')).toBeInTheDocument();
  });

  it('hides known languages section when not provided', () => {
    render(
      <LanguageSelector
        selectedLanguages={[]}
        onChange={mockOnChange}
        maxSelections={2}
      />
    );

    expect(screen.queryByText('Known Languages')).not.toBeInTheDocument();
  });

  it('hides known languages section when empty array', () => {
    render(
      <LanguageSelector
        selectedLanguages={[]}
        onChange={mockOnChange}
        maxSelections={2}
        knownLanguages={[]}
      />
    );

    expect(screen.queryByText('Known Languages')).not.toBeInTheDocument();
  });

  it('displays selected languages as badges', () => {
    render(
      <LanguageSelector
        selectedLanguages={['common', 'elvish']}
        onChange={mockOnChange}
        maxSelections={2}
      />
    );

    expect(screen.getByText('Common')).toBeInTheDocument();
    expect(screen.getByText('Elvish')).toBeInTheDocument();
  });

  it('shows combobox when under limit', () => {
    render(
      <LanguageSelector
        selectedLanguages={['common']}
        onChange={mockOnChange}
        maxSelections={2}
      />
    );

    expect(screen.getByRole('button', { name: /Add language/ })).toBeInTheDocument();
  });

  it('shows remaining count in placeholder', () => {
    render(
      <LanguageSelector
        selectedLanguages={[]}
        onChange={mockOnChange}
        maxSelections={2}
      />
    );

    expect(screen.getByRole('button', { name: /2 of 2 remaining/ })).toBeInTheDocument();
  });

  it('shows remaining count decreasing after selection', () => {
    render(
      <LanguageSelector
        selectedLanguages={['common']}
        onChange={mockOnChange}
        maxSelections={2}
      />
    );

    expect(screen.getByRole('button', { name: /1 of 2 remaining/ })).toBeInTheDocument();
  });

  it('shows max limit message when at limit', () => {
    render(
      <LanguageSelector
        selectedLanguages={['common', 'elvish']}
        onChange={mockOnChange}
        maxSelections={2}
      />
    );

    expect(screen.getByText(/Maximum number of languages selected/)).toBeInTheDocument();
  });

  it('hides combobox when at limit', () => {
    render(
      <LanguageSelector
        selectedLanguages={['common', 'elvish']}
        onChange={mockOnChange}
        maxSelections={2}
      />
    );

    expect(screen.queryByPlaceholderText(/Add language/)).not.toBeInTheDocument();
  });

  it('allows selecting multiple languages sequentially', () => {
    render(
      <LanguageSelector
        selectedLanguages={[]}
        onChange={mockOnChange}
        maxSelections={2}
      />
    );

    expect(screen.getByRole('button', { name: /2 of 2 remaining/ })).toBeInTheDocument();
  });

  it('allows removing selected languages', () => {
    render(
      <LanguageSelector
        selectedLanguages={['common', 'elvish']}
        onChange={mockOnChange}
        maxSelections={2}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /Remove/ });
    fireEvent.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith(['elvish']);
  });

  it('renders single-select mode with singleSelect prop', () => {
    render(
      <LanguageSelector
        selectedLanguages={[]}
        onChange={mockOnChange}
        maxSelections={2}
        singleSelect
      />
    );

    expect(screen.getByRole('button', { name: /Select a language/ })).toBeInTheDocument();
  });

  it('replaces selection in single-select mode', () => {
    render(
      <LanguageSelector
        selectedLanguages={['common']}
        onChange={mockOnChange}
        maxSelections={2}
        singleSelect
      />
    );

    expect(screen.queryByRole('button', { name: /Add language/ })).not.toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(
      <LanguageSelector
        selectedLanguages={[]}
        onChange={mockOnChange}
        maxSelections={2}
        placeholder="Custom placeholder"
      />
    );

    expect(screen.getByRole('button', { name: 'Custom placeholder' })).toBeInTheDocument();
  });
});
