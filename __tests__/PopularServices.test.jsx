import { render, screen, waitFor } from '@testing-library/react';
import { PopularServices } from '../components/home';
import { server } from '../mocks/mswSetup'
import { graphql } from 'msw';

// Mock the ServicesList component
jest.mock('../components/common/ServicesList', () => {
  return ({ services, title, loading, error, cols }) => (
    <div data-testid="services-list">
      {loading && <p>Loading...</p>}
      {error && <p>Error: Failed to fetch services</p>}
      {services && 
        <div>
          <h1>Popular Services</h1>
          <div data-testid='serivces'>
            {services.map(service => <div key={service.id}>{service.name}</div>)}
          </div>
        </div> 
      }
      {services?.length === 0 && <h1>No Services Avaliable</h1>}
    </div>
  );
});

describe('PopularServices Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state', () => {
    render(<PopularServices />);
    expect(screen.getByText('Loading...'))
  });

  it('displays error message', async () => {
    // Mock a network error in MSW
    server.use(
      graphql.query('popularServices', (req, res, ctx) => {
        return res(ctx.status(400), ctx.errors([{ message: 'Failed to fetch services' }]));
      })
    );
    
    render(<PopularServices />);
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch services')).toBeInTheDocument();
      expect(screen.queryByText('Popular Services')).not.toBeInTheDocument();
      expect(screen.queryByText(/Service 1/)).toBeNull(); // Ensure no services are displayed
    });
  });

  it('displays services when data is fetched successfully', async () => {
    render(<PopularServices />);
    await waitFor(() => {
      expect(screen.getByText('Plant Care')).toBeInTheDocument();
      expect(screen.getByText('Cleaning House')).toBeInTheDocument();

      const servicesList = screen.getByTestId('services-list');
      expect(servicesList).toHaveTextContent('Popular Services');
    })
  });

  it('displays no services when is no services ', async () => {
    render(<PopularServices />);

    server.use(
      graphql.query('popularServices', (req, res, ctx) => {
        return res(ctx.status(200), ctx.data({services: []}));
      })
    );

    await waitFor(() => {
      expect(screen.getByText('Popular Services')).toBeInTheDocument()
      expect(screen.getByText('No Services Avaliable')).toBeInTheDocument();
    })
  });

  it('displays fewer than 4 services when only 2 are fetched', async () => {
    server.use(
      graphql.query('popularServices', (req, res, ctx) => {
        return res(ctx.data({ services: [
          { id: '1', name: 'Service 1' },
          { id: '2', name: 'Service 2' }
        ] }));
      })
    );

    render(<PopularServices />);
    
    await waitFor(() => {
      const servicesList = screen.getByTestId('services-list');
      expect(servicesList).toHaveTextContent('Service 1');
      expect(servicesList).toHaveTextContent('Service 2');
      expect(servicesList).not.toHaveTextContent('Service 3');
    });
  });
  
});