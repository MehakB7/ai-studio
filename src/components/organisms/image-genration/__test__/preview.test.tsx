import React from 'react';
import { render, screen } from '@testing-library/react';
import Preview from '../preview';
import { STYLES } from '@/lib/config';

const mockResult = {
	id: '1',
	imageUrl: 'https://example.com/image.png',
	prompt: 'A futuristic cityscape',
	style: 'cinematic',
	created_at: new Date().toISOString(),
};

describe('Preview Component', () => {
	it('should render image, prompt, and style', () => {
		render(<Preview result={mockResult} open={true} setOpen={() => {}} />);
		expect(screen.getByTestId('result-image')).toHaveAttribute('src', mockResult.imageUrl);
		expect(screen.getByTestId('result-prompt')).toHaveTextContent(mockResult.prompt);
		expect(screen.getByTestId('result-style')).toHaveTextContent(
			STYLES.find(s => s.value === mockResult.style)?.label || ''
		);
	});

	it('should show sheet when open is true', () => {
		render(<Preview result={mockResult} open={true} setOpen={() => {}} />);
		expect(screen.getByText(/Preview/i)).toBeInTheDocument();
		expect(screen.getByText(/AI generated image/i)).toBeInTheDocument();
	});
});
