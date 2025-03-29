'use client';
// ------------ Components ----------------
import { Button } from '../ui/shadcn/button';
import { Input } from '../ui/shadcn/input'; 
// ------------ Icons ----------------
import { Search } from 'lucide-react';
// ------------ Hooks ----------------
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchInput = () => {

    const [searchTerm, setSearchTerm] = useState(''); // State to manage the value of the search term
    const router = useRouter(); // Router instance to navigate to the search results page

    // Function to handle 'Enter' key press for submitting the search
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && searchTerm.length > 0) {
            router.push(`/search/${searchTerm}`); // Navigate to search results with the search term
        }
    };

    // Function to handle clicking the search icon
    const handleSearchIconClick = () => {
        if (searchTerm.length > 0) {
            router.push(`/search/${searchTerm}`); // Navigate to search results with the search term
        }
    };

    const searchInput = useRef(null); // Create a reference to the input element

    // Focus on the search input when the component renders
    useEffect(() => {
        if (searchInput.current) {
            searchInput.current.focus(); // Set focus to the input element
        }
    }, []);

    return (
        <div className='mt-8 flex gap-3 items-center'>
            {/* Search Input */}
            <Input  
                className='tracking-widest rounded-full text-primary border-primary p-2 pl-4 border focus:outline-none w-[60vw] md:w-[350px]' // Styling for the input
                placeholder='search' // Placeholder text for the input field
                value={searchTerm} // Value bound to the searchTerm state
                onChange={(e) => setSearchTerm(e.target.value)} // Update the search term on input change
                onKeyPress={handleKeyPress} // Call handleKeyPress when a key is pressed
                ref={searchInput} // Reference for focusing the input
            />

            {/* Search Button */}
            <Button 
                onClick={handleSearchIconClick} // Trigger search when the button is clicked
                className='rounded-full text-secondary h-[45px] w-[45px] cursor-pointer' // Styling for the button
            >
                <Search className='h-4 w-4' /> {/* Search icon inside the button */}
            </Button>
        </div>
    );
}

export default SearchInput;
