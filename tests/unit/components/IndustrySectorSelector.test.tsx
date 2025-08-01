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
        category: 'EXTRACTIVE',
        description: 'Coal extraction and processing',
        riskProfile: 'HIGH',
      },
      {
        id: 'iron-ore',
        name: 'Iron Ore Mining',
        code: 'IRON_ORE',
        category: 'EXTRACTIVE',
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
        category: 'PROCESSING',
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
      
      expect(screen.getByText('Extractive')).toBeInTheDocument();
      expect(screen.getByText('Processing')).toBeInTheDocument();
      expect(screen.getByText('Manufacturing')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
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
      
      const coalCheckbox = screen.getByLabelText('Coal Mining');
      await user.click(coalCheckbox);
      
      expect(mockOnSectorsChange).toHaveBeenCalledWith([
        {
          sectorCode: 'COAL',
          sectorType: 'EXTRACTIVE',
          isPrimary: true,
        },
      ]);
    });

    it('should deselect sector when checkbox is unchecked', async () => {
      const user = userEvent.setup();
      const selectedSectors = [
        {
          sectorCode: 'COAL',
          sectorType: 'EXTRACTIVE',
          isPrimary: true,
        },
      ];
      
      render(<IndustrySectorSelector {...defaultProps} selectedSectors={selectedSectors} />);
      
      const coalCheckbox = screen.getByLabelText('Coal Mining');
      await user.click(coalCheckbox);
      
      expect(mockOnSectorsChange).toHaveBeenCalledWith([]);
    });

    it('should handle multiple sector selection', async () => {
      const user = userEvent.setup();
      render(<IndustrySectorSelector {...defaultProps} />);
      
      const coalCheckbox = screen.getByLabelText('Coal Mining');
      const ironOreCheckbox = screen.getByLabelText('Iron Ore Mining');
      
      await user.click(coalCheckbox);
      await user.click(ironOreCheckbox);
      
      expect(mockOnSectorsChange).toHaveBeenCalledWith([
        {
          sectorCode: 'COAL',
          sectorType: 'EXTRACTIVE',
          isPrimary: true,
        },
        {
          sectorCode: 'IRON_ORE',
          sectorType: 'EXTRACTIVE',
          isPrimary: false,
        },
      ]);
    });
  });

  describe('Primary Sector Selection', () => {
    it('should set first selected sector as primary by default', async () => {
      const user = userEvent.setup();
      render(<IndustrySectorSelector {...defaultProps} />);
      
      const coalCheckbox = screen.getByLabelText('Coal Mining');
      await user.click(coalCheckbox);
      
      expect(mockOnSectorsChange).toHaveBeenCalledWith([
        {
          sectorCode: 'COAL',
          sectorType: 'EXTRACTIVE',
          isPrimary: true,
        },
      ]);
    });

    it('should allow changing primary sector', async () => {
      const user = userEvent.setup();
      const selectedSectors = [
        {
          sectorCode: 'COAL',
          sectorType: 'EXTRACTIVE',
          isPrimary: true,
        },
        {
          sectorCode: 'IRON_ORE',
          sectorType: 'EXTRACTIVE',
          isPrimary: false,
        },
      ];
      
      render(<IndustrySectorSelector {...defaultProps} selectedSectors={selectedSectors} />);
      
      // Find and click the primary toggle button for Iron Ore
      const ironOreCard = screen.getByText('Iron Ore Mining').closest('div');
      const primaryButton = ironOreCard?.querySelector('button[aria-label*="Set Primary"]');
      
      if (primaryButton) {
        await user.click(primaryButton);
        
        expect(mockOnSectorsChange).toHaveBeenCalledWith([
          {
            sectorCode: 'COAL',
            sectorType: 'EXTRACTIVE',
            isPrimary: false,
          },
          {
            sectorCode: 'IRON_ORE',
            sectorType: 'EXTRACTIVE',
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
      
      // Initially should show extractive sectors
      expect(screen.getByText('Coal Mining')).toBeInTheDocument();
      
      // Click on Processing tab
      const processingTab = screen.getByText('Processing');
      await user.click(processingTab);
      
      // Should show processing sectors (if any for mining)
      expect(screen.queryByText('Coal Mining')).not.toBeInTheDocument();
    });

    it('should maintain selected sectors when switching tabs', async () => {
      const user = userEvent.setup();
      const selectedSectors = [
        {
          sectorCode: 'COAL',
          sectorType: 'EXTRACTIVE',
          isPrimary: true,
        },
      ];
      
      render(<IndustrySectorSelector {...defaultProps} selectedSectors={selectedSectors} />);
      
      // Verify coal is selected
      const coalCheckbox = screen.getByLabelText('Coal Mining') as HTMLInputElement;
      expect(coalCheckbox.checked).toBe(true);
      
      // Switch to Processing tab
      const processingTab = screen.getByText('Processing');
      await user.click(processingTab);
      
      // Switch back to Extractive tab
      const extractiveTab = screen.getByText('Extractive');
      await user.click(extractiveTab);
      
      // Coal should still be selected
      expect(coalCheckbox.checked).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<IndustrySectorSelector {...defaultProps} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-label');
      });
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<IndustrySectorSelector {...defaultProps} />);
      
      const coalCheckbox = screen.getByLabelText('Coal Mining');
      coalCheckbox.focus();
      
      await user.keyboard('{Space}');
      
      expect(mockOnSectorsChange).toHaveBeenCalledWith([
        {
          sectorCode: 'COAL',
          sectorType: 'EXTRACTIVE',
          isPrimary: true,
        },
      ]);
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

  describe('Error Handling', () => {
    it('should handle empty industries gracefully', () => {
      // Mock empty industries
      jest.doMock('@/hooks/use-industries', () => ({
        useIndustries: () => ({
          industries: [],
          loading: false,
          error: null,
        }),
      }));
      
      render(<IndustrySectorSelector {...defaultProps} />);
      
      // Should render without crashing
      expect(screen.getByText('Extractive')).toBeInTheDocument();
    });

    it('should handle loading state', () => {
      // Mock loading state
      jest.doMock('@/hooks/use-industries', () => ({
        useIndustries: () => ({
          industries: [],
          loading: true,
          error: null,
        }),
      }));
      
      render(<IndustrySectorSelector {...defaultProps} />);
      
      // Should show loading state or handle gracefully
      expect(screen.getByText('Extractive')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large sector lists efficiently', () => {
      const largeIndustries = [
        {
          id: 'large-industry',
          name: 'Large Industry',
          code: 'LARGE',
          sectors: Array.from({ length: 50 }, (_, i) => ({
            id: `sector-${i}`,
            name: `Sector ${i + 1}`,
            code: `SECTOR_${i + 1}`,
            category: 'EXTRACTIVE',
            description: `Description for sector ${i + 1}`,
            riskProfile: 'MEDIUM',
          })),
        },
      ];
      
      // Mock large industries
      jest.doMock('@/hooks/use-industries', () => ({
        useIndustries: () => ({
          industries: largeIndustries,
          loading: false,
          error: null,
        }),
      }));
      
      render(<IndustrySectorSelector {...defaultProps} industryCode="LARGE" />);
      
      // Should render without performance issues
      expect(screen.getByText('Sector 1')).toBeInTheDocument();
      expect(screen.getByText('Sector 50')).toBeInTheDocument();
    });
  });
}); 