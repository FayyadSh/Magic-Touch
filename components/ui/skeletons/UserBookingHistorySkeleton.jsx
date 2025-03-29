const UserBookingHistorySkeleton = () => {
    return (
        [1,2,3,4].map(
            element => <div className="bg-background-color h-[50vh] md:h-[290px] mb-4 rounded-xl animate-pulse" key={element} />
        )
    )
}
    
export default UserBookingHistorySkeleton;