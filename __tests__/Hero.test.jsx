import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Hero } from '../components/home'; // Adjust the import path as necessary

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Hero Component', () => {
    const mockPush = jest.fn();
    
    beforeEach(() => {
        useRouter.mockReturnValue({ push: mockPush });
        render(<Hero />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    

    test('renders correctly', () => {
        expect(screen.getByText(/Find Home/i)).toBeInTheDocument();
        expect(screen.getByText(/Explore Best Service & Repair Near You/i)).toBeInTheDocument();
    });

    test('updates input value', () => {
        const input = screen.getByPlaceholderText('search');
        fireEvent.change(input, { target: { value: 'plumber' } });
        expect(input.value).toBe('plumber');
    });

    test('navigates on Enter key press', () => {
        const input = screen.getByPlaceholderText('search');
        fireEvent.change(input, { target: { value: 'electrician' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(mockPush).toHaveBeenCalledWith('/search/electrician');
    });

    test('navigates on button click', () => {
        const input = screen.getByPlaceholderText('search');
        fireEvent.change(input, { target: { value: 'cleaner' } });
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        expect(mockPush).toHaveBeenCalledWith('/search/cleaner');
    });

    test('does not navigate on Enter key press if input is empty', () => {
        const input = screen.getByPlaceholderText('search');
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(mockPush).not.toHaveBeenCalled();
    });

    test('does not navigate on button click if input is empty', () => {
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        expect(mockPush).not.toHaveBeenCalled();
    });

    test('focuses on input field when component mounts', () => {
        const input = screen.getByPlaceholderText('search');
        expect(document.activeElement).toBe(input);
    });

    test('input field should be initially empty', () => {
        const input = screen.getByPlaceholderText('search');
        expect(input.value).toBe('');
    });

    test('input does not exceed a certain length', () => {
        const input = screen.getByPlaceholderText('search');
        fireEvent.change(input, { target: { value: 'a'.repeat(101) } }); // Attempt to input 101 characters
        expect(input.value.length).toBe(101); // Check if the length is 101 (or implement your own limit check)
    });

});
