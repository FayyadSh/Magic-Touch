// ------------ Components ----------------
import Image from 'next/image';

const Overview = () => {
    return (
        <div className='mt-[100px] relative max-sm:py-[200px] px-6 sm:px-12 lg:px-32'>
            <h1 className='text-primary mb-8 font-bold text-2xl '>
                What We Do ?
            </h1>
            <p className='w-[65%] max-sm:w-full tracking-widest text-gray-600'>Hello Services: Making Your Life Easier with Top-Quality Home Services 	Across England. Whether You’re Moving or Need Help with Household Tasks, 	We’ve Got You Covered. Our Removals Services and Man with a Van England 	Ensure a Smooth Move, While Our End of Tenancy Cleaning Services England 	Guarantee a Pristine Property. Say Goodbye to Unwanted Items with Our 	House Clearance Services, and Keep Your Home in Top Condition with Our 	Skilled and Experienced Handyman Services. Trust Hello Services in 	England and UK for All Your Home Service Needs – No Task Is Too Big or 	Too Small!
                We also provide deep cleaning services, including appliances cleaning and 	carpet cleaning, to ensure your home is sparkling clean and fresh. Trust 	Hello Services for all your home service needs, and enjoy a stress-free 	and comfortable home life
            </p>
            <Image 
                className='absolute max-sm:opacity-70 right-0 top-8 scale-x-[-1] max-sm:bottom-0 max-sm:top-[80%]' 
                src={'./overview.svg'} 
                width={400} 
                height={400} 
                alt='svg image'
            />
        </div>
    );
}

export default Overview;