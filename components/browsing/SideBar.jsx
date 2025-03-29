"use client";
// ------------ Utils ----------------
import { getCategories } from "../../utils/globalApi";
// ------------ Components ----------------
import Image from "next/image";
import Link from "next/link";
import { SideBarSkeleton } from "../ui/skeletons";
import { Error, NoContent } from "../ui";
// ------------ Hooks ----------------
import { usePathname, useSearchParams } from "next/navigation";
import useFetch from "../../hooks/useFetch";

const SideBar = () => {
  
  // Get the current pathname and search parameters from the URL
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get the 'category' query from search parameters or from the pathname
  const query = (searchParams.get('category') || pathname?.split('/')[2])?.toLowerCase();

  // Fetch categories using the custom useFetch hook
  const { data, loading, error } = useFetch(() => getCategories());

  return (
    <main className="mt-8 pb-4 border-b border-background-secondary-color md:border-none">
      {/* Title for the sidebar (hidden on mobile) */}
      <h2 className="font-bold mb-3 hidden md:block text-xl text-primary tracking-wider">
        Categories 
      </h2>

      {/* Categories Grid: displayed as a 3-column grid, or a block layout on smaller screens */}
      <div className='grid grid-cols-3 gap-5 sm:block'>
        {/* Error handling */}
        {error ? 
          <Error />  // Show error component if there is an error
        : loading ? 
          <SideBarSkeleton />  // Show loading skeleton while data is being fetched
        : data?.categories?.length === 0 ? 
          <NoContent text="No categories available" />  // Show NoContent if no categories are available
        : 
          // Map through the categories and display them
          data?.categories?.map(category => (
            <Link 
              href={`/categories/${category.title}`} 
              className={`flex flex-col lg:flex-row gap-2 p-3 text-gray-500/90 border items-center hover:bg-background-color hover:shadow 
              ${query === category.title.toLowerCase() ? 'bg-background-color !text-primary' : 'bg-transparent'} 
              hover:text-primary rounded-lg md:mr-10 cursor-pointer mb-3 border-primary`} 
              key={category.title}
            >
              {/* Category Icon */}
              <Image src={category?.icon?.url} width={30} height={30} alt="category icon" />
              {/* Category Title */}
              <h2>{category.title}</h2>
            </Link>
          ))
        }
      </div>
    </main>
  );
}

export default SideBar;
