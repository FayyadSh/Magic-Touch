import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BookingSheet } from '../components/browsing'; // Update this path to match your actual component location
import { useSession } from 'next-auth/react';
import { createBooking, serviceBookedSlot } from '../utils/globalApi';
import { toast } from 'sonner';
import { sendEmail } from '../utils/email';

// Mock dependencies
jest.mock('next-auth/react');
jest.mock('../utils/globalApi', () => ({
  createBooking: jest.fn(),
  serviceBookedSlot: jest.fn(),
}));
jest.mock('../utils/email', () => ({
  sendEmail: jest.fn(),
}));
jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

describe('Booking Component', () => { // Changed from BookingSheet to Booking
  const mockServiceData = { id: 'service123', name: 'Test Service' };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock current date to a fixed value for consistent tests
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('loads time slots and marks booked slots', async () => {
    // Set mock date to mid-day to avoid time-based disabling
    const mockDate = new Date('2023-01-02T12:00:00'); // Noon
    jest.useFakeTimers().setSystemTime(mockDate);
  
    // Mock user session
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', name: 'Test User' } },
    });
  
    // Mock only 10:00 AM as booked
    serviceBookedSlot.mockResolvedValue({
      bookings: [{ time: '10:00 AM' }],
    });
  
    render(
      <BookingSheet serviceData={mockServiceData}>
        <button>Open Booking</button>
      </BookingSheet>
    );
  
    // Open the booking sheet
    fireEvent.click(screen.getByText('Open Booking'));
  
    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    });
  
    // Verify the booked slot is properly disabled
    const bookedSlotButton = screen.getByText('10:00 AM').closest('button');
    expect(bookedSlotButton).toBeDisabled();
    expect(bookedSlotButton).toHaveClass('disabled:opacity-50');
  
    // Verify an available slot is enabled
    // Using 2:00 PM as it's well after current mock time (12 PM)
    const availableSlotButton = screen.getByText('2:00 PM').closest('button');
    expect(availableSlotButton).not.toBeDisabled();
    expect(within(availableSlotButton).queryByText('Booked')).not.toBeInTheDocument();
  
    jest.useRealTimers();
  });

  test('allows selecting a date and time slot', async () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', name: 'Test User' } },
    });

    render(
      <BookingSheet serviceData={mockServiceData}>
        <button>Open Booking</button>
      </BookingSheet>
    );

    // Open the booking sheet
    fireEvent.click(screen.getByText('Open Booking'));

    // Select a date in the calendar - using a known date from the mocked time
    const dateButton = screen.getAllByText('2')[1];
    fireEvent.click(dateButton);

    // Select a time slot
    const timeSlot = screen.getByText('10:00 AM');
    fireEvent.click(timeSlot);

    // Assert that the time slot is selected (checking class name)
    expect(timeSlot).toHaveClass('bg-primary');
  });

  test('handles booking creation successfully', async () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', name: 'Test User' } },
    });
  
    createBooking.mockResolvedValue(); // Mock successful API call
  
    render(
      <BookingSheet serviceData={mockServiceData}>
        <button>Open Booking</button>
      </BookingSheet>
    );
  
    // Open the booking sheet
    fireEvent.click(screen.getByText('Open Booking'));
  
    // Select a date
    const dateButton = screen.getAllByText('2')[1];
    fireEvent.click(dateButton);
    
    // Select a time slot
    const timeSlot = screen.getByText('10:00 AM');
    fireEvent.click(timeSlot);
    
    // Assert the "Book" button is enabled
    const bookButton = screen.getByText('Book');
    expect(bookButton).not.toBeDisabled();

    // Click the "Book" button
    fireEvent.click(bookButton);
  
    // Wait for createBooking to be called
    await waitFor(() =>
      expect(createBooking).toHaveBeenCalledWith(
        'service123',         // Service ID
        expect.any(Date),     // Date object
        '10:00 AM',           // Selected time
        'test@example.com',   // User email
        'Test User'           // User name
      )
    );
  
    // Check that a toast notification was displayed
    expect(toast).toHaveBeenCalledWith('Booking Created Successfully!');
  });

  test('handles error when booking creation fails', async () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', name: 'Test User' } },
    });
  
    createBooking.mockRejectedValue(new Error('Booking failed')); // Mock API failure
  
    render(
      <BookingSheet serviceData={mockServiceData}>
        <button>Open Booking</button>
      </BookingSheet>
    );
  
    // Open the booking sheet
    fireEvent.click(screen.getByText('Open Booking'));
  
    // Select a date
    const dateButton = screen.getAllByText('2')[1];
    fireEvent.click(dateButton);
  
    // Select a time slot
    const timeSlot = screen.getByText('10:00 AM');
    fireEvent.click(timeSlot);
  
    // Click the "Book" button
    const bookButton = screen.getByText('Book');
    fireEvent.click(bookButton);
  
    // Wait for the error to be handled
    await waitFor(() => expect(createBooking).toHaveBeenCalled());
    
    // Check that an error toast is shown
    expect(toast).toHaveBeenCalledWith('Booking failed');
  });

  test('disables already booked time slots', async () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', name: 'Test User' } },
    });
  
    serviceBookedSlot.mockResolvedValue({
      bookings: [{ time: '10:30 AM' }], // Mock one booked slot
    });
  
    render(
      <BookingSheet serviceData={mockServiceData}>
        <button>Open Booking</button>
      </BookingSheet>
    );
  
    // Open the booking sheet
    fireEvent.click(screen.getByText('Open Booking'));
  
    // Wait for time slots to render
    await waitFor(() => expect(screen.getByText('10:30 AM')).toBeInTheDocument());
  
    // Check if the booked slot is disabled
    const bookedSlot = screen.getByText('10:30 AM');
    expect(bookedSlot).toBeDisabled();
  });

  test('prevents booking for past dates', () => {
  // Mock current date to January 2, 2023
  jest.useFakeTimers().setSystemTime(new Date('2023-01-02T12:00:00'));

  render(
    <BookingSheet serviceData={mockServiceData}>
      <button>Open Booking</button>
    </BookingSheet>
  );

  // Open the booking sheet
  fireEvent.click(screen.getByText('Open Booking'));

  // Find yesterday's date (January 1)
  const yesterdayButton = screen.getAllByRole('gridcell', { name: '1' })[0];
  
  // Check if the button has disabled attribute or class
  expect(yesterdayButton).toBeDisabled();
  // OR check for disabled class if toBeDisabled() doesn't work
  expect(yesterdayButton).toHaveClass('disabled:opacity-50');
  expect(yesterdayButton).toHaveAttribute('disabled');

  jest.useRealTimers();
  });

  test('enables book button only when both date and time are selected', () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', name: 'Test User' } },
    });

    render(
      <BookingSheet serviceData={mockServiceData}>
        <button>Open Booking</button>
      </BookingSheet>
    );
  
    // Open the booking sheet
    fireEvent.click(screen.getByText('Open Booking'));
  
    // Check if the "Book" button is initially disabled
    const bookButton = screen.getByText('Book');
    expect(bookButton).toBeDisabled();
  
    // Select a date
    const dateButton = screen.getAllByText('2')[1];
    fireEvent.click(dateButton);
  
    // Check if the "Book" button is still disabled after selecting a date
    expect(bookButton).toBeDisabled();
  
    // Select a time
    const timeSlot = screen.getByText('10:00 AM');
    fireEvent.click(timeSlot);
  
    // Check if the "Book" button is enabled after selecting both date and time
    expect(bookButton).not.toBeDisabled();
  });

  test('sends an email after a successful booking', async () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', name: 'Test User' } },
    });

    createBooking.mockResolvedValue();
    sendEmail.mockResolvedValue();
    serviceBookedSlot.mockResolvedValue({ bookings: [] });

    render(
      <BookingSheet serviceData={mockServiceData}>
        <button>Open Booking</button>
      </BookingSheet>
    );

    fireEvent.click(screen.getByText('Open Booking'));

    // Select a date
    const dateButton = screen.getAllByText('2')[1];
    fireEvent.click(dateButton);

    // Select a time slot
    const timeSlot = screen.getByText('6:00 PM');
    fireEvent.click(timeSlot);

    const bookButton = screen.getByText('Book');
    fireEvent.click(bookButton);

    await waitFor(() => {
        expect(createBooking).toHaveBeenCalled();
        expect(sendEmail).toHaveBeenCalledWith({
          username: 'Test User',
          email: 'test@example.com',
          date: expect.any(Date),
          selectedTime: '6:00 PM',
          service: 'Test Service',
        });
    });

    expect(toast).toHaveBeenCalledWith('Booking Created Successfully!');
  });

  test('disables past time slots when the selected date is today', () => {
    // Mock current time as 11:00 AM
    const mockDate = new Date('2023-01-01T11:00:00');
    jest.setSystemTime(mockDate);

    render(
      <BookingSheet serviceData={mockServiceData}>
        <button>Open Booking</button>
      </BookingSheet>
    );

    // Open the booking modal
    fireEvent.click(screen.getByText('Open Booking'));

    // Check that time slots before current time are disabled
    const pastTimeSlot = screen.getByText('10:00 AM');
    expect(pastTimeSlot).toBeDisabled();

    const futureTimeSlot = screen.getByText('6:00 PM');
    expect(futureTimeSlot).not.toBeDisabled();
  });

  test('enables all time slots when the selected date is not today', async () => {
    // Set mock date to January 1, 2023 at noon
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01T12:00:00'));
  
    render(
      <BookingSheet serviceData={mockServiceData}>
        <button>Open Booking</button>
      </BookingSheet>
    );
  
    // Open the booking modal
    fireEvent.click(screen.getByText('Open Booking'));
  
    // Select tomorrow's date (January 2)
    const tomorrow = new Date('2023-01-02');
    const tomorrowButton = screen.getAllByRole('gridcell', { 
      name: tomorrow.getDate().toString() 
    })[1];
    fireEvent.click(tomorrowButton);
  
    // Get all time slot buttons
    const timeSlotButtons = await screen.findAllByRole('button', {
      name: /^(1[0-2]|[1-6]):[0-5][0-9] (AM|PM)$/ // Matches time format
    });
  
    // Verify all time slots are enabled
    timeSlotButtons.forEach(button => {
      expect(button).toBeEnabled();
      expect(button).not.toHaveAttribute('disabled');
      expect(button).not.toHaveClass('disabled');
      expect(button).not.toHaveClass('opacity-50');
    });
  
    jest.useRealTimers();
  });
});