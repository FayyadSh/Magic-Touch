'use client'
// ------------ Utils ----------------
import { getCategoryServices, getServiceDetails } from '../../../../utils/globalApi';
// ------------ Hooks ----------------
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useFetch from '../../../../hooks/useFetch';
// ------------ Components ----------------
import { Error } from '../../../../components/ui';
import { ServiceDetailsSkeleton } from '../../../../components/ui/skeletons';
import { ServiceDetails } from '../../../../components/browsing';

const MyBooking = () => {
    // Access query parameters from the URL using useSearchParams
    const searchParams = useSearchParams();

    // Extract and format the 'service-name' query parameter
    const query = searchParams.get('service-name').replace(/%20/g, ' ');

    // Extract and format the 'category' query parameter
    const category = searchParams.get('category').replace(/%20/g, ' ');

    // Retrieve the current session status using useSession (e.g., authenticated or not)
    const { status } = useSession();

    // Fetch the service details for the provided service name
    const { data: serviceDetails, loading, error } = useFetch(() => getServiceDetails(query), query);

    // Fetch similar services for the provided category
    const { data: similarServices } = useFetch(() => getCategoryServices(category), query);

    // Extract the first service object from the fetched service details
    const service = serviceDetails?.services?.[0];

    // Filter similar services to exclude the current service
    const getSimilarServices = () => similarServices?.services?.filter(s => s?.id !== service?.id);

    return (
        <section>
            {error ? 
                <Error error={error} /> // Render the error component if there is an error
             : loading ? 
                <ServiceDetailsSkeleton /> // Render a loading skeleton while fetching data
             : 
                <ServiceDetails 
                    service={service} // Pass the current service details
                    similarServices={getSimilarServices()} // Pass the filtered similar services
                    status={status} // Pass the session status
                />
            }
        </section>
    );
};

export default MyBooking;