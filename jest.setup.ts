// jest.setup.ts
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Customizations, { CustomizationType } from './Customizations';
import Customizations from './Customizations';
import services from './services';
import jest, { MockFunction } from 'next/jest';
import jest from 'next/jest';
import { beforeEach } from 'node:test';

interface SetupProps {
  customizations: CustomizationType[];
  onCustomizationChange: MockFunction<(value: string) => void>;
  onAddCustomization: MockFunction<() => void>;
}

const { handler, create, update, delete: _delete, get } = setup();

export { handler, create, update, _delete, get };

export function setup(): SetupProps {
  const onCustomizationChange = jest.fn();
  const onAddCustomization = jest.fn();
  const customizations = [
export function setup() {
    const onCustomizationChange = jest.fn();
    const onAddCustomization = jest.fn();
    const customizations = [
        { name: 'Customization 1', price: 10 },
        { name: 'Customization 2', price: 20 },
    ];
    return {
        handler,
        create,
        update,
        delete: _delete,
        get,
        onCustomizationChange,
        onAddCustomization,
        customizations,
    };
}

export const setup = (): SetupProps => {
  const onCustomizationChange: MockFunction<(value: string) => void> = jest.fn();
  const onAddCustomization: MockFunction<() => void> = jest.fn();
  const customizations: CustomizationType[] = [
    { name: 'Customization 1', price: 10 },
    { name: 'Customization 2', price: 20 },
  ];
  return {
    customizations,
    onCustomizationChange,
    onAddCustomization,
  };
}
export default setup;

export const setupTest = () => {
export type Setup = ReturnType<typeof setup>;
export { render, screen, fireEvent };

export function setupTest() {

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

const customizations = [
  { name: 'Customization 1', price: 10 },
  { name: 'Customization 2', price: 20 },
];

const onCustomizationChange = jest.fn();
const onAddCustomization = jest.fn();

export function setup() {
  beforeEach(() => {
    jest.clearAllMocks();
    const { customizations, onCustomizationChange, onAddCustomization } = setup();
    render(
      <Customizations
        customizations={customizations}
        onCustomizationChange={onCustomizationChange}
        onAddCustomization={onAddCustomization}
      />
    );
  });
};
}

describe('Customizations', () => {
  setupTest();
export const { render, screen, fireEvent } = jest.requireMock('@testing-library/react') as typeof import('@testing-library/react');

  it('renders the component correctly', () => {
    expect(screen.getByText('Customizations')).toBeInTheDocument();
    expect(screen.getByText('Add any additional customizations to your order.')).toBeInTheDocument();
    expect(screen.getByLabelText('Add customization')).toBeInTheDocument();
    expect(screen.getByText('Customization 1')).toBeInTheDocument();
    expect(screen.getByText('Customization 2')).toBeInTheDocument();
  });
export default setup;

  it('calls onCustomizationChange when input value changes', () => {
    const input = screen.getByLabelText('Add customization');
    fireEvent.change(input, { target: { value: 'New customization' } });

    expect(screen.getByLabelText('Add customization').value).toBe('New customization');
    expect(onCustomizationChange).toHaveBeenCalledWith('New customization');
  });

  it('calls onAddCustomization when Add button is clicked', () => {
    const addButton = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(addButton);

    expect(onAddCustomization).toHaveBeenCalled();
  });

  it('calls onAddCustomization with correct customization when Add button is clicked', () => {
    const input = screen.getByLabelText('Add customization');
    fireEvent.change(input, { target: { value: 'Customization 3' } });

    const addButton = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(addButton);

    expect(onAddCustomization).toHaveBeenCalledWith({ name: 'Customization 3', price: 0 });
  });

  it('does not call onAddCustomization when input value is empty', () => {
    const input = screen.getByLabelText('Add customization');
    fireEvent.change(input, { target: { value: '' } });

    const addButton = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(addButton);

    expect(onAddCustomization).not.toHaveBeenCalled();
  });

  it('does not call onAddCustomization when input value is whitespace', () => {
    const input = screen.getByLabelText('Add customization');
    fireEvent.change(input, { target: { value: '   ' } });

    const addButton = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(addButton);

    expect(onAddCustomization).not.toHaveBeenCalled();
  });
});

export { render, screen, fireEvent, setupTest };
export {
  customizations,
  onCustomizationChange,
  onAddCustomization,
}}
