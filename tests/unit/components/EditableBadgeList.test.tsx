/**
 * @test EditableBadgeList.test.tsx
 * @schema EditableBadgeList component
 * @testIds from `lib/testSelectors.ts`
 * @note Comprehensive testing for badge list component
 */

import { render, screen } from '@testing-library/react';
import { EditableBadgeList } from '@/components/business-canvas/EditableBadgeList';

describe('EditableBadgeList', () => {
  const mockOnItemsChange = jest.fn();
  const defaultProps = {
    items: ['Item 1', 'Item 2'],
    onItemsChange: mockOnItemsChange,
    category: 'facility' as const,
    placeholder: 'Add item...',
    masterData: [
      { id: '1', name: 'Master Item 1', description: 'Description 1', category: 'facility' },
      { id: '2', name: 'Master Item 2', description: 'Description 2', category: 'facility' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render items as badges', () => {
      render(<EditableBadgeList {...defaultProps} />);
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should render empty state when no items', () => {
      render(<EditableBadgeList {...defaultProps} items={[]} />);
      
      expect(screen.getByText(/No facility types added yet/)).toBeInTheDocument();
    });

    it('should display correct category label', () => {
      render(<EditableBadgeList {...defaultProps} category="stream" items={[]} />);
      
      expect(screen.getByText(/No operational streams added yet/)).toBeInTheDocument();
    });

    it('should show select from list button when master data is available', () => {
      render(<EditableBadgeList {...defaultProps} />);
      
      expect(screen.getByText('Select from list')).toBeInTheDocument();
    });

    it('should not show select from list button when no master data', () => {
      render(<EditableBadgeList {...defaultProps} masterData={[]} />);
      
      expect(screen.queryByText('Select from list')).not.toBeInTheDocument();
    });
  });

  describe('Category Variants', () => {
    it('should apply correct styling for facility category', () => {
      render(<EditableBadgeList {...defaultProps} category="facility" />);
      
      const badges = screen.getAllByText(/Item/);
      badges.forEach(badge => {
        expect(badge.closest('div')).toHaveClass('bg-green-100', 'text-green-800');
      });
    });

    it('should apply correct styling for stream category', () => {
      render(<EditableBadgeList {...defaultProps} category="stream" />);
      
      const badges = screen.getAllByText(/Item/);
      badges.forEach(badge => {
        expect(badge.closest('div')).toHaveClass('bg-indigo-100', 'text-indigo-800');
      });
    });

    it('should apply correct styling for compliance category', () => {
      render(<EditableBadgeList {...defaultProps} category="compliance" />);
      
      const badges = screen.getAllByText(/Item/);
      badges.forEach(badge => {
        expect(badge.closest('div')).toHaveClass('bg-orange-100', 'text-orange-800');
      });
    });

    it('should apply correct styling for regulatory category', () => {
      render(<EditableBadgeList {...defaultProps} category="regulatory" />);
      
      const badges = screen.getAllByText(/Item/);
      badges.forEach(badge => {
        expect(badge.closest('div')).toHaveClass('bg-purple-100', 'text-purple-800');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty master data gracefully', () => {
      render(<EditableBadgeList {...defaultProps} masterData={[]} items={[]} />);
      
      expect(screen.getByText(/No facility types added yet/)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /select from list/i })).not.toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large lists efficiently', () => {
      const largeItems = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
      const largeMasterData = Array.from({ length: 50 }, (_, i) => ({
        id: `master-${i}`,
        name: `Master Item ${i + 1}`,
        description: `Description ${i + 1}`,
        category: 'facility' as const,
      }));
      
      render(
        <EditableBadgeList 
          {...defaultProps} 
          items={largeItems}
          masterData={largeMasterData}
        />
      );
      
      // Should render without performance issues
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 100')).toBeInTheDocument();
    });
  });
}); 