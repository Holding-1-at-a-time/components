import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Customizations from './Customizations';
import { setup } from './jest.setup';

describe('Customizations', () => {
  const customizations = [
    { name: 'Customization 1', price: 10 },
    { name: 'Customization 2', price: 20 },
  ];

  const onCustomizationChange = jest.fn();
  const onAddCustomization = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(
      <Customizations
        customizations={customizations}
        newCustomization=""
        onCustomizationChange={onCustomizationChange}
        onAddCustomization={onAddCustomization}
      />
    );

    expect(screen.getByText('Customizations')).toBeInTheDocument();
    expect(screen.getByText('Add any additional customizations to your order.')).toBeInTheDocument();
    expect(screen.getByLabelText('Add customization')).toBeInTheDocument();
    expect(screen.getByText('Customization 1')).toBeInTheDocument();
    expect(screen.getByText('Customization 2')).toBeInTheDocument();
  });

  it('calls onCustomizationChange when input value changes', () => {
    render(
      <Customizations
        customizations={customizations}
        newCustomization=""
        onCustomizationChange={onCustomizationChange}
        onAddCustomization={onAddCustomization}
      />
    );

    const input = screen.getByLabelText('Add customization');
    fireEvent.change(input, { target: { value: 'New customization' } });

    expect(onCustomizationChange).toHaveBeenCalledWith('New customization');
  });

  it('calls onAddCustomization when Add button is clicked', () => {
    render(
      <Customizations
        customizations={customizations}
        newCustomization=""
        onCustomizationChange={onCustomizationChange}
        onAddCustomization={onAddCustomization}
      />
    );

    const addButton = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(addButton);

    expect(onAddCustomization).toHaveBeenCalled();
  });

  it('calls onAddCustomization with correct customization when Add button is clicked', () => {
    render(
      <Customizations
        customizations={customizations}
        newCustomization="Customization 3"
        onCustomizationChange={onCustomizationChange}
        onAddCustomization={onAddCustomization}
      />
    );

    const input = screen.getByLabelText('Add customization');
    fireEvent.change(input, { target: { value: 'Customization 3' } });

    const addButton = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(addButton);

    expect(onAddCustomization).toHaveBeenCalledWith({ name: 'Customization 3', price: 0 });
  });

  it('does not call onAddCustomization when input value is empty', () => {
    render(
      <Customizations
        customizations={customizations}
        newCustomization=""
        onCustomizationChange={onCustomizationChange}
        onAddCustomization={onAddCustomization}
      />
    );

    const input = screen.getByLabelText('Add customization');
    fireEvent.change(input, { target: { value: '' } });

    const addButton = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(addButton);

    expect(onAddCustomization).not.toHaveBeenCalled();
  });

  it('does not call onAddCustomization when input value is whitespace', () => {
    render(
      <Customizations
        customizations={customizations}
        newCustomization=""
        onCustomizationChange={onCustomizationChange}
        onAddCustomization={onAddCustomization}
      />
    );

    const input = screen.getByLabelText('Add customization');
    fireEvent.change(input, { target: { value: '   ' } });

    const addButton = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(addButton);

    expect(onAddCustomization).not.toHaveBeenCalled();
  });
});
