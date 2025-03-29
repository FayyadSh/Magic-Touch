const { request, gql } = require('graphql-request'); // Importing necessary functions for making GraphQL requests
const baseURL = 'https://ap-southeast-2.cdn.hygraph.com/content/clvm79trj0gjq07vzzuqpgim4/master'; // Base URL for the GraphQL API

// API token for authorization
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

// Headers for making authorized requests (bearer token)
const headers = {
    Authorization: `bearer ${API_TOKEN}`,
};

// Fetch categories from the GraphQL API
export const getCategories = async () => {
    const query = gql`
        query Categories {
            categories {
               title
               icon {
                url
                }
            }
        }
    `;
    // Make the request to the GraphQL endpoint
    const result = await request(baseURL, query);
    return result; // Return the fetched result
};

// Fetch services within a specific category
export const getCategoryServices = async (category) => {
    const query = gql`
        query Category {
            services(where: {category:"`+category+`"}) {
                name
                id
                image {
                    url
                }
                price
                category
                time
                id
            }
        }
    `;
    // Make the request with the category filter
    const result = await request(baseURL, query);
    return result; // Return the result containing services for the specified category
};

// Fetch details of a specific service by name
export const getServiceDetails = async (name) => {
    const query = gql`
        query Service {
            services(where: {name: "`+name+`"}) {
                name
                image {url}
                contactEmail
                category
                description
                price
                time
                id
            }
        }
    `;
    // Make the request for service details
    const result = await request(baseURL, query);
    return result; // Return the service details
};

// Search for services based on name
export const getSearchService = async (name) => {
    const query = gql`
        query searchService {
            services(where: {name_contains: "`+name+`"}) {
                name
                image {url}
                category
                time
            }
        }
    `;
    // Make the request for searched services
    const result = await request(baseURL, query);
    return result; // Return the search results for services
};

// Fetch popular services
export const getPopularServices = async () => {
    const query = gql`
        query popularServices {
            services {
                name 
                image { url }
                category 
                time
            }
        }
    `;
    // Make the request to fetch popular services
    const result = await request(baseURL, query);
    return result; // Return popular services
};

// Create a booking for a service
export const createBooking = async (serviceId, date, time, userEmail, userName) => {
    const mutationQuery = gql`
        mutation CreateBooking {
            createBooking(
                data: {useremail: "`+userEmail+`", username: "`+userName+`", time: "`+time+`", date: "`+date+`", services: {connect: {id: "`+serviceId+`"}}, progressStatus: Booked}
            )
            {date}
            publishManyBookings(to: PUBLISHED) {
                count
            }
        }
    `;
    // Make the mutation request to create a booking
    const result = await request(baseURL, mutationQuery, null, headers);
    return result; // Return the result of the booking creation
};

// Check if a service has any booked slots for a specific date
export const serviceBookedSlot = async (serviceId, date) => {
    const query = gql`
        query serviceBookedSlot {
            bookings (where: {
                services_every: {id: "`+serviceId+`"},
                 date: "`+date+`"
                })
            {
                date
                time
            }
        }
    `;
    // Make the request to check for booked slots
    const result = await request(baseURL, query);
    return result; // Return the list of booked slots for the specified service and date
};

// Get the user's booking history based on email
export const getUserBookingHistory = async (userEmail) => {
    const query = gql`
        query userBookingHistory {
            bookings (
                where: {useremail: "`+userEmail+`"},
                orderBy: publishedAt_DESC
            )
            {
              id
              date
              time
              services {
                name
                image {
                  url
                }
                price
                category
                contactEmail
                time
              }
            }
        } 
    `;
    // Make the request to fetch booking history for the user
    const result = await request(baseURL, query);
    return result; // Return the user's booking history
};