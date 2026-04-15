import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Stepper from './stepper';

describe('Stepper', () => {
  const mockSteps = [
    { id: '1', label: 'Step 1', description: 'Desc 1' },
    { id: '2', label: 'Step 2' },
    { id: '3', label: 'Step 3' },
  ];

  it('renders all steps with labels', () => {
    render(<Stepper steps={mockSteps} currentStep={0} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('calls onStepClick when a completed or active step is clicked', () => {
    const onStepClick = vi.fn();
    render(<Stepper steps={mockSteps} currentStep={1} onStepClick={onStepClick} />);
    
    // Step 1 is completed (index 0)
    fireEvent.click(screen.getByText('Step 1'));
    expect(onStepClick).toHaveBeenCalledWith(0);
    
    // Step 2 is active (index 1)
    fireEvent.click(screen.getByText('Step 2'));
    expect(onStepClick).toHaveBeenCalledWith(1);
    
    // Step 3 is upcoming (index 2), should not call onStepClick
    onStepClick.mockClear();
    fireEvent.click(screen.getByText('Step 3'));
    expect(onStepClick).not.toHaveBeenCalled();
  });
});
