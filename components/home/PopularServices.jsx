'use client';
// ------------ Components ----------------
import { ServicesList } from "../common"; // Import ServicesList component to display services
// ------------ Utils ----------------
import { getPopularServices } from "../../utils/globalApi"; // Import function to fetch popular services from the API
// ------------ Hooks ----------------
import useFetch from "../../hooks/useFetch"; // Custom hook to handle data fetching logic

const PopularServices = () => {
  // Use the useFetch hook to fetch popular services, passing the getPopularServices function
  const { data, loading, error } = useFetch(() => getPopularServices());

  return (
    <div className='px-6 sm:px-12 lg:px-32'>
      {/* ServicesList component to display popular services */}
      <ServicesList 
        services={data?.services?.slice(0, 4)} // Pass only the first 4 popular services to the list
        title='Popular Services' // Title for the section
        loading={loading} // Pass loading state to ServicesList component
        error={error} // Pass error state to ServicesList component
      />   
    </div>
  );
}

export default PopularServices;
