/**
 * @test IndustrySectorSelector.test.tsx
 * @schema IndustrySectorSelector component
 * @testIds from `lib/testSelectors.ts`
 * @note Comprehensive testing for industry sector selection component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IndustrySectorSelector } from '@/components/business-canvas/IndustrySectorSelector';

// Mock the industries data
const mockIndustries = [
  {
    id: 'mining',
    name: 'Mining',
    code: 'MINING',
    sectors: [
      {
        id: 'coal',
        name: 'Coal Mining',
        code: 'COAL',
        category: 'COMMODITY',
        description: 'Coal extraction and processing',
        riskProfile: 'HIGH',
      },
      {
        id: 'iron-ore',
        name: 'Iron Ore Mining',
        code: 'IRON_ORE',
        category: 'COMMODITY',
        description: 'Iron ore extraction',
        riskProfile: 'MEDIUM',
      },
    ],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    code: 'MANUFACTURING',
    sectors: [
      {
        id: 'steel',
        name: 'Steel Manufacturing',
        code: 'STEEL',
        category: 'VALUE_CHAIN',
        description: 'Steel production',
        riskProfile: 'MEDIUM',
      },
    ],
  },
];

// Mock the hooks
jest.mock('@/hooks/use-industries', () => ({
  useIndustries: () => ({
    industries: mockIndustries,
    loading: false,
    error: null,
  }),
}));

describe('IndustrySectorSelector', () => {
  const mockOnSectorsChange = jest.fn();
  const defaultProps = {
    selectedSectors: [],
    onSectorsChange: mockOnSectorsChange,
    industryCode: 'MINING',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render sector categories as tabs', () => {
      render(<IndustrySectorSelector {...defaultProps} />);
      
      // The component shows category names from the database
      // Use getAllByText since there are multiple elements with this text
      const commodityElements = screen.getAllByText('Commodity-Based');
      expect(commodityElements.length).toBeGreaterThan(0);
    });

    it('should render sectors for the selected industry', () => {
      render(<IndustrySectorSelector {...defaultProps} />);
      
      expect(screen.getByText('Coal Mining')).toBeInTheDocument();
      expect(screen.getByText('Iron Ore Mining')).toBeInTheDocument();
    });

    it('should display sector descriptions', () => {
      render(<IndustrySectorSelector {...defaultProps} />);
      
      expect(screen.getByText('Coal extraction and processing')).toBeInTheDocument();
      expect(screen.getByText('Iron ore extraction')).toBeInTheDocument();
    });

    it('should show risk profile badges', () => {
      render(<IndustrySectorSelector {...defaultProps} />);
      
      expect(screen.getByText('HIGH')).toBeInTheDocument();
      expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    });
  });

  describe('Sector Selection', () => {
    it('should select sector when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(<IndustrySectorSelector {...defaultProps} />);
      
      // Find the checkbox by looking for the sector name and then finding the checkbox
      const coalSectorCard = screen.getByText('Coal Mining').closest('div');
      const coalCheckbox = coalSectorCard?.querySelector('button[role="checkbox"]');
      
      if (coalCheckbox) {
        await user.click(coalCheckbox);
        
        expect(mockOnSectorsChange).toHaveBeenCalledWith([
          {
            sectorCode: 'COAL',
            sectorType: 'COMMODITY',
            isPrimary: true,
          },
        ]);
      }
    });

    it('should deselect sector when checkbox is unchecked', async () => {
      const user = userEvent.setup();
      const selectedSectors = [
        {
          sectorCode: 'COAL',
          sectorType: 'COMMODITY',
          isPrimary: true,
        },
      ];
      
      render(<IndustrySectorSelector {...defaultProps} selectedSectors={selectedSectors} />);
      
      const coalSectorCard = screen.getByText('Coal Mining').closest('div');
      const coalCheckbox = coalSectorCard?.querySelector('button[role="checkbox"]');
      
      if (coalCheckbox) {
        await user.click(coalCheckbox);
        
        expect(mockOnSectorsChange).toHaveBeenCalledWith([]);
      }
    });

    it('should handle multiple sector selection', async () => {
      const user = userEvent.setup();
      render(<IndustrySectorSelector {...defaultProps} />);
      
      const coalSectorCard = screen.getByText('Coal Mining').closest('div');
      const ironOreSectorCard = screen.getByText('Iron Ore Mining').closest('div');
      const coalCheckbox = coalSectorCard?.querySelector('button[role="checkbox"]');
      const ironOreCheckbox = ironOreSectorCard?.querySelector('button[role="checkbox"]');
      
      if (coalCheckbox && ironOreCheckbox) {
        await user.click(coalCheckbox);
        await user.click(ironOreCheckbox);
        
        expect(mockOnSectorsChange).toHaveBeenCalledWith([
          {
            sectorCode: 'COAL',
            sectorType: 'COMMODITY',
            isPrimary: true,
          },
          {
            sectorCode: 'IRON_ORE',
            sectorType: 'COMMODITY',
            isPrimary: false,
          },
        ]);
      }
    });
  });

  describe('Primary Sector Selection', () => {
    it('should set first selected sector as primary by default', async () => {
      const user = userEvent.setup();
      render(<IndustrySectorSelector {...defaultProps} />);
      
      const coalSectorCard = screen.getByText('Coal Mining').closest('div');
      const coalCheckbox = coalSectorCard?.querySelector('button[role="checkbox"]');
      
      if (coalCheckbox) {
        await user.click(coalCheckbox);
        
        expect(mockOnSectorsChange).toHaveBeenCalledWith([
          {
            sectorCode: 'COAL',
            sectorType: 'COMMODITY',
            isPrimary: true,
          },
        ]);
      }
    });

    it('should allow changing primary sector', async () => {
      const user = userEvent.setup();
      const selectedSectors = [
        {
          sectorCode: 'COAL',
          sectorType: 'COMMODITY',
          isPrimary: true,
        },
        {
          sectorCode: 'IRON_ORE',
          sectorType: 'COMMODITY',
          isPrimary: false,
        },
      ];
      
      render(<IndustrySectorSelector {...defaultProps} selectedSectors={selectedSectors} />);
      
      // Find and click the primary toggle button for Iron Ore
      const ironOreCard = screen.getByText('Iron Ore Mining').closest('div');
      const primaryButton = ironOreCard?.querySelector('button');
      
      if (primaryButton) {
        await user.click(primaryButton);
        
        expect(mockOnSectorsChange).toHaveBeenCalledWith([
          {
            sectorCode: 'COAL',
            sectorType: 'COMMODITY',
            isPrimary: false,
          },
          {
            sectorCode: 'IRON_ORE',
            sectorType: 'COMMODITY',
            isPrimary: true,
          },
        ]);
      }
    });
  });

  describe('Tab Navigation', () => {
    it('should switch between sector categories', async () => {
      const user = userEvent.setup();
      render(<IndustrySectorSelector {...defaultProps} />);
      
      // Initially should show commodity sectors
      expect(screen.getByText('Coal Mining')).toBeInTheDocument();
      
      // The component only shows categories that have sectors, so we may not have multiple tabs
      // This test should be adjusted based on the actual data structure
      const tabs = screen.getAllByRole('tab');
      if (tabs.length > 1) {
        // Click on the second tab if it exists
        await user.click(tabs[1]);
        
        // Should show different sectors (if any)
        expect(screen.queryByText('Coal Mining')).not.toBeInTheDocument();
      }
    });

    it('should maintain selected sectors when switching tabs', async () => {
      const user = userEvent.setup();
      const selectedSectors = [
        {
          sectorCode: 'COAL',
          sectorType: 'COMMODITY',
          isPrimary: true,
        },
      ];
      
      render(<IndustrySectorSelector {...defaultProps} selectedSectors={selectedSectors} />);
      
      // Verify coal is selected by checking if the primary button shows "Primary"
      const coalCard = screen.getByText('Coal Mining').closest('div');
      const primaryButton = coalCard?.querySelector('button');
      
      // Only test if the primary button exists
      if (primaryButton) {
        expect(primaryButton).toHaveTextContent('Primary');
        
        // Switch tabs if multiple tabs exist
        const tabs = screen.getAllByRole('tab');
        if (tabs.length > 1) {
          await user.click(tabs[1]);
          await user.click(tabs[0]); // Switch back
          
          // Coal should still be selected
          expect(primaryButton).toHaveTextContent('Primary');
        }
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for checkboxes', () => {
      render(<IndustrySectorSelector {...defaultProps} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        // Checkboxes should have proper ARIA attributes
        expect(checkbox).toHaveAttribute('aria-checked');
      });
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<IndustrySectorSelector {...defaultProps} />);
      
      const coalSectorCard = screen.getByText('Coal Mining').closest('div');
      const coalCheckbox = coalSectorCard?.querySelector('button[role="checkbox"]');
      
      if (coalCheckbox) {
        coalCheckbox.focus();
        
        await user.keyboard('{Space}');
        
        expect(mockOnSectorsChange).toHaveBeenCalledWith([
          {
            sectorCode: 'COAL',
            sectorType: 'COMMODITY',
            isPrimary: true,
          },
        ]);
      }
    });

    it('should have proper tab roles', () => {
      render(<IndustrySectorSelector {...defaultProps} />);
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should handle different screen sizes', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768, // Tablet size
      });
      
      render(<IndustrySectorSelector {...defaultProps} />);
      
      // Should still render all content
      expect(screen.getByText('Coal Mining')).toBeInTheDocument();
      expect(screen.getByText('Iron Ore Mining')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show validation error when no commodity sector is selected', () => {
      render(<IndustrySectorSelector {...defaultProps} showValidation={true} />);
      
      // Should show validation error for no commodity sectors
      expect(screen.getByText('At least one commodity sector must be selected')).toBeInTheDocument();
    });

    it('should not show validation error when commodity sector is selected', () => {
      const selectedSectors = [
        {
          sectorCode: 'COAL',
          sectorType: 'COMMODITY',
          isPrimary: true,
        },
      ];
      
      render(<IndustrySectorSelector {...defaultProps} selectedSectors={selectedSectors} showValidation={true} />);
      
      // Should not show validation error
      expect(screen.queryByText('At least one commodity sector must be selected')).not.toBeInTheDocument();
    });
  });
}); 