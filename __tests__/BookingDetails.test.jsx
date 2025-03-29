import { render, screen } from '@testing-library/react';
import { BookingItem } from '../components/booking';

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt }) => <img src={src} alt={alt} />,
}));

describe('Booking Component', () => {
    const mockBooking = {
        date: '2024-10-06 14:00',
        services: [
            {
                image: { url: 'http://example.com/image.jpg' },
                name: 'Spa Treatment',
                category: 'Wellness',
                price: 100,
            },
        ],
    };

    test('renders booking details correctly', () => {
        render(<BookingItem booking={mockBooking} />);

        // Check if the date and time are displayed
        expect(screen.getByText(/2024-10-06/)).toBeInTheDocument(); // Date
        expect(screen.getByText(/14:00/)).toBeInTheDocument(); // Time

        // Check if the service details are displayed
        expect(screen.getByText('Spa Treatment')).toBeInTheDocument();
        expect(screen.getByText('Wellness')).toBeInTheDocument();
        expect(screen.getByText('Price : 100 $')).toBeInTheDocument();
        
        // Check if the image is rendered
        const image = screen.getByAltText('booking image');
        expect(image).toHaveAttribute('src', 'http://example.com/image.jpg');
    });

    test('renders without crashing with missing booking data', () => {
        render(<BookingItem booking={{date:'', services:[]}} />); // Pass an 
        // 
        // 
        // 
        //   object

        // Ensure no errors occur and that it handles missing data gracefully
        expect(screen.queryByText('2025-10-06')).not.toBeInTheDocument();
        expect(screen.queryByText('14:00')).not.toBeInTheDocument();
        expect(screen.queryByText('Price :')).not.toBeInTheDocument();
    });

    test('handles booking with no services gracefully', () => {
        const bookingWithoutServices = {
            date: '2025-10-06 14:00',
            services: [],
        };

        render(<BookingItem booking={bookingWithoutServices} />);

        // Check if the date and time are displayed
        expect(screen.getByText(/2025-10-06/)).toBeInTheDocument(); // Date
        expect(screen.getByText(/14:00/)).toBeInTheDocument(); // Time

        // Ensure service details are not displayed
        expect(screen.queryByText('Price :')).not.toBeInTheDocument();
        expect(screen.queryByText('Spa Treatment')).not.toBeInTheDocument();
        expect(screen.queryByText('Wellness')).not.toBeInTheDocument();
    });

    test('handles missing price gracefully', () => {
        const bookingWithNoPrice = {
            date: '2025-10-06 14:00',
            services: [
                {
                    image: { url: 'http://example.com/image.jpg' },
                    name: 'Facial Treatment',
                    category: 'Beauty',
                },
            ],
        };

        render(<BookingItem booking={bookingWithNoPrice} />);

        expect(screen.getByText('Facial Treatment')).toBeInTheDocument();
        expect(screen.getByText('Beauty')).toBeInTheDocument();
        
        // Ensure it doesn't crash or render incorrect info
        expect(screen.queryByText('Price :')).not.toBeInTheDocument();
    });

});
