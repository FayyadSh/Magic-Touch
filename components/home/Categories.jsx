"use client";
// ------------ Components ----------------
import Image from "next/image";
import Link from "next/link";
import { CategoriesSkeleton } from "../ui/skeletons";
import { Error } from "../ui";
// ------------ Utils ----------------
import { getCategories } from "../../utils/globalApi";
// ------------ Hooks ----------------
import useFetch from "../../hooks/useFetch";

const Categories = () => {
  // Fetching data using custom hook (useFetch) that calls the API to get categories
  const {data, loading, error} = useFetch(() => getCategories());
  
  return (
    <div className="px-6 sm:px-20 lg:px-44 grid grid-cols-6 max-sm:grid-cols-3 max-sm:grid-rows-2 max-sm:gap-y-4 justify-evenly items-center mb-[50px] mx-auto">
      {/* Conditional rendering based on loading, error or fetched data */}
      {error ? 
        // Display error component if error occurs
        <Error error={error} />
      : loading ? 
        // Display skeleton loader while the data is loading
        <CategoriesSkeleton />
      :
        // Render categories once the data is fetched successfully
        data?.categories?.map(category => (
          <Link 
            href={`categories/${category.title}`} 
            className={`bg-background-color hover:scale-105 cursor-pointer p-3 rounded-xl flex items-center flex-col justify-center h-[90px] w-[90px] transition-all duration-300`} 
            key={category.title}
          >
            <Image src={category.icon.url} alt="icon" width={35} height={35} />
            <h5 className="text-md text-primary">{category.title}</h5>
          </Link>
        ))
      }
    </div>
  );
};

export default Categories;