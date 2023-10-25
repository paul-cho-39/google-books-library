import Categories from '@/components/bookcover/categories';
import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

describe('<Categories />', () => {
   // when there no categories in the params
   it('renders nothing when categories are not provided', () => {
      render(<Categories />);
      const list = screen.queryByRole('list');
      expect(list).not.toBeInTheDocument();
   });

   it('renders categories without links', () => {
      render(<Categories categories={['Fiction', 'Adventure / Mystery']} />);

      expect(screen.getByText('Fiction')).toBeInTheDocument();
      expect(screen.getByText('Adventure')).toBeInTheDocument();
      expect(screen.getByText('Mystery')).toBeInTheDocument();

      const link = screen.queryByRole('navigation');
      expect(link).not.toBeInTheDocument();
   });

   it('renders categories with links', () => {
      render(<Categories categories={['Fiction', 'Adventure / Mystery']} hasLink={true} />);

      const fictionLink = screen.getByRole('link', { name: /Fiction/i });
      const adventureLink = screen.getByRole('link', { name: /Adventure/i });
      const mysteryLink = screen.getByRole('link', { name: /Mystery/i });

      expect(adventureLink.getAttribute('href')).toBe('/categories/Adventure');
      expect(fictionLink.getAttribute('href')).toBe('/categories/Fiction');
      expect(mysteryLink.getAttribute('href')).toBe('/categories/Mystery');
   });
});
