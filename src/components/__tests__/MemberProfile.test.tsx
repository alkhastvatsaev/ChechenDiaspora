import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MemberProfile from '../MemberProfile'

// On s'assure que Lucide ne pose pas de problèmes de rendu
vi.mock('lucide-react', () => ({
  X: () => <div data-testid="icon-x" />,
  MapPin: () => <div data-testid="icon-map-pin" />,
  Briefcase: () => <div data-testid="icon-briefcase" />,
  Calendar: () => <div data-testid="icon-calendar" />,
  Home: () => <div data-testid="icon-home" />,
  Shield: () => <div data-testid="icon-shield" />,
  Phone: () => <div data-testid="icon-phone" />,
  MessageCircle: () => <div data-testid="icon-whatsapp" />,
  ExternalLink: () => <div data-testid="icon-link" />,
  Heart: () => <div data-testid="icon-heart" />,
  GraduationCap: () => <div data-testid="icon-mentor" />,
  Gavel: () => <div data-testid="icon-legal" />,
  Truck: () => <div data-testid="icon-funeral" />,
  Map: () => <div data-testid="icon-map" />,
}))

describe('MemberProfile Component', () => {
  const mockMember = {
    prenom: 'Mansur',
    nom: 'Vainakh',
    profession: 'Avocat',
    teip: 'Belkhoy',
    village: 'Elistanzhi',
    age: 34,
    whatsapp: '33700000000',
    telegram: '@mansur_v',
    isLegalDefender: true,
    openToMentorship: true,
  }

  const mockOnClose = vi.fn()

  it('affiche correctement le nom et le métier du membre', () => {
    render(<MemberProfile member={mockMember} onClose={mockOnClose} />)
    
    expect(screen.getByText(/Mansur Vainakh/i)).toBeInTheDocument()
    expect(screen.getByText(/Бёлхи \/ Avocat/i)).toBeInTheDocument()
  })

  it('affiche les badges stratégiques (Avocat et Mentor)', () => {
    render(<MemberProfile member={mockMember} onClose={mockOnClose} />)
    
    expect(screen.getByText(/Бакъо \/ Юрист/i)).toBeInTheDocument()
    expect(screen.getByText(/Кхетам \/ Ментор/i)).toBeInTheDocument()
    expect(screen.getByTestId('icon-legal')).toBeInTheDocument()
    expect(screen.getByTestId('icon-mentor')).toBeInTheDocument()
  })

  it('déclenche window.open avec le bon lien WhatsApp lors du clic', () => {
    const windowSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<MemberProfile member={mockMember} onClose={mockOnClose} />)
    
    const whatsappButton = screen.getByText(/Ватсап/i).closest('button')
    if (whatsappButton) fireEvent.click(whatsappButton)
    
    expect(windowSpy).toHaveBeenCalledWith('https://wa.me/33700000000', '_blank')
    windowSpy.mockRestore()
  })

  it('appelle onClose lors du clic sur le bouton fermer', () => {
    render(<MemberProfile member={mockMember} onClose={mockOnClose} />)
    
    const closeButton = screen.getByTestId('icon-x').closest('button')
    if (closeButton) fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
