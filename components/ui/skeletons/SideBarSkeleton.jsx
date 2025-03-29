const SideBarSkeleton = () => {
    return (
        [1,2,3,4,5,6].map(
            element => <div className="bg-background-color rounded-lg md:mr-10 mb-3 h-[55px] border-primary" key={element} />
        )
    )
}

export default SideBarSkeleton;