import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LanguageModal from '../LanguageModal';

describe('LanguageModal Component', () => {
  const mockOnClose = vi.fn();

  it('renders correctly when isOpen is true', () => {
    render(<LanguageModal isOpen={true} onClose={mockOnClose} />);
    
    // Check main title in Russian Cyrillic
    expect(screen.getByText(/Учи Чеченский Язык/i)).toBeInTheDocument();
    
    // Check school name - use getAllByText because it appears in header and link
    expect(screen.getAllByText(/ИШКОЛА/i).length).toBeGreaterThanOrEqual(2);
  });

  it('returns null when isOpen is false', () => {
    const { container } = render(<LanguageModal isOpen={false} onClose={mockOnClose} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onClose when the close button is clicked', () => {
    render(<LanguageModal isOpen={true} onClose={mockOnClose} />);
    
    // The close button has an X and might not have aria-label yet, let's use the svg parent or query.
    // For now we'll add an aria-label in the real component if needed, or select by role=button without text.
    // In our component it's just a button.
    const closeBtns = screen.getAllByRole('button');
    fireEvent.click(closeBtns[0]); // The close button
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('contains the correct external links for iShkola', () => {
    render(<LanguageModal isOpen={true} onClose={mockOnClose} />);
    
    const whatsappLink = screen.getByRole('link', { name: /Ватсап: \+7 928 290 53 89/i });
    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/79282905389');

    const websiteLink = screen.getByRole('link', { name: /Перейти на сайт ИШКОЛА/i });
    expect(websiteLink).toHaveAttribute('href', 'https://ishkola.com/chechen-language/');
  });
});
