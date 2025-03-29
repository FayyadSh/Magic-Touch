import { render, screen } from '@testing-library/react';
import { BookingHistoryList } from '../components/booking';

// Mocking dependent components
jest.mock('../components/ui/Error', () => jest.fn(({ error }) => <div>{error.message}</div>));
jest.mock('../components/ui/skeletons/UserBookingHistorySkeleton', () => () => <div>Loading...</div>);
jest.mock('../components/ui/NoContent', () => ({ text }) => <div>No Bookings Yet</div>);
jest.mock('../components/booking/BookingItem', () => ({ booking }) => <div>Booking ID: {booking.id}</div>);

describe('BookingHistoryList', () => {

    it('renders multiple bookings correctly', () => {
        const bookings = [
            { id: '1' },
            { id: '2' },
            { id: '3' },
        ];

        render(<BookingHistoryList userBookingHistory={bookings} loading={false} error={null} />);

        expect(screen.getByText('Booking ID: 1')).toBeInTheDocument();
        expect(screen.getByText('Booking ID: 2')).toBeInTheDocument();
        expect(screen.getByText('Booking ID: 3')).toBeInTheDocument();
    });

    it('renders correctly when userBookingHistory is an empty array', () => {
        render(<BookingHistoryList userBookingHistory={[]} loading={false} error={null} />);

        expect(screen.getByText('No Bookings Yet')).toBeInTheDocument();
    });

    it('handles a large number of bookings', () => {
        const bookings = Array.from({ length: 100 }, (_, index) => ({ id: `${index + 1}` }));

        render(<BookingHistoryList userBookingHistory={bookings} loading={false} error={null} />);

        bookings.forEach(booking => {
            expect(screen.getByText(`Booking ID: ${booking.id}`)).toBeInTheDocument();
        });
    });

    it('should render correct number of booking elements', () => {
        const bookings = [{ id: '1' }, { id: '2' }, { id: '3' }];

        render(<BookingHistoryList userBookingHistory={bookings} loading={false} error={null} />);

        const bookingElements = screen.getAllByText(/Booking ID:/);
        expect(bookingElements.length).toBe(bookings.length); // Should match the number of bookings
    });

    it('should show only error message when loading is true and error is present', () => {
        const error = new Error('Error loading bookings');
        
        render(<BookingHistoryList userBookingHistory={[]} loading={true} error={error} />);

        expect(screen.getByText(error.message)).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        expect(screen.queryByText('No Bookings Yet')).not.toBeInTheDocument();
    });

    it('renders error message correctly with different error types', () => {
        const errors = [
            new Error('Network Error'),
            new Error('Server Error'),
            new Error('Authentication Error'),
        ];

        errors.forEach((error) => {
            render(<BookingHistoryList userBookingHistory={[]} loading={false} error={error} />);
            expect(screen.getByText(error.message)).toBeInTheDocument();
            // Cleanup after each render
            jest.clearAllMocks();
        });
    });

    it('does not render when loading is true and userBookingHistory is empty', () => {
        render(<BookingHistoryList userBookingHistory={[]} loading={true} error={null} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('No Bookings Yet')).not.toBeInTheDocument();
        expect(screen.queryByText(/Booking ID:/)).not.toBeInTheDocument();
    });

    it('handles multiple concurrent updates to userBookingHistory', () => {
        const { rerender } = render(<BookingHistoryList userBookingHistory={[]} loading={false} error={null} />);
        
        expect(screen.getByText('No Bookings Yet')).toBeInTheDocument();

        rerender(<BookingHistoryList userBookingHistory={[{ id: '1' }]} loading={false} error={null} />);
        expect(screen.getByText('Booking ID: 1')).toBeInTheDocument();

        rerender(<BookingHistoryList userBookingHistory={[{ id: '2' }, { id: '3' }]} loading={false} error={null} />);
        expect(screen.getByText('Booking ID: 2')).toBeInTheDocument();
        expect(screen.getByText('Booking ID: 3')).toBeInTheDocument();
    });

    it('renders loading state correctly multiple times', () => {
        const { rerender } = render(<BookingHistoryList userBookingHistory={[]} loading={true} error={null} />);
        
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        rerender(<BookingHistoryList userBookingHistory={[]} loading={true} error={null} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument(); // Should still show loading
        
        rerender(<BookingHistoryList userBookingHistory={[]} loading={false} error={null} />);
        expect(screen.getByText('No Bookings Yet')).toBeInTheDocument();

        rerender(<BookingHistoryList userBookingHistory={[]} loading={true} error={null} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders correctly with large booking history', () => {
        const bookings = Array.from({ length: 50 }, (_, index) => ({ id: `${index + 1}` }));

        render(<BookingHistoryList userBookingHistory={bookings} loading={false} error={null} />);

        bookings.forEach((booking) => {
            expect(screen.getByText(`Booking ID: ${booking.id}`)).toBeInTheDocument();
        });
    });

    it('does not display the empty message if loading is true', () => {
        render(<BookingHistoryList userBookingHistory={[]} loading={true} error={null} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('No Bookings Yet')).not.toBeInTheDocument();
    });

});
