import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react'; // Mock next-auth signIn function
import { Alert } from '../components/browsing'; // Adjust the import path based on your folder structure

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

// Mock the signIn function from next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('Alert Component', () => {

  it('renders the Alert component correctly', () => {
    // Render the Alert component
    render(<Alert>Open Alert</Alert>);
    
    // Check if the trigger button is rendered with correct text
    expect(screen.getByText(/Open Alert/i)).toBeInTheDocument();
    
    // Check if the dialog content is not rendered initially (should not be visible)
    expect(screen.queryByText(/Unauthenticated/i)).not.toBeInTheDocument();
  });

  it('opens the dialog when the trigger button is clicked', () => {
    // Render the Alert component
    render(<Alert>Open Alert</Alert>);
    
    // Click the trigger button to open the alert dialog
    fireEvent.click(screen.getByText(/Open Alert/i));
    
    // Check if the dialog content is rendered after clicking the trigger
    expect(screen.getByText(/Unauthenticated/i)).toBeInTheDocument();
    expect(screen.getByText(/You Need To Sign In First/i)).toBeInTheDocument();
  });

  it('calls signIn when Continue button is clicked', async () => {
    // Render the Alert component
    render(<Alert>Open Alert</Alert>);
    
    // Open the alert dialog by clicking the trigger
    fireEvent.click(screen.getByText(/Open Alert/i));
    
    // Click the Continue button
    fireEvent.click(screen.getByText(/Continue/i));
    
    // Ensure that the signIn function is called with the correct provider
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('descope');
    });
  });

  it('closes the dialog when Cancel button is clicked', () => {
    // Render the Alert component
    render(<Alert>Open Alert</Alert>);
    
    // Open the alert dialog by clicking the trigger
    fireEvent.click(screen.getByText(/Open Alert/i));
    
    // Click the Cancel button
    fireEvent.click(screen.getByText(/Cancel/i));
    
    // Check that the dialog is closed (i.e., content is not rendered)
    expect(screen.queryByText(/Unauthenticated/i)).not.toBeInTheDocument();
  });

  it('has the correct classes applied to the dialog elements', () => {
    // Render the Alert component
    render(<Alert>Open Alert</Alert>);
    
    // Open the alert dialog by clicking the trigger
    fireEvent.click(screen.getByText(/Open Alert/i));
    
    // Check the classes of the dialog elements
    const alertDialogContent = screen.getByRole('alertdialog');
    expect(alertDialogContent).toHaveClass('bg-background-color');
    expect(alertDialogContent).toHaveClass('border-1');
    
    const title = screen.getByText(/Unauthenticated/i);
    expect(title).toHaveClass('text-primary');
    
    const description = screen.getByText(/You Need To Sign In First/i);
    expect(description).toHaveClass('text-sm text-sky-500/40 font-bold tracking-wider');
    
    const cancelButton = screen.getByText(/Cancel/i);
    expect(cancelButton).toHaveClass('border-none');
    expect(cancelButton).toHaveClass('bg-background-secondary-color');
  });

  it('checks if the Continue button has correct styling', () => {
    // Render the Alert component
    render(<Alert>Open Alert</Alert>);
    
    // Open the alert dialog by clicking the trigger
    fireEvent.click(screen.getByText(/Open Alert/i));
    
    // Check if the Continue button has the correct styles
    const continueButton = screen.getByText(/Continue/i).closest('button');
    expect(continueButton).toHaveClass('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 shadow-none cursor-pointer');
  });

});
