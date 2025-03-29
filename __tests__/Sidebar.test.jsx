import { render, screen, waitFor } from "@testing-library/react";
import { SideBar } from "../components/browsing";
import useFetch from "../hooks/useFetch";
import { usePathname, useSearchParams } from "next/navigation";


jest.mock('react-dom/server', () => ({
  renderToStaticMarkup: jest.fn((element) => {
    // A simple approach: return a string representation of the element's props
    if (typeof element.type === 'function') { // Check if it's a component
      const props = element.props;
      let str = `<${element.type.name} `;
      for (const key in props) {
        str += `${key}="${props[key]}" `;
      }
      str += '/>';
      return str;
    }
    return element; // Return if not a component
  }),
}));


// Mock the dependencies
jest.mock("../hooks/useFetch");
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => 'mockedValue'), // Replace 'mockedValue' with the value you want to test
  })),
}));

jest.mock("next/link", () => {
  return ({ children, className, href }) => <a className={className} href={href}>{children}</a>;
});

jest.mock("next/image", () => {
  return ({ src, alt }) => <img src={src} alt={alt} />;
});

jest.mock('../components/ui/Error', () => jest.fn(() => <div>Failed to Fetch Categories</div>));
jest.mock('../components/ui/skeletons/SideBarSkeleton', () => () => <div>Loading...</div>);
jest.mock('../components/ui/NoContent', () => () => <div>no categories available</div>);
jest.mock('../components/ui/EmailTemplate', () => () => <div>Email</div>)

describe("SideBar Component", () => {
  const mockCategories = {
    categories: [
      { title: "Technology", icon: { url: "/tech-icon.png" } },
      { title: "Health", icon: { url: "/health-icon.png" } },
    ],
  };

  it("should render loading state initially", () => {
    useFetch.mockReturnValue({ data: null, loading: true, error: null });
    render(<SideBar />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it("should render links with correct href", async () => {
    useFetch.mockReturnValue({ data: mockCategories, loading: false, error: null });
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
    usePathname.mockReturnValue("/categories/technology");

    render(<SideBar />);

    await waitFor( async () => {
      const technologyLink = screen.getByText("Technology").parentElement;
      const healthLink = screen.getByText("Health").parentElement;

      expect(technologyLink).toHaveAttribute('href','/categories/Technology')
      expect(healthLink).toHaveAttribute('href','/categories/Health')
    });
  });

  it("should render error state if error occurs", async () => {
    useFetch.mockReturnValue({ data: null, loading: false, error: true });
    render(<SideBar />);
    expect(await screen.findByText(/failed to fetch categories/i)).toBeInTheDocument();
  });

  it("should render empty state if no categories are available", async () => {
    useFetch.mockReturnValue({ data: { categories: [] }, loading: false, error: null });
    render(<SideBar />);
    expect(await screen.findByText(/no categories available/i)).toBeInTheDocument();
  });

  it("should render categories correctly", async () => {
    useFetch.mockReturnValue({ data: mockCategories, loading: false, error: null });
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
    usePathname.mockReturnValue("/categories/technology");

    render(<SideBar />);

    await waitFor(() => {
      expect(screen.getByText("Technology")).toBeInTheDocument();
      expect(screen.getByText("Health")).toBeInTheDocument();
    });

    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("src", "/tech-icon.png");
    expect(images[1]).toHaveAttribute("src", "/health-icon.png");
  });

  it("should highlight the active category based on query param", async () => {
    useFetch.mockReturnValue({ data: mockCategories, loading: false, error: null });
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue("technology"),
    });
    usePathname.mockReturnValue("/categories/technology");

    render(<SideBar />);

    await waitFor(() => {
      const technologyLink = screen.getByText("Technology").parentElement
      expect(technologyLink).toHaveClass("!text-primary");
    });
  });

  it("should highlight the active category based on pathname if query param is missing", async () => {
    useFetch.mockReturnValue({ data: mockCategories, loading: false, error: null });
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
    usePathname.mockReturnValue("/categories/health");

    render(<SideBar />);

    await waitFor(() => {
      const healthLink = screen.getByText("Health").parentElement
      expect(healthLink).toHaveClass("!text-primary");
    });
  });

  it("should not highlight any category if query and pathname do not match categories", async () => {
    useFetch.mockReturnValue({ data: mockCategories, loading: false, error: null });
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue("unknown"),
    });
    usePathname.mockReturnValue("/categories/unknown");

    render(<SideBar />);

    await waitFor(() => {
      const technologyLink = screen.getByText("Technology");
      const healthLink = screen.getByText("Health");

      expect(technologyLink).not.toHaveClass("text-primary");
      expect(healthLink).not.toHaveClass("text-primary");
    });
  });

  it("should handle large category data efficiently", async () => {
    const largeMockCategories = {
      categories: Array.from({ length: 50 }, (_, i) => ({
        title: `Category ${i}`,
        icon: { url: `/icon-${i}.png` },
      })),
    };

    useFetch.mockReturnValue({ data: largeMockCategories, loading: false, error: null });
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
    usePathname.mockReturnValue("/categories/category1");

    render(<SideBar />);

    await waitFor(() => {
      largeMockCategories.categories.forEach((category) => {
        expect(screen.getByText(category.title)).toBeInTheDocument();
      });
    });
  });

  it("should display the correct styles for inactive categories", async () => {
    useFetch.mockReturnValue({ data: mockCategories, loading: false, error: null });
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
    usePathname.mockReturnValue("/categories/technology");

    render(<SideBar />);

    await waitFor(() => {
      const healthLink = screen.getByText("Health").parentElement
      expect(healthLink).not.toHaveClass("text-primary");
      expect(healthLink).toHaveClass("text-gray-500/90");
    });
  });

  it("should render without crashing when no query parameters or pathname provided", async () => {
    useFetch.mockReturnValue({ data: mockCategories, loading: false, error: null });
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
    usePathname.mockReturnValue("/");

    render(<SideBar />);

    await waitFor(() => {
      expect(screen.getByText("Technology")).toBeInTheDocument();
      expect(screen.getByText("Health")).toBeInTheDocument();
    });
  });

});
