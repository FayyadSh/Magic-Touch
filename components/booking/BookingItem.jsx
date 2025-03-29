// ------------ Icons ----------------
import { Calendar, Clock } from 'lucide-react';
// ------------ Components ----------------
import Image from 'next/image';

const BookingItem = ({ booking }) => {


    // Extract the first service from the booking object
    const bookingService = booking?.services[0];
    
    // Function to format and extract the booking day from the booking date
    const getBookingDay = () => {
        let bookingDay = ' ';
        // Loop through the first 4 parts of the booking date and concatenate them
        for(let i = 0; i < 4; i++){
            bookingDay = bookingDay?.concat(' ' + booking?.date?.split(' ')[i]);
        }
        return bookingDay; // Return the formatted booking day
    };

    return (
        <div className="bg-background-color mb-4 p-3 rounded-xl w-full">
            <div className="flex items-center justify-between text-sky-700 font-semibold text-lg">
                {/* Display the booking day with a calendar icon */}
                <h4 className="mb-4 flex items-center gap-3">
                    <Calendar />
                    {getBookingDay()} {/* Show the formatted booking day */}
                </h4>
                {/* Display the booking time with a clock icon */}
                <h4 className="mb-4 flex items-center gap-3">
                    <Clock />
                    {booking?.time} {/* Show the booking time */}
                </h4>
            </div>
            <div className='w-full flex flex-col md:flex-row gap-4'>
                {/* Display the booking service image */}
                <div className="relative w-full lg:w-1/2 xl:w-1/3 h-[200px]">
                    <Image 
                        src={bookingService?.image?.url} 
                        width={300} 
                        height={300} 
                        alt="booking image" 
                        className="rounded-xl w-full h-full object-cover"
                    />
                </div>
                <div className="w-full">
                    <div className='w-full flex justify-between items-center mb-3'>
                        <h1 className="text-2xl text-primary font-semibold tracking-wider">
                            {bookingService?.name}
                        </h1>
                    </div>
                    {/* Display the service category */}
                    <h3 className="bg-background-secondary-color text-primary rounded-3xl w-fit py-1 px-3 font-semibold mb-2">
                        {bookingService?.category}
                    </h3>
                    {/* Display the service price */}
                    <h4 className='pl-2 font-medium text-sky-700'>
                        Price : {bookingService?.price} $
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default BookingItem;
