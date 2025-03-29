'use client'
// ------------ Components ----------------
import { ServicesList }from '../../../../components/common';
// ------------ Utils ----------------
import { getSearchService } from '../../../../utils/globalApi'
// ------------ Hooks ----------------
import useFetch from '../../../../hooks/useFetch';
import { useParams } from 'next/navigation';

const Page = () => {
    // Extract route parameters using useParams
    const params = useParams();

    // Retrieve the 'service' query parameter, replace '%20' with a space, and convert to lowercase
    const query = params?.service?.replace('%20', ' ')?.toLowerCase();

    // Fetch data based on the query using the useFetch hook
    const { data, loading, error } = useFetch(() => getSearchService(query));

    return (
        <ServicesList 
            title={`${query} Results`} // Display a dynamic title based on the query
            services={data?.services}  // Render the fetched list of services
            cols={3} // Display services in 3 columns
            error={error} // Show an error message if data fetching fails
            loading={loading} // Indicate loading state while fetching data
        />
    );
};
export default Page;