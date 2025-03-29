// ------------ Components ----------------
import { Error, NoContent } from "../ui";
import { ServicesListSkeleton } from "../ui/skeletons";
import Service from "./Service";

const ServicesList = ({ title, services, cols = 4, loading, error }) => {

    // Function to determine the number of grid columns based on the 'cols' prop
    const getGridColsClass = (cols) => {
        switch (cols) {
            case 1: return 'grid-cols-1';
            case 2: return 'grid-cols-2';
            case 3: return 'grid-cols-3';
            case 4: return 'grid-cols-4';
            default: return 'grid-cols-4'; // Default to 4 columns if an invalid value is provided
        }
    };

    return (
        <div className='mt-5'>
            {/* Title of the services list */}
            <h1 className='text-primary capitalize font-bold text-3xl mb-3'>
                {title}
            </h1>

            {/* Grid of services, dynamically adjusted based on 'cols' */}
            <div className={`grid max-sm:grid-cols-1 max-lg:grid-cols-2 ${getGridColsClass(cols)} items-center gap-4`}>
                {/* Conditional rendering based on loading, error, or content */}
                {error ? 
                    <Error error={error} />  // If there's an error, display an error message
                : loading ? 
                    <ServicesListSkeleton />  // If loading, show the skeleton loader
                : services?.length === 0 ? 
                    <NoContent />  // If there are no services, show a "No Content" message
                :
                    services?.map(service => <Service key={service.name} service={service} />)  // If services exist, render each service
                }
            </div>
        </div>
    );
}

export default ServicesList;
