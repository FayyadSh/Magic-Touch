// ------------ Components ----------------
import { Inbox } from "lucide-react";

const NoContent = ({text = 'No Services Found'}) => {
    return (
        <div className='flex flex-col items-center justify-center py-32 w-[70vw] mx-auto'>
            {/* Icon to visually represent no content */}
            <Inbox className='h-44 w-44 text-gray-300' />

            {/* Display the no content message */}
            <h1 className='text-2xl text-gray-400'>
                {text} {/* The text prop provides a customizable message */}
            </h1>
        </div>
    );
}

export default NoContent;