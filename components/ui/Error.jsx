// ------------ Components ----------------
import { Frown } from "lucide-react";

const Error = ({ error = 'Somthing Wend Wrong' }) => {
    return (
        <div className='flex flex-col items-center justify-center pt-16 w-[80vw] mx-auto'>
            {/* Icon to visually represent an error */}
            <Frown className='h-44 w-44 text-gray-300' />

            {/* Display error message */}
            <h1 className='text-2xl text-gray-400'>
                {error}
            </h1>
        </div>
    );
}

export default Error;
