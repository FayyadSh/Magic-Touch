import { render, screen, waitFor } from "@testing-library/react";
import { SessionProvider, signIn } from "next-auth/react";
import MyBooking from "../app/(pages)/my-booking/page";
import { useSession } from "next-auth/react";
import userEvent from "@testing-library/user-event";
import { server } from "../mocks/mswSetup";
import { graphql } from "msw";
import useFetch from "../hooks/useFetch";

// Mocking the necessary imports
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock("../components/ui/shadcn/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

jest.mock(
  "../components/booking/BookingHistoryList",
  () =>
    ({ userBookingHistory, loading, error }) =>
      (
        <div>
          {error ? (
            <h1>Somthing Went Wrong</h1>
          ) : loading ? (
            <h1>Loading...</h1>
          ) : userBookingHistory?.length === 0 ? (
            <div>
              No Bookings Yet
            </div>
          ) : (
            userBookingHistory?.map((booking) => (
              <div key={booking?.id}>{booking?.services[0]?.name}</div>
            ))
          )}
        </div>
      )
);

describe("MyBooking Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockSession = {
    data: { user: { email: "test@example.com" } },
    status: "authenticated",
  };

  const mockUseSession = (session = mockSession) => {
    useSession.mockReturnValue(session);
  };

  it("should show loading state when fetching data", () => {
    mockUseSession();
    render(<MyBooking />);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("should show error message when fetch fails", async () => {
    mockUseSession();
    render(<MyBooking />);

    server.use(
      graphql.query("userBookingHistory", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.errors([{ message: "Failed to fetch services" }])
        );
      })
    );

    expect(await screen.findByText(/Somthing Went Wrong/i)).toBeInTheDocument();
  });

  it("should show login prompt if not authenticated", async () => {
    const mockFalseSession = { data: null, status: "unauthenticated" };
    mockUseSession(mockFalseSession);

    render(<MyBooking />);

    expect(screen.getByText(/Oops! Not Registered/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();

    // Simulate login button click
    await userEvent.click(screen.getByRole("button", { name: /Login/i }));
    expect(signIn).toHaveBeenCalledWith("descope");
  });

  it("should handle tabs properly and display booked/completed services", async () => {
    mockUseSession();
    render(<MyBooking />);

    // Simulate switching between "Booked" and "Completed" tabs
    const bookedTab = screen.getByText(/Booked/i);
    const completedTab = screen.getByText(/Completed/i);

    userEvent.click(completedTab);
    await waitFor(() => {
      expect(screen.getByText(/Cleaning House/i)).toBeInTheDocument();
    });

    userEvent.click(bookedTab);
    await waitFor(() => {
      expect(screen.getByText(/Cleaning House/i)).toBeInTheDocument();
    });
  });

  it("should display an error message if the fetch request fails with a 500 error", async () => {
    mockUseSession();
    render(<MyBooking />);

    server.use(
      graphql.query("userBookingHistory", (req, res, ctx) => {
        return res(ctx.status(500), ctx.errors([{ message: "Internal server error" }]));
      })
    );

    await waitFor(() => {
      expect(screen.getByText(/Somthing Went Wrong/i)).toBeInTheDocument();
    });
  });

  it("should show 'No Bookings Yet' when there are no bookings", async () => {
    const mockEmptyHistory = {
      ...mockSession,
      data: { user: { email: "test@example.com" } },
      status: "authenticated",
    };

    mockUseSession(mockEmptyHistory);

    render(<MyBooking />);

    await waitFor(() => {
      expect(screen.getByText(/no bookings yet/i)).toBeInTheDocument();
    });
  });

});
