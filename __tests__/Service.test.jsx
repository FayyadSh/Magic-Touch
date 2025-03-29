import { render, screen } from "@testing-library/react";
import { Service } from "../components/common";
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';

jest.mock('next/link', () => ({ children, href }) => <a href={href}>{children}</a>);
jest.mock('next/image', () => (props) => <img {...props} />);

const mockService = {
  name: 'Test Service',
  category: 'Test Category',
  image: { url: '/test-image.jpg' },
  time: '3',
  title: 'Test Service Title'
};

describe('Service component additional tests', () => {
  
  it('renders correctly when some props are missing', () => {
    const incompleteService = {
      name: 'Partial Service',
      category: 'Partial Category',
      image: { url: '/test-image.jpg' }
      // No `time` or `title` props
    };

    render(<Service service={incompleteService} />);

    expect(screen.getByText('Partial Category')).toBeInTheDocument();
    expect(screen.getByText('Partial Service')).toBeInTheDocument();

    expect(screen.queryByText('Test Service Title')).not.toBeInTheDocument();
  });

  it('renders hover and other CSS classes', () => {
    render(<Service service={mockService} />);
    const containerDiv = screen.getByRole('link').parentElement;

    // Check initial class list
    expect(containerDiv).toHaveClass('hover:shadow-primary');
    expect(containerDiv).toHaveClass('transition-all');

    // Simulate hover state with `userEvent`
    user.hover(containerDiv);
  });

  it('ensures button click works (although it doesn’t perform action)', () => {
    render(<Service service={mockService} />);

    const button = screen.getByRole('button', { name: /book now/i });

    // Simulate button click
    user.click(button);

    // Since the button doesn’t trigger any actions in the component, we just assert it’s clickable
    expect(button).toBeEnabled();
  });

  it('links to the correct URL with special characters in service name and category', () => {
    const specialCharService = {
      ...mockService,
      name: 'Test Service & Repair',
      category: 'Cleaning/Repair'
    };

    render(<Service service={specialCharService} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/services/service?service-name=Test Service & Repair&category=Cleaning/Repair'
    );
  });

  it('renders correctly when all props are provided', () => {
    render(<Service service={mockService} />);

    expect(screen.getByText(mockService.category)).toBeInTheDocument();
    expect(screen.getByText(mockService.name)).toBeInTheDocument();
    expect(screen.getByText(/3 hours/i)).toBeInTheDocument();
    expect(screen.getByText(mockService.title)).toBeInTheDocument();
  });

  it('renders the correct service image', () => {
    render(<Service service={mockService} />);

    const image = screen.getByAltText('service image');
    expect(image).toHaveAttribute('src', mockService.image.url);
    expect(image).toHaveAttribute('width', '300');
    expect(image).toHaveAttribute('height', '200');
  });
  
});