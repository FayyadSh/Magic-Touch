import { render, screen } from '@testing-library/react';
import { ServicesList } from '../components/common';
import { Service } from '../components/common';
import { ServicesListSkeleton } from '../components/ui/skeletons';
import { NoContent, Error } from '../components/ui'

jest.mock('../components/common/Service');
jest.mock('../components/ui/skeletons/ServicesListSkeleton');
jest.mock('../components/ui/Error');
jest.mock('../components/ui/NoContent');

describe('ServicesList Component', () => {
  const mockServices = [
    { name: 'Service 1' },
    { name: 'Service 2' },
  ];

  beforeEach(() => {
    Service.mockImplementation(({ service }) => <div>{service?.name}</div>);
    ServicesListSkeleton.mockImplementation(() => <div>Loading...</div>);
    Error.mockImplementation(({ error }) => <div>Error: {error}</div>);
    NoContent.mockImplementation(() => <div>No services available</div>);
  });

  it('renders the title when services are provided', () => {
    render(<ServicesList title="Our Services" services={mockServices} loading={false} error={null} />);
    expect(screen.getByText('Our Services')).toBeInTheDocument();
  });

  it('renders loading skeleton when loading is true', () => {
    render(<ServicesList title="Our Services" services={[]} loading={true} error={null} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when error exists', () => {
    render(<ServicesList title="Our Services" services={[]} loading={false} error="Failed to fetch services" />);
    expect(screen.getByText('Error: Failed to fetch services')).toBeInTheDocument();
  });

  it('renders NoContent state when no services are available', () => {
    render(<ServicesList title="Our Services" services={[]} loading={false} error={null} />);
    expect(screen.getByText('No services available')).toBeInTheDocument();
  });

  it('renders services when they are provided', () => {
    render(<ServicesList title="Our Services" services={mockServices} loading={false} error={null} />);
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Service 2')).toBeInTheDocument();
  });

  it('applies correct grid class based on the number of columns', () => {
    const { container } = render(<ServicesList title="Our Services" services={mockServices} cols={3} loading={false} error={null} />);
    expect(container.querySelector('.grid-cols-3')).toBeInTheDocument();
  });

  it('defaults to 4 columns when invalid cols value is provided', () => {
    const { container } = render(<ServicesList title="Our Services" services={mockServices} cols={10} loading={false} error={null} />);
    expect(container.querySelector('.grid-cols-4')).toBeInTheDocument();
  });

  it('applies 1-column layout when cols is set to 1', () => {
    const { container } = render(<ServicesList title="Our Services" services={mockServices} cols={1} loading={false} error={null} />);
    expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
  });

  it('does not render services if none are passed', () => {
    render(<ServicesList title="Our Services" loading={false} error={null} />);
    expect(screen.queryByText('Service 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Service 2')).not.toBeInTheDocument();
  });

  it('renders correctly even when no title is provided', () => {
    render(<ServicesList services={mockServices} loading={false} error={null} />);
    
    // Should render services without a title
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Service 2')).toBeInTheDocument();
    expect(screen.queryByText('Our Services')).not.toBeInTheDocument();
  });

  it('renders error message even if loading is true', () => {
    render(<ServicesList title="Our Services" services={mockServices} loading={true} error="Error occurred" />);
    expect(screen.getByText('Error: Error occurred')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

});