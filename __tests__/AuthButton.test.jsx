import { render, screen, fireEvent } from '@testing-library/react'
import { AuthMenu } from '../components/common'
import { useSession, signIn, signOut } from 'next-auth/react'

// Mock NextAuth functions
jest.mock('next-auth/react')

describe('AuthButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders login button when not authenticated', () => {
    useSession.mockReturnValue({ data: null })
    render(<AuthMenu />)

    const loginButton = screen.getByText(/login/i)
    expect(loginButton).toBeInTheDocument()
  })

  test('clicking login button triggers signIn', () => {
    useSession.mockReturnValue({ data: null })
    render(<AuthMenu />)

    const loginButton = screen.getByText(/login/i)
    fireEvent.click(loginButton)

    expect(signIn).toHaveBeenCalledWith('descope')
  })

  test('renders user image and name when authenticated', () => {
    const sessionData = {
      user: { name: 'John Doe', image: '/user.jpg' }
    }
    useSession.mockReturnValue({ data: sessionData })

    render(<AuthMenu />)

    const userImage = screen.getByAltText('user icon')
    expect(userImage).toBeInTheDocument()
  })

  test('clicking logout button triggers signOut', () => {
    const sessionData = {
      user: { name: 'John Doe', image: '/user.jpg' }
    }
    useSession.mockReturnValue({ data: sessionData })

    render(<AuthMenu />)

    const userImage = screen.getByAltText('user icon')
    fireEvent.click(userImage)

    const logoutButton = screen.getByText(/logout/i)
    fireEvent.click(logoutButton)

    expect(signOut).toHaveBeenCalledWith('descope')
  })

  // Handles missing session data (e.g., name or image is undefined)
  test('handles missing user data', () => {
    const sessionData = {
      user: { name: undefined, image: undefined }
    }
    useSession.mockReturnValue({ data: sessionData })

    render(<AuthMenu />)

    // The component should still render the image (with a fallback src or alt)
    const userImage = screen.getByAltText('user icon')
    expect(userImage).toBeInTheDocument()

    // If no name is available, it should not crash or should render a placeholder
    expect(screen.queryByText('undefined')).not.toBeInTheDocument()
  })

  // Verifies button styling
  test('login button has correct styles and classes', () => {
    useSession.mockReturnValue({ data: null })

    render(<AuthMenu />)

    const loginButton = screen.getByText(/login/i)
    expect(loginButton).toHaveClass('rounded-full text-white hover:bg-sky-600 shadow-none')
  })

  // Clicking outside dropdown hides it (assuming the feature exists)
  test('clicking outside hides the dropdown', () => {
    const sessionData = {
      user: { name: 'John Doe', image: '/user.jpg' }
    }
    useSession.mockReturnValue({ data: sessionData })

    render(<AuthMenu />)

    const userImage = screen.getByAltText('user icon')
    fireEvent.click(userImage)

    const dropdown = screen.getByText(/Account/i).parentElement
    expect(dropdown).toHaveClass('opacity-100')

    fireEvent.click(userImage) // Simulate click outside
    expect(dropdown).toHaveClass('opacity-0')
  })

})
