import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../header';
import ThemeProvider from '@/providers/themeProvider';

// mock router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/guest-booking',
}));

describe('Header', () => {
  const renderWithProviders = () =>
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

  it('should change theme when theme button is clicked', async () => {
    renderWithProviders();
    const themeButton = screen.getByTestId("theme-button")
    fireEvent.click(themeButton);
    await waitFor(() => {
      expect(document.documentElement.className).not.toBe('');
    });
  });
  
  it('should navigate to root page when link is clicked', () => {
    renderWithProviders();
    const homeLink = screen.getByTestId("link-home");
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
