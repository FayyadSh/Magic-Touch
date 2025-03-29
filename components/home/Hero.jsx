// ------------ Components ----------------
import SearchInput from './SearchInput';

const Hero = () => {
    return (
        <section className='flex items-center flex-col justify-center py-24'>
            {/* Main heading for the Hero section */}
            <h2 className='font-bold text-gray-400 text-[46px] text-center mt-8'>
                Find Home {' '}
                <span className='text-primary'> 
                    Service/Repair {' '}
                </span> 
                Near You 
            </h2>

            {/* Subheading for the Hero section */}
            <h3 className='text-xl text-gray-400 mt-4'>
                Explore Best Service & Repair Near You 
            </h3>

            {/* Search input component for searching services */}
            <SearchInput />
        </section>
    );
}

export default Hero;
