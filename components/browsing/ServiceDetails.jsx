// ------------ Components ----------------
import { ServicesList } from "../common";
import { Button } from "../ui/shadcn/button";
import BookingSheet from "./BookingSheet";
import Image from "next/image";
import Alert from "./Alert";
// ------------ Icons ----------------
import { Clock, Mail, NotebookPen } from "lucide-react";

const ServiceDetails = ({ service, similarServices, status }) => {
    return (
        <div className='pt-12'>
            {/* Service Image and Basic Info */}
            <div className='flex flex-col lg:flex-row lg:items-center gap-9 mb-9'>
                {/* Service image */}
                <Image 
                    className='rounded-lg h-[300px]' 
                    alt='service image' 
                    src={service?.image?.url}                     width={400} 
                    height={400} 
                />
                
                {/* Service details (name, category, price, etc.) */}
                <div className='flex flex-col gap-4'>
                    <h1 className='text-4xl font-bold text-primary'>
                        {service?.name}
                    </h1>
                    <h2 className='text-sky-700'>
                        {service?.category}
                    </h2>
                    <h5 className='text-sky-500 font-medium'>
                        {service?.price} $
                    </h5>
                    
                    {/* Service contact email */}
                    <h4 className='flex gap-2 text-gray-400'>
                        <Mail />
                        {service?.contactEmail}
                    </h4>
                    
                    {/* Availability time */}
                    <h2 className='text-gray-400 gap-2 flex items-center text-sm'>
                        <Clock />
                        AVALIABLE 8:00 AM to 10:00 PM
                    </h2>
                    
                    {/* Conditional rendering based on authentication status */}
                    {status === 'authenticated' ? (
                        <BookingSheet serviceData={service}>
                            {/* Button to book an appointment */}
                            <Button className='text-white flex gap-2 cursor-pointer'>
                                <NotebookPen /> 
                                Book an Appointment
                            </Button>
                        </BookingSheet> 
                    ) : (
                        <Alert>
                            {/* Button to prompt user to sign in */}
                            <Button className='text-white flex gap-2 cursor-pointer'>
                                <NotebookPen /> 
                                Book an Appointment
                            </Button>
                        </Alert>
                    )}
                </div>
            </div>

            {/* Service description */}
            <div>
                <h5 className=' text-gray-600'>
                    {service?.description}
                </h5>

                {/* Display similar services */}
                <ServicesList 
                    title='Similar Services'
                    services={similarServices}
                    cols={3}
                />
            </div>
        </div>
    );
}

export default ServiceDetails;