'use client'
// ------------ Hooks ----------------
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
// ------------ Components ----------------
import { Calendar } from '../ui/shadcn/calendar';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '../ui/shadcn/sheet'
import { Button } from '../ui/shadcn/button';
// ------------ Utils ----------------
import { createBooking, serviceBookedSlot } from '../../utils/globalApi';
import { toast } from 'sonner';
import { sendEmail } from '../../utils/email'

const Booking = ({ children, serviceData }) => {
    // State for the selected date
    const [date, setDate] = useState(new Date());
    // List of all time slots
    const [timeSlot, setTimeSlot] = useState([]);
    // State for the selected time slot
    const [selectedTime, setSelectedTime] = useState();
    // List of already booked time slots for the selected date
    const [bookedSlot, setBookedSlot] = useState([]);

    // User session data
    const { data } = useSession();

    // Generate time slots for the day
    const getTime = () => {
        const timeList = [];
        for (let i = 10; i <= 12; i++) {
            timeList.push({ time: i + ':00 AM' });
            timeList.push({ time: i + ':30 AM' });
        }
        for (let i = 1; i <= 6; i++) {
            timeList.push({ time: i + ':00 PM' });
            timeList.push({ time: i + ':30 PM' });
        }

        setTimeSlot(timeList); // Set generated time slots to state
    };

    // Fetch the time slots when the component mounts
    useEffect(() => {
        getTime();
    }, []);

    // Function to disable dates in the calendar before today
    const isDateDisabled = (day) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Remove the time part for today
        day.setHours(0, 0, 0, 0); // Remove the time part for the selected date

        return day < today; // Disable if the date is before today
    };

    // Function to disable time slots that have passed (only if the selected date is today)
    const isTimeDisabled = (time) => {
        // If the selected date is not today, no time slots are disabled
        if (date?.toDateString() !== new Date()?.toDateString()) return false;

        // Parse the time slot string (e.g., "10:00 AM")
        const [hour, minutePart] = time.split(':');
        const minute = minutePart.split(' ')[0];
        const isPM = minutePart.includes('PM');

        // Create a Date object for the time slot on today's date
        const slotTime = new Date();
        slotTime.setHours(
            isPM ? parseInt(hour) + (hour === '12' ? 0 : 12) : parseInt(hour),
            parseInt(minute),
            0
        );

        return slotTime < new Date(); // Disable if the time slot is in the past
    };

    // Handle booking confirmation
    const handleBooking = () => {
        if (data?.user) {
            // API call to create a booking
            createBooking(
                serviceData.id,
                date,
                selectedTime,
                data.user.email,
                data.user.name
            )
                .then(() => {
                    // Prepare email data to send confirmation
                    const emailData = {
                        username: data?.user.name,
                        email: data?.user.email,
                        date, // Include the selected date
                        selectedTime, // Include the selected time
                        service: serviceData?.name, // Include the service name
                    };

                    sendEmail(emailData); // Send email
                })
                .catch((e) => {
                    console.error(e); // Log error
                    toast('Booking failed');
                })
                .then(() => {
                    // Show success message
                    toast('Booking Created Successfully!');
                    // Reset form states
                    setDate(new Date());
                    setSelectedTime('');
                })
                .catch((err) => {
                    console.error(err); // Log error
                });
        }
    };

    // Fetch booked slots whenever the selected date changes
    useEffect(() => {
        if (date) serviceBookedSlote();
    }, [date]);

    // Function to fetch booked slots for the selected date
    const serviceBookedSlote = () => {
        serviceBookedSlot(serviceData?.id, date)
            .then((res) => setBookedSlot(res?.bookings)
        ) // Update state with booked slots
    };

    // Check if a time slot is already booked
    const isBooked = (time) => bookedSlot.find((item) => item.time === time);

    return (
        <Sheet>
            {/* Trigger to open the booking modal */}
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className='overflow-y-scroll bg-background-color border-none'>
                <SheetHeader>
                    <SheetTitle className='border-b-2 border-primary pb-3 text-cyan-600'>
                        Book a Service
                    </SheetTitle>

                    <SheetDescription>
                        {/* Instructions and notes */}
                        <p className='text-primary mt-2 text-md'>
                            Select a Date and Time slot to book an appointment.
                        </p>
                        <div className='flex flex-col gap-5 items-baseline '>
                            <h2 className='text-primary mt-5 text-lg'>Select Date</h2>
                            {/* Calendar to select a date */}
                            <Calendar
                                mode='single'
                                selected={date}
                                onSelect={setDate}
                                disabled={isDateDisabled} // Disable past dates
                                className='rounded-md text-sky-600'
                            />
                        </div>

                        {/* Time slot selection */}
                        <h2 className='text-primary mt-5 text-lg'>Select Time Slot</h2>

                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mt-6'>
                            {/* Render each time slot */}
                            {timeSlot.map((time, index) => (
                                <Button
                                    onClick={() => setSelectedTime(time.time)} // Set selected time
                                    className={`bg-background-color flex flex-col text-primary border-primary hover:text-white cursor-pointer ${
                                        selectedTime === time.time
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-primary'
                                    }`}
                                    variant='outline'
                                    key={index}
                                    disabled={
                                        isBooked(time.time) || isTimeDisabled(time.time)
                                    } // Disable if booked or passed
                                >
                                    {time.time}
                                    <h5>{isBooked(time.time) && 'Booked'}</h5>
                                </Button>
                            ))}
                        </div>
                    </SheetDescription>
                </SheetHeader>
                <SheetFooter className='mt-5'>
                    <SheetClose asChild>
                        <div>
                            {/* Confirm booking button */}
                            <Button
                                disabled={!(selectedTime && date)} // Disable if no time or date selected
                                onClick={handleBooking}
                                className='text-white cursor-pointer'
                            >
                                Book
                            </Button>
                            {/* Cancel button */}
                            <Button variant='outline' className='ml-3 text-gray cursor-pointer'>
                                Cancel
                            </Button>
                        </div>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default Booking;
