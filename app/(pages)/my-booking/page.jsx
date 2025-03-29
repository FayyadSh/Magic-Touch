'use client';
// ------------ Hooks ----------------
import { useSession } from "next-auth/react";
import useFetch from "../../../hooks/useFetch";
import { signIn } from "next-auth/react";
// ------------ Utils ----------------
import { getUserBookingHistory } from "../../../utils/globalApi";
// ------------ Components ----------------
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/shadcn/tabs";
import { BookingHistoryList } from "../../../components/booking";
import { Button } from "../../../components/ui/shadcn/button";
import Image from "next/image";

const MyBooking = () => {

    // Access user session data and authentication status
    const { data, status } = useSession();

    // Fetch user booking history using a custom hook
    // The hook takes a function that fetches the data and a dependency array.
    // In this case, the dependency is the user object from the session.
    const { data: userBookingHistory, loading, error,  } = useFetch(
        () => getUserBookingHistory(data?.user?.email), // Function to fetch data
        data?.user // Dependency: Re-fetch when user data changes
    );

    // Get the current date for filtering bookings
    const currentDate = new Date();

    // Filter bookings into booked (upcoming) and completed (past) categories
    // This logic is executed on every render, but React's optimizations handle this efficiently.
    const bookedServices = userBookingHistory?.bookings?.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= currentDate; // Filter for future bookings
    })

    const completedServices = userBookingHistory?.bookings?.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate <= currentDate; // Filter for past or current bookings
    });

    // Handle user login using next-auth
    const handleLogin = () => {
        signIn('descope');
    }

    return (
        <section className="py-32 mx-6 sm:px-12 lg:px-32">
            {/* Conditionally render content based on authentication status */}
            {status === 'authenticated' ? (
                // User is authenticated: Display booking history tabs
                <Tabs defaultValue="booked" className="w-full text-primary">

                    <div className="w-full flex justify-between md:items-center flex-col md:flex-row mb-6">
                        <h1 className="font-bold text-2xl mb-4">
                            Service History
                        </h1>

                        <TabsList className='w-fit bg-background-color'>
                            <TabsTrigger value='booked' className='text-light-blue-color cursor-pointer'>
                                Booked
                            </TabsTrigger>
                            <TabsTrigger value='completed' className='text-light-blue-color cursor-pointer'>
                                Completed
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value='booked'>
                        {/* Display the list of booked services */}
                        <BookingHistoryList
                            userBookingHistory={bookedServices}
                            loading={loading}
                            error={error}
                        />
                    </TabsContent>

                    <TabsContent value='completed'>
                         {/* Display the list of completed services */}
                        <BookingHistoryList
                            userBookingHistory={completedServices}
                            loading={loading}
                            error={error}
                        />
                    </TabsContent>
                </Tabs>
            ) : (
                // User is not authenticated: Display login prompt
                <div className='flex flex-col md:flex-row gap-24 py-12 justify-between'>
                    <Image
                        src='/login.svg'
                        width={500}
                        height={500}
                        alt='login illustration'
                        className='w-[70vw] md:w-[40vw] lg:w-[30vw]'
                    />
                    <div className='flex flex-col justify-between'>
                        <h1 className='text-2xl text-primary font-semibold tracking-wide'>
                            Oops! Not Registered
                        </h1>
                        <p className='text-gray-500 md:w-1/2 mb-12'>
                            To book or manage your home services, please sign up for an account. Get started with our trusted professionals today!
                        </p>
                        <Button
                            onClick={handleLogin}
                            className='text-white mx-1 hover:bg-sky-600 w-32 self-end md:self-center md:mr-44'
                        >
                            Login
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MyBooking;