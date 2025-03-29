// ------------ Components ----------------
import Image from 'next/image';

const BookingSteps = () => {
    return (
        <div className='mt-[50px] text-gray-600 pb-[300px] relative px-6 sm:px-12 lg:px-32'>
            <h1 className='text-primary mb-[100px] font-bold text-2xl '>How It Work ?</h1>
            <div className='md:px-20 sm:px-2'>
                <div className='flex justify-between z-20 lg:flex-row max-sm:flex-col max-sm:gap-5'>
                    <div className='lg:w-[25%] bg-background-color sm:w-full px-2 text-center opacity-90 tracking-widest border-[2px] rounded-xl py-4 border-primary'>
                        <h1 className='text-primary mb-3 font-bold text-xl'>Reserve</h1>
                        <p className='dark:text-gray-400'>Simplify Your Home Service Booking Across England: Book Online, by Phone, or Email, and We’re Here to Help</p>
                    </div>
                    <div className='lg:w-[25%] bg-background-color sm:w-full px-2 text-center opacity-90 tracking-widest border-[2px] rounded-xl py-4 border-primary'>
                        <h1 className='text-primary mb-3 font-bold text-xl'>Receive</h1>
                        <p className='dark:text-gray-400'>Trust Our Expert Home Services Across England: Equipped with the Right Tools and Vehicle, We Ensure Your Complete Satisfaction – Every Time</p>
                    </div>
                    <div className='lg:w-[25%] bg-background-color sm:w-full px-2 text-center opacity-90 tracking-widest border-[2px] rounded-xl py-4 border-primary'>
                        <h1 className='text-primary mb-3 font-bold text-xl'>Relax</h1>
                        <p className='dark:text-gray-400'>Unwind and Reap the Benefits of Our Expert Home Services in England, So You Can Focus on What Truly Matters</p>
                    </div>
                </div>
                <Image className='absolute right-[20%] max-sm:right-0 opacity-20 max-sm:z-10 bottom-[20%]' src={'/bookingSteps.svg'} width={300} height={300} alt='svg image' />
            </div>
        </div>
    );
}

export default BookingSteps;