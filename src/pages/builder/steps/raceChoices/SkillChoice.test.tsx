import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { SkillChoice } from './SkillChoice';

const mockOnChange = vi.fn();

describe('SkillChoice', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all skills as options', () => {
    render(<SkillChoice value={[]} count={1} onChange={mockOnChange} />);

    const options = screen.getAllByRole('option');
    expect(options.length).toBe(19);
  });

  it('allows selecting a single skill when count is 1', () => {
    render(<SkillChoice value={[]} count={1} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'athletics' } });

    expect(mockOnChange).toHaveBeenCalledWith(['athletics']);
  });

  it('displays selected skill', () => {
    render(<SkillChoice value={['athletics']} count={1} onChange={mockOnChange} />);

    expect(screen.getByText('Athletics')).toBeInTheDocument();
  });

  it('excludes already selected skills from options', () => {
    render(<SkillChoice value={['athletics']} count={2} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    const options = within(select).getAllByRole('option');
    const athleticsOption = options.find(opt => opt.getAttribute('value') === 'athletics');

    expect(athleticsOption).toBeUndefined();
  });

  it('shows label with count', () => {
    render(<SkillChoice value={[]} count={2} onChange={mockOnChange} />);

    expect(screen.getByText('Choose 2 Skills')).toBeInTheDocument();
  });
});
