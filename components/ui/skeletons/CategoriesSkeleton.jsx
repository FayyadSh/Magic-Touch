const CategoriesSkeleton = () => {
    return (
        [1,2,3,4,5,6].map(
            element => <div className="bg-background-color p-3 rounded-xl justify-center h-[90px] w-[90px] animate-pulse" key={element} />
        )
    );
}

export default CategoriesSkeleton;