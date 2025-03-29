import { render, screen, waitFor } from '@testing-library/react';
import { server } from '../mocks/mswSetup';
import { graphql } from 'msw';
import { useParams } from 'next/navigation'; // Import useParams
import CategoryPage from '../app/(routes)/categories/[category]/page';

jest.mock('../components/common/ServicesList', 
    () => jest.fn(({title, services, error, loading}) => (
        <div data-testid="services-list">
            {services&&<h1>{title}</h1>}

            {error ?  <div>Error: Failed To Fetch Service</div>
            : loading ?  <div>Loading...</div>
            : services?.length === 0 && !error ?  <h1>No Results Found for {title}</h1>
            : services?.map(service => <div key={service?.id}>{service?.name}</div>)
            }
        </div>
    ))
);

jest.mock('next/navigation', () => ({
    useParams: jest.fn(), // Mock useParams
}));


describe('CategoryPage Component', () => {

    it('should render the component with correct title', async () => {
        const mockParams = { category: 'Cleaning' };
        useParams.mockReturnValue(mockParams); // Set mock return value

        render(<CategoryPage />);

        expect(await screen.findByText(/Cleaning Services/i)).toBeInTheDocument();
    });

    it('should show loading state when fetching data', () => {
        const mockParams = { category: 'Cleaning' };
        useParams.mockReturnValue(mockParams);
        render(<CategoryPage />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should show error message if fetching data fails', async () => {
         const mockParams = { category: 'Cleaning' };
        useParams.mockReturnValue(mockParams);
        render(<CategoryPage />);

        server.use(
            graphql.query('Category', (req, res, ctx) => {
                return res(ctx.status(400), ctx.errors([{ message: 'Failed to fetch services' }]));
            })
        );
        await waitFor(() => {
            expect(screen.getByText(/Failed To Fetch Service/i)).toBeInTheDocument();
        })
    });

    it('renders with empty services data correctly', async () => {
        const mockParams = { category: 'undefined' };
        useParams.mockReturnValue(mockParams);
        render(<CategoryPage />);

        server.use(
            graphql.query('Category', (req, res, ctx) => {
                return res(ctx.data({ services: []}));
            }),
        );

        await waitFor(() => {
            const headings = screen.getAllByRole('heading', { name: /undefined Services/i });
            expect(headings.length).toBe(2); // Make sure only one heading is found
            expect(headings[0]).toBeInTheDocument(); // Check that the correct heading is present
            expect(screen.getByText(/No Results Found for undefined services/i)).toBeInTheDocument();
        });
    });
});