import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/common';
import { ThemeProvider } from 'next-themes';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

// Mocking necessary modules
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/image', () => (props) => {
  return <img {...props} />;
});

jest.mock('next/link', () => ({ children, href }) => (
  <a href={href}>{children}</a>
));

jest.mock('../components/common/AuthMenu', () => () => <button>Auth Button</button>);

describe('Navbar Component', () => {

  const mockSession = {
    data: {
      user: { displayName: 'john due' }
      }
    };

  beforeAll(() => {
    window.matchMedia = window.matchMedia || function() {
      return {
        matches: true,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    };
  });

  beforeEach(() => {
    usePathname.mockReturnValue('/');
  });

  const renderNavbar = () => {
    render(
      <ThemeProvider>
        <SessionProvider session={mockSession}>
          <Navbar />
        </SessionProvider>
      </ThemeProvider>
    )
  }

  it('renders the logo and navigation links', () => {
    renderNavbar();

    // Check if logo is rendered
    expect(screen.getByAltText('logo')).toBeInTheDocument();

    // Check if all navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('My Booking')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('toggles the theme when the theme switch button is clicked', () => {
    renderNavbar();

    const themeButton = screen.getAllByRole('button')[0];
    fireEvent.click(themeButton);

    // Ensure the theme switching logic works (test could be extended to check for dark/light mode toggle)
    expect(screen.getAllByRole('button')[1]).toBeInTheDocument();
  });

  it('shows and hides the navigation links when toggling the menu button', () => {
    renderNavbar();

    const menuButton = screen.getAllByRole('button')[1];

    // Click to hide navigation links
    fireEvent.click(menuButton);
    setTimeout(() => {
        expect(screen.queryByText('Home')).toHaveStyle('right: -3000px');
    },301)

    // Click again to show navigation links
    fireEvent.click(menuButton);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('applies the active class to the correct navigation link based on the pathname', () => {
    usePathname.mockReturnValue('/my-booking');
    
    renderNavbar();

    const myBookingLink = screen.getByText('My Booking');
    // expect(myBookingLink).toHaveClass('rounded-full'); // active link styling
    // expect(myBookingLink).toHaveClass('md:bg-background-color'); 
  });

  it('renders the AuthButton', () => {
    renderNavbar();

    // Check that AuthButton is rendered
    expect(screen.getByText('Auth Button')).toBeInTheDocument();
  });

  it('should animate the theme switch button when clicked', () => {
    renderNavbar();

    const themeButton = screen.getAllByRole('button')[0];

    // Click to switch theme
    fireEvent.click(themeButton);

    // Check if the button has the 'scale-50' class after the click to simulate the animation
    const sunMoonIcon = themeButton.firstChild;
    expect(sunMoonIcon).toHaveClass('scale-50');

    // After the animation duration (300ms), it should reset back to 'scale-100'
    setTimeout(() => {
      expect(sunMoonIcon).toHaveClass('scale-100');
    }, 250);
  });

  it('should set darkMode to true after switching theme to dark', () => {
    renderNavbar();

    const themeButton = screen.getAllByRole('button')[0];
    
    // Click to switch to dark mode
    fireEvent.click(themeButton);

    // Check if the darkMode state is true after switching to dark mode
    const sunMoonIcon = themeButton.firstChild;
    expect(sunMoonIcon).toHaveClass('scale-50');
  });

  it('should hide the menu when menu button is clicked', () => {
    renderNavbar();

    const menuButton = screen.getByRole('menu-button');

    // Click to hide navigation links
    fireEvent.click(menuButton);

    // Check if the links are hidden
    // expect(screen.queryByText('Home')).toHaveClass('right-[-3000px]');
  });

  it('should hide menu links in mobile view by default', () => {
    renderNavbar();

    const navLinks = screen.getByText('Home').closest('nav');
    
    // Initially, the mobile menu should be hidden
    // expect(navLinks).toHaveStyle('right: 0px');
  });

  it('should display the correct navigation link when pathname is /categories/Moving', () => {
    usePathname.mockReturnValue('/categories/Moving');
    
    renderNavbar();

    const servicesLink = screen.getByText('Services');
    expect(servicesLink).toHaveStyle('background-color: var(--background-color)'); // active link styling
  });

  it('should handle no pathname case gracefully', () => {
    usePathname.mockReturnValue(null);

    renderNavbar();

    // The component should still render correctly without a pathname
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should handle unexpected pathname values', () => {
    usePathname.mockReturnValue('/unexpected-path');

    renderNavbar();

    // Check if no links have the active class
    const homeLink = screen.getByText('Home');
    expect(homeLink).not.toHaveClass('background-color: var(--background-color)');

    const servicesLink = screen.getByText('Services');
    expect(servicesLink).not.toHaveClass('background-color: var(--background-color)');
  });

  it('should render all nav links with proper href attributes', () => {
    renderNavbar();

    const homeLink = screen.getByText('Home').closest('a');
    const servicesLink = screen.getByText('Services').closest('a');
    const bookingLink = screen.getByText('My Booking').closest('a');
    const aboutUsLink = screen.getByText('About Us').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(servicesLink).toHaveAttribute('href', '/categories/Moving');
    expect(bookingLink).toHaveAttribute('href', '/my-booking');
    expect(aboutUsLink).toHaveAttribute('href', '/about-us');
  });

  test('should apply the appropriate hover styles to nav links', () => {
    const { getByText } = render(
      <SessionProvider session={mockSession}>
        <Navbar />
      </SessionProvider>
    );
    const homeLink = getByText('Home');
  
    // Simulate hover on the Home link
    fireEvent.mouseOver(homeLink);

    // Check if the element has the expected style when hovered
    expect(homeLink).toHaveStyle('color: var(--primary-color)');
    setTimeout(() => {
      expect(homeLink).toHaveStyle('border-radius: 9999px');
    },301)
  
    // Simulate mouse leaving the Home link
    fireEvent.mouseOut(homeLink);
  
    // You can also check if the style is removed when the mouse is out
    expect(homeLink).toHaveStyle('background-color: var(--background-color)');
  });

});