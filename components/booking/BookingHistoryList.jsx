// ------------ Components ----------------
import { Error, NoContent } from "../ui";
import { BookingItem } from ".";
import { UserBookingHistorySkeleton } from "../ui/skeletons";

const BookingHistoryList = ({ userBookingHistory, loading, error  }) => {
    return (
        // Check if there is an error, loading state, or no content to display
        error ? 
            // Display error component if an error occurs
            <Error error={error} />
        : loading ? 
            // Display a loading skeleton if the data is still loading
            <UserBookingHistorySkeleton />
         : userBookingHistory?.length === 0 ? 
            // If no bookings are found, show a 'No Content' message
            <NoContent text="No Bookings Yet" />
         : 
            // If data is available, map through the userBookingHistory and display each booking
            userBookingHistory?.map(booking => <BookingItem booking={booking} key={booking?.id} />)
        
    );
}

export default BookingHistoryList;