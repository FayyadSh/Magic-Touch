import { render, screen } from '@testing-library/react';
import { Categories } from '../components/home';
import { server } from '../mocks/mswSetup';
import { graphql } from 'msw';

// Mock the components used inside Categories
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }) => (
    <a href={href} data-testid='link'>
      {children}
    </a>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }) => <img src={src} alt={alt} data-testid='image' />,
}));

jest.mock('../components/ui/Error', () => () => <h1>Failed To Fetch Categories</h1>);
jest.mock('../components/ui/skeletons/CategoriesSkeleton', () => () => <h1>Loading...</h1>);

describe('Categories Component', () => {
  it('should display loading skeleton when data is being fetched', () => {
    render(<Categories />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display category data when fetch is successful', async () => {
    render(<Categories />);

    expect(await screen.findByText('Category 1')).toBeInTheDocument();
    expect(await screen.findByText('Category 2')).toBeInTheDocument();
  });

  it('should display error component when there is an error', async () => {
    server.use(
      graphql.query('Categories', (req, res, ctx) => {
        return res(ctx.status(400), ctx.errors([{ message: 'Failed to fetch categories' }]));
      })
    );
    render(<Categories />);
    expect(await screen.findByText('Failed To Fetch Categories')).toBeInTheDocument();

    const categoryLinks = screen.queryAllByTestId('link');
    expect(categoryLinks).toHaveLength(0);
  });

  it('should assign the correct href to each category link', async () => {
    render(<Categories />);

    const categoryLinks = await screen.findAllByTestId('link');
    expect(categoryLinks).toHaveLength(2);

    expect(categoryLinks[0]).toHaveAttribute('href', 'categories/Category 1');
    expect(categoryLinks[1]).toHaveAttribute('href', 'categories/Category 2');
  });

  it('should display images with correct alt text for each category', async () => {
    render(<Categories />);
    const categoriesImages = await screen.findAllByAltText('icon');

    categoriesImages.forEach((categoryImage, index) => {
      expect(categoryImage).toHaveAttribute('src', `icon${index + 1}.png`);
    });
  });
});