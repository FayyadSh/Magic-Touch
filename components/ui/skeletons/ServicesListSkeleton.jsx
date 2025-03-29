const ServicesListSkeleton = () => {
    return (
        [1,2,3,4].map(element => 
            <div className="bg-background-color shadow-md mt-9 h-[330px] sm:w-full animate-pulse rounded-lg" key={element}/> 
        )
    );
}

export default ServicesListSkeleton;