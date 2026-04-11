import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MemberProfile from '../MemberProfile';

describe('MemberProfile Component', () => {
  const mockMember = {
    id: 'm1',
    prenom: 'Аслан',
    nom: 'Базаров',
    profession: 'Юрист',
    teip: 'Шолой',
    village: 'Шали',
    age: '30',
    ville: 'Страсбург',
    pays: 'Франция',
    isLegalDefender: true,
    whatsapp: '33612345678',
    telegram: '@aslan_b'
  };

  const mockOnClose = vi.fn();

  it('renders member name and profession correctly', () => {
    render(<MemberProfile member={mockMember} onClose={mockOnClose} />);
    
    expect(screen.getByText(/Аслан Базаров/i)).toBeInTheDocument();
    // Use getAllByText because "Юрист" appears in both profession and badge
    expect(screen.getAllByText(/Юрист/i).length).toBeGreaterThan(0);
  });

  it('displays the legal defender badge when applicable', () => {
    render(<MemberProfile member={mockMember} onClose={mockOnClose} />);
    
    // Specifically look for the badge text
    expect(screen.getAllByText(/ЮРИСТ/i).length).toBeGreaterThan(0);
  });

  it('calls onClose when close button is clicked', () => {
    render(<MemberProfile member={mockMember} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText(/Закрыть/i);
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('contains WhatsApp and Telegram buttons', () => {
    render(<MemberProfile member={mockMember} onClose={mockOnClose} />);
    
    expect(screen.getByText(/WHATSAPP/i)).toBeInTheDocument();
    expect(screen.getByText(/TELEGRAM/i)).toBeInTheDocument();
  });
});
