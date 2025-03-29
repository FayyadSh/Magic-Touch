// src/mocks/mswSetup.js
import { graphql } from 'msw'; // Import the GraphQL handler for mocking GraphQL requests
import { setupServer } from 'msw/node';

// Define mock data for testing
const mockCategories = [
    { title: "Category 1", icon: { url: "icon1.png" } },
    { title: "Category 2", icon: { url: "icon2.png" } },
];

const mockServices = [
    { name: "Plant Care", id: "1", image: { url: "service1.png" }, price: 100, category: "gardening", time: "1 hour" },
    { name: "Cleaning House", id: "2", image: { url: "service2.png" }, price: 150, category: "cleaning", time: "2 hours" },
];

const mockServiceDetails = {
    name: "Service 1",
    image: { url: "service1.png" },
    contactEmail: "service1@example.com",
    category: "Category 1",
    description: "Description of Service 1",
    price: 100,
    time: "1 hour",
    id: "1",
};

const mockUserBookingHistory = [
    {
        id: "1",
        date: 'Fri Oct 11 2024 19:23:32 GMT+0300 (Arabian Standard Time)',
        services: [{ name: "Cleaning House", image: { url: "service1.png" }, price: 100, category: "Category 1", contactEmail: "service1@example.com", time: "12:00" }],
    },
];

// Setup the MSW server with mocked GraphQL responses
export const server = setupServer(
    // Mock the 'Categories' query to return mockCategories
    graphql.query('Categories', (req, res, ctx) => {
        return res(ctx.data({ categories: mockCategories }));
    }),

    // Mock the 'Category' query to return mockServices (services for a particular category)
    graphql.query('Category', (req, res, ctx) => {
        return res(ctx.data({ services: mockServices }));
    }),

    // Mock the 'Service' query to return a single service (mockServiceDetails)
    graphql.query('Service', (req, res, ctx) => {
        return res(ctx.data({ services: [mockServiceDetails] }));
    }),

    // Mock the 'searchService' query to return mockServices based on search criteria
    graphql.query('searchService', (req, res, ctx) => {
        return res(ctx.data({ services: mockServices }));
    }),

    // Mock the 'popularServices' query to return popular services (mockServices)
    graphql.query('popularServices', (req, res, ctx) => {
        return res(ctx.data({ services: mockServices }));
    }),

    // Mock the 'CreateBooking' mutation to simulate creating a booking and returning the booking date
    graphql.mutation('CreateBooking', (req, res, ctx) => {
        const { useremail, username, time, date, services } = req.variables.data;
        // Respond with the booking date and success (publish count)
        return res(ctx.data({ createBooking: { date }, publishManyBookings: { count: 1 } }));
    }),

    // Mock the 'serviceBookedSlot' query to simulate fetching available slots for a service on a specific date
    graphql.query('serviceBookedSlot', (req, res, ctx) => {
        const { serviceId, date } = req.variables.where;
        // Respond with mock booked slots for the service on the specified date
        return res(ctx.data({ bookings: [{ date, time: "10:00 AM" }, { date, time: "2:00 PM" }] }));
    }),

    // Mock the 'userBookingHistory' query to return the mock user booking history
    graphql.query('userBookingHistory', (req, res, ctx) => {
        return res(ctx.data({ bookings: mockUserBookingHistory }));
    })
);
