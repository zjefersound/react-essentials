import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Textarea, TextareaProps } from './Textarea';

describe('Textarea Component', () => {
  const renderComponent = (props?: TextareaProps) => {
    render(<Textarea {...props} />);
  };

  it('should render the textarea correctly', () => {
    renderComponent();
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('should accept and display placeholder text', () => {
    const placeholderText = 'Enter some text...';
    renderComponent({ placeholder: placeholderText });
    const textarea = screen.getByPlaceholderText(placeholderText);
    expect(textarea).toBeInTheDocument();
  });

  it('should allow typing into the textarea', async () => {
    renderComponent();
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Hello, World!');
    expect(textarea).toHaveValue('Hello, World!');
  });

  it('should handle disabled state', () => {
    renderComponent({ disabled: true });
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('should apply additional className prop', () => {
    const additionalClass = 'custom-class';
    renderComponent({ className: additionalClass });
    const rootElement = screen.getByRole('textbox').parentElement;
    expect(rootElement).toHaveClass(additionalClass);
  });
});
