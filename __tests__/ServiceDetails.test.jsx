import { render, screen } from "@testing-library/react";
import { ServiceDetails } from "../components/browsing";

jest.mock("next/image", () => ({ src, alt }) => <img src={src} alt={alt} />);
jest.mock("../components/common/ServicesList", () => () => <div>Mocked ServicesList</div>);
jest.mock("../components/browsing/BookingSheet", () => ({ children }) => <div onClick={jest.fn()}>{children}</div>);
jest.mock("../components/browsing/Alert", () => ({ children }) => <div>{children}</div>);

const serviceMock = {
  name: "Test Service",
  category: "Test Category",
  price: "100",
  contactEmail: "test@example.com",
  image: {
    url: "/test-image.jpg",
  },
  description: "Test Description",
};

const similarServicesMock = [
  { name: "Service 1", price: 50, image: { url: "/service1.jpg" } },
  { name: "Service 2", price: 60, image: { url: "/service2.jpg" } },
];

describe("ServiceDetails Component", () => {
  test("renders service details correctly for authenticated users", () => {
    render(<ServiceDetails service={serviceMock} similarServices={similarServicesMock} status="authenticated" />);
    
    expect(screen.getByAltText("service image")).toHaveAttribute("src", serviceMock.image.url);
    expect(screen.getByText(serviceMock.name)).toBeInTheDocument();
    expect(screen.getByText(serviceMock.category)).toBeInTheDocument();
    expect(screen.getByText(`${serviceMock.price} $`)).toBeInTheDocument();
    expect(screen.getByText(serviceMock.contactEmail)).toBeInTheDocument();
    expect(screen.getByText(/Book an Appointment/)).toBeInTheDocument();
    expect(screen.getByText("Mocked ServicesList")).toBeInTheDocument();
    expect(screen.getByText(serviceMock.description)).toBeInTheDocument();
  });

  test("renders correctly when service name is missing", () => {
    const serviceWithoutName = { ...serviceMock, name: null };
    render(<ServiceDetails service={serviceWithoutName} similarServices={similarServicesMock} status="authenticated" />);

    // It should not crash, and we expect no service name
    expect(screen.queryByText(serviceMock.name)).not.toBeInTheDocument();
  });

  
  test("renders 'Book an Appointment' button inside Alert for unauthenticated users", () => {
    render(<ServiceDetails service={serviceMock} similarServices={similarServicesMock} status="unauthenticated" />);
    
    // The button should exist inside the Alert component for unauthenticated users
    const alert = screen.getByText(/Book an Appointment/).closest('div');
    expect(alert).toContainElement(screen.getByText(/Book an Appointment/));
    expect(alert).toBeInTheDocument();
  });

  test("renders correct alt text for service image", () => {
    render(<ServiceDetails service={serviceMock} similarServices={similarServicesMock} status="authenticated" />);

    const image = screen.getByAltText("service image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", serviceMock.image.url);
  });

  test("handles missing service description gracefully", () => {
    const serviceWithoutDescription = { ...serviceMock, description: null };

    render(<ServiceDetails service={serviceWithoutDescription} similarServices={similarServicesMock} status="authenticated" />);

    // Ensure no error occurs if description is missing
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  test("displays formatted price correctly", () => {
    render(<ServiceDetails service={serviceMock} similarServices={similarServicesMock} status="authenticated" />);

    const priceText = screen.getByText(`${serviceMock.price} $`);
    expect(priceText).toBeInTheDocument();
    expect(priceText).toHaveClass("text-sky-500 font-medium"); // Verifying specific style applied to price
  });

  test("renders service category correctly", () => {
    render(<ServiceDetails service={serviceMock} similarServices={similarServicesMock} status="authenticated" />);
    
    const categoryText = screen.getByText(serviceMock.category);
    expect(categoryText).toBeInTheDocument();
    expect(categoryText).toHaveClass("text-sky-700"); // Verify class is applied
  });

});
