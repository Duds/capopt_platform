/**
 * @test use-pattern-assignment.test.ts
 * @schema usePatternAssignment hook
 * @note Comprehensive testing for pattern assignment hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { usePatternAssignment } from '@/hooks/use-pattern-assignment';

// Mock the API call
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('usePatternAssignment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Pattern Assignment', () => {
    it('should assign patterns successfully', async () => {
      const mockResponse = {
        facilityTypes: ['OPEN_PIT_MINE', 'UNDERGROUND_MINE'],
        operationalStreams: ['EXTRACTION', 'PROCESSING'],
        complianceRequirements: ['WHS', 'ISO14001'],
        regulatoryFrameworks: ['Mining Act', 'Environmental Protection'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => usePatternAssignment());

      await result.current.assignPatterns({
        industry: 'MINING',
        sectors: ['COAL'],
        location: 'Queensland, Australia',
        businessSize: 'LARGE',
        riskProfile: 'HIGH',
      });

      await waitFor(() => {
        expect(result.current.assignment).toEqual(mockResponse);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/patterns/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: 'MINING',
          sectors: ['COAL'],
          location: 'Queensland, Australia',
          businessSize: 'LARGE',
          riskProfile: 'HIGH',
        }),
      });
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => usePatternAssignment());

      await result.current.assignPatterns({
        industry: 'MINING',
        sectors: ['COAL'],
        location: 'Queensland, Australia',
        businessSize: 'LARGE',
        riskProfile: 'HIGH',
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      expect(result.current.assignment).toBeNull();
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Failed to assign patterns: 500 Internal Server Error' }),
      });

      const { result } = renderHook(() => usePatternAssignment());

      await result.current.assignPatterns({
        industry: 'MINING',
        sectors: ['COAL'],
        location: 'Queensland, Australia',
        businessSize: 'LARGE',
        riskProfile: 'HIGH',
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to assign patterns: 500 Internal Server Error');
      });
    });

    it('should set loading state during assignment', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValueOnce(promise);

      const { result } = renderHook(() => usePatternAssignment());

      const assignPromise = result.current.assignPatterns({
        industry: 'MINING',
        sectors: ['COAL'],
        location: 'Queensland, Australia',
        businessSize: 'LARGE',
        riskProfile: 'HIGH',
      });

      // Should be loading
      expect(result.current.loading).toBe(true);

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => ({
          facilityTypes: ['OPEN_PIT_MINE'],
          operationalStreams: ['EXTRACTION'],
          complianceRequirements: ['WHS'],
          regulatoryFrameworks: ['Mining Act'],
        }),
      });

      await assignPromise;

      // Should not be loading anymore
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Clear Assignment', () => {
    it('should clear pattern assignment', async () => {
      const mockResponse = {
        facilityTypes: ['OPEN_PIT_MINE'],
        operationalStreams: ['EXTRACTION'],
        complianceRequirements: ['WHS'],
        regulatoryFrameworks: ['Mining Act'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => usePatternAssignment());

      // First assign patterns
      await result.current.assignPatterns({
        industry: 'MINING',
        sectors: ['COAL'],
        location: 'Queensland, Australia',
        businessSize: 'LARGE',
        riskProfile: 'HIGH',
      });

      await waitFor(() => {
        expect(result.current.assignment).toEqual(mockResponse);
      });

      // Then clear assignment
      result.current.clearAssignment();

      expect(result.current.assignment).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('Australian Business Context', () => {
    it('should handle Australian mining patterns', async () => {
      const australianMiningResponse = {
        facilityTypes: ['OPEN_PIT_MINE', 'UNDERGROUND_MINE', 'PROCESSING_PLANT'],
        operationalStreams: ['EXTRACTION', 'PROCESSING', 'TRANSPORT'],
        complianceRequirements: ['WHS', 'ISO14001', 'ICMM', 'ISO45001'],
        regulatoryFrameworks: ['Mining Act', 'Environmental Protection', 'Workplace Safety'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => australianMiningResponse,
      });

      const { result } = renderHook(() => usePatternAssignment());

      await result.current.assignPatterns({
        industry: 'MINING',
        sectors: ['COAL', 'IRON_ORE'],
        location: 'Queensland, Australia',
        businessSize: 'LARGE',
        riskProfile: 'HIGH',
      });

      await waitFor(() => {
        expect(result.current.assignment).toEqual(australianMiningResponse);
      });

      // Verify Australian-specific patterns
      expect(result.current.assignment?.complianceRequirements).toContain('WHS');
      expect(result.current.assignment?.regulatoryFrameworks).toContain('Mining Act');
    });

    it('should handle different business sizes', async () => {
      const smallBusinessResponse = {
        facilityTypes: ['SMALL_MINE'],
        operationalStreams: ['BASIC_EXTRACTION'],
        complianceRequirements: ['WHS'],
        regulatoryFrameworks: ['Mining Act'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => smallBusinessResponse,
      });

      const { result } = renderHook(() => usePatternAssignment());

      await result.current.assignPatterns({
        industry: 'MINING',
        sectors: ['COAL'],
        location: 'Queensland, Australia',
        businessSize: 'SMALL',
        riskProfile: 'LOW',
      });

      await waitFor(() => {
        expect(result.current.assignment).toEqual(smallBusinessResponse);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid input parameters', async () => {
      const { result } = renderHook(() => usePatternAssignment());

      await result.current.assignPatterns({
        industry: '',
        sectors: [],
        location: '',
        businessSize: 'INVALID' as any,
        riskProfile: 'INVALID' as any,
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => usePatternAssignment());

      await result.current.assignPatterns({
        industry: 'MINING',
        sectors: ['COAL'],
        location: 'Queensland, Australia',
        businessSize: 'LARGE',
        riskProfile: 'HIGH',
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid JSON');
      });
    });
  });

  describe('Performance', () => {
    it('should handle concurrent pattern assignments', async () => {
      const mockResponse = {
        facilityTypes: ['OPEN_PIT_MINE'],
        operationalStreams: ['EXTRACTION'],
        complianceRequirements: ['WHS'],
        regulatoryFrameworks: ['Mining Act'],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => usePatternAssignment());

      // Start multiple assignments concurrently
      const promises = [
        result.current.assignPatterns({
          industry: 'MINING',
          sectors: ['COAL'],
          location: 'Queensland, Australia',
          businessSize: 'LARGE',
          riskProfile: 'HIGH',
        }),
        result.current.assignPatterns({
          industry: 'MANUFACTURING',
          sectors: ['STEEL'],
          location: 'New South Wales, Australia',
          businessSize: 'MEDIUM',
          riskProfile: 'MEDIUM',
        }),
      ];

      await Promise.all(promises);

      // Should handle concurrent calls without issues
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
}); 