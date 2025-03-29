import { render, screen, waitFor } from '@testing-library/react';
import SearchService from '../app/(routes)/search/[service]/page';
import { useParams } from 'next/navigation';
import { server } from '../mocks/mswSetup';
import { graphql } from 'msw';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('../components/common/ServicesList', 
  () => jest.fn(({title, services, error, loading}) => {
    if(error) console.log(error)
    return (
      <div data-testid="services-list">
          {services && <h1> {title}</h1>}

          {error ?  <div>Error: Failed To Fetch Service</div>
          : loading ?  <div>Loading...</div>
          : services?.length === 0 && !error ?  <h1>No Results Found for {title}</h1>
          : services?.map(service => <div key={service?.id}>{service?.name}</div>)
          }
      </div>
  )})
);

describe('Page Component', () => {

  const mockUseParams = (service = 'react js') => {
    useParams.mockReturnValue({ service });
   };

  beforeEach(() => {
    mockUseParams()
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

it('renders the loading state correctly', () => {
    render(<SearchService />);

    // Verify the loading state
    expect(screen.queryByText(/electric Resutls/i)).not.toBeInTheDocument()
    expect(screen.getByTestId('services-list')).toBeInTheDocument(); // Assuming there's a loading indicator within the ServicesList component.
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders with empty services data correctly', async () => {
    mockUseParams('undefinded-param')
    render(<SearchService />);

    server.use(
      graphql.query('searchService', (req, res, ctx) => {
        return res(ctx.data({ services: []}));
      }),
    )
    await waitFor(() => {
      expect(screen.getAllByRole('heading', {name:/Undefinded-param Results/i})[0]).toBeInTheDocument()
      expect(screen.getByText(/No Results Found for undefinded-param/i)).toBeInTheDocument();
    });
  });

  it('renders the services data correctly', async () => {
    mockUseParams('undefined')

    render(<SearchService />);

    server.use(
      graphql.query('searchService', (req, res, ctx) => {
        return res(ctx.status(400), ctx.errors([{ message: 'Failed to fetch services' }]));
      })
    )
    await waitFor(() => {
      expect(screen.queryByText(/undefined Results/i)).not.toBeInTheDocument()
      expect(screen.getByText(/Error: Failed To Fetch Service/i)).toBeInTheDocument();
    });
  });
  
it('renders the services data correctly', async () => {
    // Mock useParams for the query
    mockUseParams('cleaning');
    render(<SearchService />);

    // Verify the loading state
    expect(screen.getByTestId('services-list')).toBeInTheDocument(); // Assuming there's a loading indicator within the ServicesList component.

    await waitFor(() => {
      expect(screen.getByText(/cleaning results/i)).toBeInTheDocument();
      screen.debug()
      expect(screen.getByText(/plant care/i)).toBeInTheDocument();
      expect(screen.getByText(/cleaning house/i)).toBeInTheDocument();

    });
  });
});
